import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/clerk-sync'
import prisma from '@/lib/db/prisma'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user?.id) {
      return NextResponse.json([])
    }

    const saved = await prisma.savedCollege.findMany({
      where: { userId: user.id },
      include: {
        college: {
          include: { courses: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(saved)
  } catch (error) {
    console.error('Fetch saved colleges error:', error)
    return NextResponse.json({ error: 'Failed to fetch saved colleges' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Please sign in to save colleges' }, { status: 401 })
    }

    const { collegeId, action } = await req.json()

    if (!collegeId) {
      return NextResponse.json({ error: 'College ID is required' }, { status: 400 })
    }

    if (action === 'remove') {
      await prisma.savedCollege.deleteMany({
        where: {
          userId: user.id,
          collegeId,
        },
      })
      return NextResponse.json({ saved: false })
    }

    const saved = await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId: user.id,
          collegeId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        collegeId,
      },
    })

    return NextResponse.json({ saved: true, data: saved })
  } catch (error) {
    console.error('Toggle save college error:', error)
    return NextResponse.json({ error: 'Failed to bookmark college' }, { status: 500 })
  }
}
