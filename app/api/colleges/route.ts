import { NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const state = searchParams.get('state')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const where: any = {}

    if (state && state !== 'ALL') {
      where.state = state
    }

    if (type && type !== 'ALL') {
      where.type = type
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ]
    }

    const colleges = await prisma.college.findMany({
      where,
      include: { courses: true },
      orderBy: { ranking: 'asc' },
    })

    return NextResponse.json({
      data: colleges,
      count: colleges.length,
    })
  } catch (error) {
    console.error('Fetch colleges error:', error)
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 })
  }
}
