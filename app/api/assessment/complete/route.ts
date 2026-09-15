import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth.config'
import prisma from '@/lib/db/prisma'
import { generateRecommendations } from '@/lib/ai/career-recommendation'

export async function POST(req: Request) {
  try {
    const session = await auth()
    const { assessmentId, guestResponses } = await req.json()

    let responsesData: Array<{ questionId: string; answerValue: string; scoring: any }> = []
    let studentContext = {}

    if (session?.user?.id && assessmentId !== 'guest-session') {
      const dbResponses = await prisma.assessmentResponse.findMany({
        where: { assessmentId },
        include: { question: true },
      })

      responsesData = dbResponses.map((r) => ({
        questionId: r.questionId,
        answerValue: r.answerValue,
        scoring: r.question.scoring,
      }))

      const profile = await prisma.studentProfile.findUnique({
        where: { userId: session.user.id },
      })

      if (profile) {
        studentContext = {
          enjoyedSubjects: profile.enjoyedSubjects ? JSON.parse(profile.enjoyedSubjects) : [],
          strongSubjects: profile.strongSubjects ? JSON.parse(profile.strongSubjects) : [],
          percentageObtained: profile.percentageObtained,
          budgetPreference: profile.budgetPreference,
          preferredStudyLocation: profile.preferredStudyLocation,
        }
      }
    } else if (Array.isArray(guestResponses)) {
      const questionIds = guestResponses.map((r: any) => r.questionId)
      const questions = await prisma.assessmentQuestion.findMany({
        where: { id: { in: questionIds } },
      })

      const questionMap = new Map(questions.map((q) => [q.id, q]))

      responsesData = guestResponses.map((r: any) => ({
        questionId: r.questionId,
        answerValue: r.answerValue,
        scoring: questionMap.get(r.questionId)?.scoring || {},
      }))
    }

    // Generate recommendation result using scoring engine
    const recommendationResult = await generateRecommendations(responsesData, studentContext)

    if (session?.user?.id && assessmentId !== 'guest-session') {
      // Save AssessmentResult in database
      await prisma.assessmentResult.create({
        data: {
          assessmentId,
          userId: session.user.id,
          categoryScores: JSON.stringify(recommendationResult.categoryScores),
          topPathways: JSON.stringify(recommendationResult.topPathways),
          recommendedCareers: JSON.stringify(recommendationResult.recommendedCareers),
          summary: recommendationResult.summary,
          skillsToDevelop: JSON.stringify(recommendationResult.skillsToDevlop),
          nextActions: JSON.stringify(recommendationResult.nextActions),
        },
      })

      // Update assessment status to COMPLETED
      await prisma.assessment.update({
        where: { id: assessmentId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      })
    }

    return NextResponse.json(recommendationResult)
  } catch (error) {
    console.error('Complete assessment error:', error)
    return NextResponse.json({ error: 'Failed to process assessment completion' }, { status: 500 })
  }
}
