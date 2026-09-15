import { NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'

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
      ]
    }

    const colleges = await prisma.college.findMany({
      where,
      include: { courses: true },
      take: 20,
    })

    return NextResponse.json({
      data: colleges,
      isDemoData: true,
      notice: 'The college data provided is demonstration data for career exploration.',
    })
  } catch (error) {
    console.error('Fetch colleges error:', error)
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 })
  }
}
