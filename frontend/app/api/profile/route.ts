import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth.config'
import prisma from '@/lib/db/prisma'
import { StudentProfileSchema } from '@/lib/validation/schemas'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    })

    return NextResponse.json(profile || {})
  } catch (error) {
    console.error('Fetch profile error:', error)
    return NextResponse.json({ error: 'Failed to fetch student profile' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = StudentProfileSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0]?.message || 'Invalid input' }, { status: 400 })
    }

    const data = validated.data
    const profile = await prisma.studentProfile.upsert({
      where: { userId: session.user.id },
      update: {
        studentName: data.studentName,
        age: data.age,
        currentClass: data.currentClass,
        board: data.board,
        state: data.state,
        city: data.city,
        percentageObtained: data.percentageObtained,
        isPercentageExpected: data.isPercentageExpected,
        strongSubjects: data.strongSubjects,
        enjoyedSubjects: data.enjoyedSubjects,
        dislikedSubjects: data.dislikedSubjects,
        preferredStudyLocation: data.preferredStudyLocation,
        budgetPreference: data.budgetPreference,
        wantsHigherEducation: data.wantsHigherEducation,
        careerInterests: data.careerInterests,
      },
      create: {
        userId: session.user.id,
        studentName: data.studentName,
        age: data.age,
        currentClass: data.currentClass,
        board: data.board,
        state: data.state,
        city: data.city,
        percentageObtained: data.percentageObtained,
        isPercentageExpected: data.isPercentageExpected,
        strongSubjects: data.strongSubjects,
        enjoyedSubjects: data.enjoyedSubjects,
        dislikedSubjects: data.dislikedSubjects,
        preferredStudyLocation: data.preferredStudyLocation,
        budgetPreference: data.budgetPreference,
        wantsHigherEducation: data.wantsHigherEducation,
        careerInterests: data.careerInterests,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Failed to update student profile' }, { status: 500 })
  }
}
