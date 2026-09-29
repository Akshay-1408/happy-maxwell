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

    const saved = await prisma.savedCareer.findMany({
      where: { userId: user.id },
      include: { career: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(saved)
  } catch (error) {
    console.error('Fetch saved careers error:', error)
    return NextResponse.json({ error: 'Failed to fetch saved careers' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { careerId } = await req.json()
    if (!careerId) {
      return NextResponse.json({ error: 'Career ID is required' }, { status: 400 })
    }

    const existing = await prisma.savedCareer.findUnique({
      where: {
        userId_careerId: {
          userId: user.id,
          careerId,
        },
      },
    })

    if (existing) {
      await prisma.savedCareer.delete({
        where: { id: existing.id },
      })
      return NextResponse.json({ saved: false })
    } else {
      const newSaved = await prisma.savedCareer.create({
        data: {
          userId: user.id,
          careerId,
        },
      })
      return NextResponse.json({ saved: true, data: newSaved })
    }
  } catch (error) {
    console.error('Toggle saved career error:', error)
    return NextResponse.json({ error: 'Failed to update saved career' }, { status: 500 })
  }
}
