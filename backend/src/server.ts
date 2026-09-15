import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './db/prisma.js'
import { generateRecommendations } from './services/recommendationService.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: '*' }))
app.use(express.json())

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'SmartCareer Backend API Running', timestamp: new Date() })
})

// ─── Careers API ──────────────────────────────────────────────────────────────
app.get('/api/careers', async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query
    const where: any = { isActive: true }

    if (category && category !== 'all') {
      const cat = await prisma.careerCategory.findUnique({ where: { slug: category as string } })
      if (cat) where.categoryId = cat.id
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { shortDescription: { contains: search as string } },
      ]
    }

    const careers = await prisma.career.findMany({
      where,
      include: { category: true },
      orderBy: { orderIndex: 'asc' },
    })

    const formatted = careers.map(c => ({
      ...c,
      relevantStreams: typeof c.relevantStreams === 'string' ? JSON.parse(c.relevantStreams) : c.relevantStreams,
      requiredEducation: typeof c.requiredEducation === 'string' ? JSON.parse(c.requiredEducation) : c.requiredEducation,
      skills: typeof c.skills === 'string' ? JSON.parse(c.skills) : c.skills,
      toolsUsed: typeof c.toolsUsed === 'string' ? JSON.parse(c.toolsUsed) : c.toolsUsed,
      pros: typeof c.pros === 'string' ? JSON.parse(c.pros) : c.pros,
      challenges: typeof c.challenges === 'string' ? JSON.parse(c.challenges) : c.challenges,
    }))

    res.json(formatted)
  } catch (error) {
    console.error('Fetch careers error:', error)
    res.status(500).json({ error: 'Failed to fetch careers' })
  }
})

app.get('/api/careers/:slug', async (req: Request, res: Response) => {
  try {
    const career = await prisma.career.findUnique({
      where: { slug: req.params.slug },
      include: { category: true },
    })
    if (!career) return res.status(404).json({ error: 'Career not found' })

    const formatted = {
      ...career,
      relevantStreams: typeof career.relevantStreams === 'string' ? JSON.parse(career.relevantStreams) : career.relevantStreams,
      requiredEducation: typeof career.requiredEducation === 'string' ? JSON.parse(career.requiredEducation) : career.requiredEducation,
      skills: typeof career.skills === 'string' ? JSON.parse(career.skills) : career.skills,
      toolsUsed: typeof career.toolsUsed === 'string' ? JSON.parse(career.toolsUsed) : career.toolsUsed,
      pros: typeof career.pros === 'string' ? JSON.parse(career.pros) : career.pros,
      challenges: typeof career.challenges === 'string' ? JSON.parse(career.challenges) : career.challenges,
      alternativeRoutes: typeof career.alternativeRoutes === 'string' ? JSON.parse(career.alternativeRoutes) : career.alternativeRoutes,
    }

    res.json(formatted)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch career details' })
  }
})

// ─── Pathways API ─────────────────────────────────────────────────────────────
app.get('/api/pathways', async (req: Request, res: Response) => {
  try {
    const { stream } = req.query
    const where: any = { isActive: true }
    if (stream && stream !== 'ALL') where.stream = stream as string

    const pathways = await prisma.pathway.findMany({ where, orderBy: { orderIndex: 'asc' } })

    const formatted = pathways.map(p => ({
      ...p,
      keySubjects: typeof p.keySubjects === 'string' ? JSON.parse(p.keySubjects) : p.keySubjects,
      entranceExams: typeof p.entranceExams === 'string' ? JSON.parse(p.entranceExams) : p.entranceExams,
      higherEducationOptions: typeof p.higherEducationOptions === 'string' ? JSON.parse(p.higherEducationOptions) : p.higherEducationOptions,
      commonCareers: typeof p.commonCareers === 'string' ? JSON.parse(p.commonCareers) : p.commonCareers,
      steps: typeof p.steps === 'string' ? JSON.parse(p.steps) : p.steps,
    }))

    res.json(formatted)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pathways' })
  }
})

// ─── Assessment API ───────────────────────────────────────────────────────────
app.post('/api/assessment/start', async (req: Request, res: Response) => {
  try {
    const questions = await prisma.assessmentQuestion.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
    })
    res.json({ assessmentId: 'session-' + Date.now(), questions })
  } catch (error) {
    res.status(500).json({ error: 'Failed to start assessment' })
  }
})

app.post('/api/assessment/complete', async (req: Request, res: Response) => {
  try {
    const { guestResponses } = req.body
    const result = generateRecommendations(guestResponses || [], {})
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate recommendations' })
  }
})

// ─── Colleges API ─────────────────────────────────────────────────────────────
app.get('/api/colleges', async (req: Request, res: Response) => {
  try {
    const colleges = await prisma.college.findMany({
      include: { courses: true },
      take: 20,
    })
    res.json({ data: colleges, isDemoData: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch colleges' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 SmartCareer Backend API running on http://localhost:${PORT}`)
})
