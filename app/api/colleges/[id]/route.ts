import { NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const college = await prisma.college.findUnique({
      where: { id: params.id },
      include: { courses: true },
    })

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 })
    }

    return NextResponse.json(college)
  } catch (error) {
    console.error('Fetch college error:', error)
    return NextResponse.json({ error: 'Failed to fetch college' }, { status: 500 })
  }
}
