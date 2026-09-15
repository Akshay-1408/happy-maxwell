import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth.config'
import prisma from '@/lib/db/prisma'

export async function POST(req: Request) {
  try {
    const session = await auth()
    const { assessmentId, responses } = await req.json()

    if (!assessmentId || !Array.isArray(responses)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    if (session?.user?.id && assessmentId !== 'guest-session') {
      for (const res of responses) {
        await prisma.assessmentResponse.upsert({
          where: {
            assessmentId_questionId: {
              assessmentId,
              questionId: res.questionId,
            },
          },
          update: {
            answerValue: res.answerValue.toString(),
          },
          create: {
            assessmentId,
            questionId: res.questionId,
            answerValue: res.answerValue.toString(),
          },
        })
      }
    }

    return NextResponse.json({ success: true, count: responses.length })
  } catch (error) {
    console.error('Save assessment error:', error)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}
