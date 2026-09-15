import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth.config'
import prisma from '@/lib/db/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const latestResult = await prisma.assessmentResult.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    if (!latestResult) {
      return NextResponse.json({ error: 'No assessment result found' }, { status: 404 })
    }

    return NextResponse.json({
      ...latestResult,
      categoryScores: JSON.parse(latestResult.categoryScores),
      topPathways: JSON.parse(latestResult.topPathways),
      recommendedCareers: JSON.parse(latestResult.recommendedCareers),
      skillsToDevelop: JSON.parse(latestResult.skillsToDevelop),
      nextActions: JSON.parse(latestResult.nextActions),
    })
  } catch (error) {
    console.error('Fetch result error:', error)
    return NextResponse.json({ error: 'Failed to fetch assessment results' }, { status: 500 })
  }
}
