import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/clerk-sync'
import prisma from '@/lib/db/prisma'
import { generateRecommendations, StudentContext } from '@/lib/ai/career-recommendation'

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    const { assessmentId, guestResponses } = await req.json()

    let responsesData: Array<{ questionId: string; answerValue: string; scoring: any }> = []
    let studentContext: StudentContext = {}

    if (user?.id) {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
      })

      if (profile) {
        studentContext = {
          studentName: profile.studentName,
          percentageObtained: profile.percentageObtained,
          mathMarks: profile.mathMarks,
          scienceMarks: profile.scienceMarks,
          englishMarks: profile.englishMarks,
          socialMarks: profile.socialMarks,
          strongSubjects: profile.strongSubjects ?? [],
          enjoyedSubjects: profile.enjoyedSubjects ?? [],
          dislikedSubjects: profile.dislikedSubjects ?? [],
          hobbies: profile.hobbies ?? [],
          learningStyle: profile.learningStyle,
          workEnvironment: profile.workEnvironment,
          preferredStudyLocation: profile.preferredStudyLocation,
          budgetPreference: profile.budgetPreference,
          govtPrivatePref: profile.govtPrivatePref,
          careerInterests: profile.careerInterests ?? [],
        }
      }
    }

    if (user?.id && assessmentId && assessmentId !== 'guest-session') {
      const dbResponses = await prisma.assessmentResponse.findMany({
        where: { assessmentId },
        include: { question: true },
      })

      if (dbResponses.length > 0) {
        responsesData = dbResponses.map((r) => ({
          questionId: r.questionId,
          answerValue: r.answerValue,
          scoring: r.question.scoring,
        }))
      } else if (Array.isArray(guestResponses)) {
        // Fallback to submitted answers if not yet synced to DB
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

        // Save into db
        for (const res of guestResponses) {
          await prisma.assessmentResponse.upsert({
            where: {
              assessmentId_questionId: {
                assessmentId,
                questionId: res.questionId,
              },
            },
            update: { answerValue: res.answerValue.toString() },
            create: {
              assessmentId,
              questionId: res.questionId,
              answerValue: res.answerValue.toString(),
            },
          })
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

    // Generate recommendation result using deterministic scoring engine
    const recommendationResult = await generateRecommendations(responsesData, studentContext)

    if (user?.id && assessmentId && assessmentId !== 'guest-session') {
      // Save AssessmentResult in database
      await prisma.assessmentResult.create({
        data: {
          assessmentId,
          userId: user.id,
          categoryScores: recommendationResult.categoryScores,
          topPathways: recommendationResult.topPathways,
          recommendedCareers: recommendationResult.recommendedCareers,
          summary: recommendationResult.summary,
          strengths: recommendationResult.strengths,
          skillsToDevelop: recommendationResult.skillsToDevelop,
          nextActions: recommendationResult.nextActions,
          roadmap: recommendationResult.roadmap,
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
