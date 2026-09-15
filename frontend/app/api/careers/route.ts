import { NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categorySlug = searchParams.get('category')
    const search = searchParams.get('search')
    const featuredOnly = searchParams.get('featured') === 'true'

    const where: any = { isActive: true }

    if (featuredOnly) {
      where.isFeatured = true
    }

    if (categorySlug && categorySlug !== 'all') {
      const category = await prisma.careerCategory.findUnique({
        where: { slug: categorySlug },
      })
      if (category) {
        where.categoryId = category.id
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ]
    }

    const careers = await prisma.career.findMany({
      where,
      include: { category: true },
      orderBy: { orderIndex: 'asc' },
    })

    const formattedCareers = careers.map((c) => ({
      ...c,
      relevantStreams: typeof c.relevantStreams === 'string' ? JSON.parse(c.relevantStreams) : c.relevantStreams,
      requiredEducation: typeof c.requiredEducation === 'string' ? JSON.parse(c.requiredEducation) : c.requiredEducation,
      skills: typeof c.skills === 'string' ? JSON.parse(c.skills) : c.skills,
      toolsUsed: typeof c.toolsUsed === 'string' ? JSON.parse(c.toolsUsed) : c.toolsUsed,
      pros: typeof c.pros === 'string' ? JSON.parse(c.pros) : c.pros,
      challenges: typeof c.challenges === 'string' ? JSON.parse(c.challenges) : c.challenges,
    }))

    return NextResponse.json(formattedCareers)
  } catch (error) {
    console.error('Fetch careers error:', error)
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 })
  }
}
