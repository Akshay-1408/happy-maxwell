import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth.config'
import prisma from '@/lib/db/prisma'

export async function POST() {
  try {
    const session = await auth()
    
    // Fetch all active questions ordered by display order
    const questions = await prisma.assessmentQuestion.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
    })

    if (session?.user?.id) {
      // Check for existing in-progress assessment
      let assessment = await prisma.assessment.findFirst({
        where: {
          userId: session.user.id,
          status: 'IN_PROGRESS',
        },
      })

      if (!assessment) {
        assessment = await prisma.assessment.create({
          data: {
            userId: session.user.id,
            status: 'IN_PROGRESS',
          },
        })
      }

      return NextResponse.json({
        assessmentId: assessment.id,
        questions,
      })
    }

    // Guest user flow
    return NextResponse.json({
      assessmentId: 'guest-session',
      questions,
    })
  } catch (error) {
    console.error('Start assessment error:', error)
    return NextResponse.json({ error: 'Failed to initialize assessment' }, { status: 500 })
  }
}
