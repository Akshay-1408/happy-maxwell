import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/clerk-sync'
import prisma from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const latestResult = await prisma.assessmentResult.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    if (!latestResult) {
      return NextResponse.json({ error: 'No assessment result found' }, { status: 404 })
    }

    const parseJson = (val: any) => {
      if (typeof val === 'string') {
        try { return JSON.parse(val) } catch { return val }
      }
      return val ?? []
    }

    return NextResponse.json({
      ...latestResult,
      categoryScores: parseJson(latestResult.categoryScores),
      topPathways: parseJson(latestResult.topPathways),
      recommendedCareers: parseJson(latestResult.recommendedCareers),
      strengths: parseJson(latestResult.strengths),
      skillsToDevelop: parseJson(latestResult.skillsToDevelop),
      nextActions: parseJson(latestResult.nextActions),
      roadmap: parseJson(latestResult.roadmap),
    })
  } catch (error) {
    console.error('Fetch result error:', error)
    return NextResponse.json({ error: 'Failed to fetch assessment results' }, { status: 500 })
  }
}
