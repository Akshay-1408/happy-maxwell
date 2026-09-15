import { NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const stream = searchParams.get('stream')

    const where: any = { isActive: true }
    if (stream && stream !== 'ALL') {
      where.stream = stream
    }

    const pathways = await prisma.pathway.findMany({
      where,
      orderBy: { orderIndex: 'asc' },
    })

    const formattedPathways = pathways.map((p) => ({
      ...p,
      keySubjects: typeof p.keySubjects === 'string' ? JSON.parse(p.keySubjects) : p.keySubjects,
      entranceExams: typeof p.entranceExams === 'string' ? JSON.parse(p.entranceExams) : p.entranceExams,
      higherEducationOptions: typeof p.higherEducationOptions === 'string' ? JSON.parse(p.higherEducationOptions) : p.higherEducationOptions,
      commonCareers: typeof p.commonCareers === 'string' ? JSON.parse(p.commonCareers) : p.commonCareers,
      steps: typeof p.steps === 'string' ? JSON.parse(p.steps) : p.steps,
    }))

    return NextResponse.json(formattedPathways)
  } catch (error) {
    console.error('Fetch pathways error:', error)
    return NextResponse.json({ error: 'Failed to fetch pathways' }, { status: 500 })
  }
}
