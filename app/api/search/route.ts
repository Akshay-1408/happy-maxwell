import { NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')?.trim()

    if (!query || query.length < 2) {
      return NextResponse.json({ careers: [], colleges: [], pathways: [] })
    }

    const [careers, colleges, pathways] = await Promise.all([
      prisma.career.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { shortDescription: { contains: query, mode: 'insensitive' } },
            { skills: { has: query } },
          ],
        },
        include: { category: true },
        take: 5,
      }),
      prisma.college.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
            { state: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { courses: true },
        take: 5,
      }),
      prisma.pathway.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { shortDescription: { contains: query, mode: 'insensitive' } },
            { stream: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 4,
      }),
    ])

    return NextResponse.json({
      careers,
      colleges,
      pathways,
      totalCount: careers.length + colleges.length + pathways.length,
    })
  } catch (error) {
    console.error('Global search error:', error)
    return NextResponse.json({ error: 'Failed to execute search' }, { status: 500 })
  }
}
