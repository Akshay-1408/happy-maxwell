import { NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const career = await prisma.career.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    })

    if (!career) {
      return NextResponse.json({ error: 'Career not found' }, { status: 404 })
    }

    const formattedCareer = {
      ...career,
      relevantStreams: typeof career.relevantStreams === 'string' ? JSON.parse(career.relevantStreams) : career.relevantStreams,
      requiredEducation: typeof career.requiredEducation === 'string' ? JSON.parse(career.requiredEducation) : career.requiredEducation,
      skills: typeof career.skills === 'string' ? JSON.parse(career.skills) : career.skills,
      toolsUsed: typeof career.toolsUsed === 'string' ? JSON.parse(career.toolsUsed) : career.toolsUsed,
      pros: typeof career.pros === 'string' ? JSON.parse(career.pros) : career.pros,
      challenges: typeof career.challenges === 'string' ? JSON.parse(career.challenges) : career.challenges,
      alternativeRoutes: typeof career.alternativeRoutes === 'string' ? JSON.parse(career.alternativeRoutes) : career.alternativeRoutes,
    }

    return NextResponse.json(formattedCareer)
  } catch (error) {
    console.error('Fetch career detail error:', error)
    return NextResponse.json({ error: 'Failed to fetch career details' }, { status: 500 })
  }
}
