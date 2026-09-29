import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/clerk-sync'
import prisma from '@/lib/db/prisma'
import { StudentProfileSchema } from '@/lib/validation/schemas'

export const dynamic = 'force-dynamic'

function calculateCompletionPercentage(profile: any): number {
  if (!profile) return 0
  const fields = [
    profile.studentName,
    profile.age,
    profile.board,
    profile.state,
    profile.city,
    profile.percentageObtained,
    profile.mathMarks,
    profile.scienceMarks,
    profile.englishMarks,
    profile.learningStyle,
    profile.workEnvironment,
    profile.preferredStudyLocation,
    profile.budgetPreference,
    profile.govtPrivatePref,
    profile.strongSubjects?.length > 0,
    profile.enjoyedSubjects?.length > 0,
    profile.careerInterests?.length > 0,
  ]

  const completedCount = fields.filter(Boolean).length
  return Math.round((completedCount / fields.length) * 100)
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    })

    if (!profile) {
      return NextResponse.json({ completionPercentage: 0 })
    }

    const completionPercentage = calculateCompletionPercentage(profile)

    return NextResponse.json({
      ...profile,
      completionPercentage,
    })
  } catch (error) {
    console.error('Fetch profile error:', error)
    return NextResponse.json({ error: 'Failed to fetch student profile' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = StudentProfileSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0]?.message || 'Invalid input' }, { status: 400 })
    }

    const data = validated.data
    const profile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        studentName: data.studentName,
        age: data.age,
        currentClass: data.currentClass,
        board: data.board,
        state: data.state,
        city: data.city,
        percentageObtained: data.percentageObtained,
        isPercentageExpected: data.isPercentageExpected,
        mathMarks: data.mathMarks,
        scienceMarks: data.scienceMarks,
        englishMarks: data.englishMarks,
        socialMarks: data.socialMarks,
        strongSubjects: data.strongSubjects,
        enjoyedSubjects: data.enjoyedSubjects,
        dislikedSubjects: data.dislikedSubjects,
        hobbies: data.hobbies,
        learningStyle: data.learningStyle,
        workEnvironment: data.workEnvironment,
        preferredStudyLocation: data.preferredStudyLocation,
        budgetPreference: data.budgetPreference,
        govtPrivatePref: data.govtPrivatePref,
        targetCity: data.targetCity,
        wantsHigherEducation: data.wantsHigherEducation,
        careerInterests: data.careerInterests,
      },
      create: {
        userId: user.id,
        studentName: data.studentName,
        age: data.age,
        currentClass: data.currentClass,
        board: data.board,
        state: data.state,
        city: data.city,
        percentageObtained: data.percentageObtained,
        isPercentageExpected: data.isPercentageExpected,
        mathMarks: data.mathMarks,
        scienceMarks: data.scienceMarks,
        englishMarks: data.englishMarks,
        socialMarks: data.socialMarks,
        strongSubjects: data.strongSubjects,
        enjoyedSubjects: data.enjoyedSubjects,
        dislikedSubjects: data.dislikedSubjects,
        hobbies: data.hobbies,
        learningStyle: data.learningStyle,
        workEnvironment: data.workEnvironment,
        preferredStudyLocation: data.preferredStudyLocation,
        budgetPreference: data.budgetPreference,
        govtPrivatePref: data.govtPrivatePref,
        targetCity: data.targetCity,
        wantsHigherEducation: data.wantsHigherEducation,
        careerInterests: data.careerInterests,
      },
    })

    const completionPercentage = calculateCompletionPercentage(profile)

    return NextResponse.json({
      ...profile,
      completionPercentage,
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Failed to update student profile' }, { status: 500 })
  }
}
