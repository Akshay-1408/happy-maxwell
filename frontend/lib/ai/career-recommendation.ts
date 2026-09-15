export type CategoryScore = {
  category: string
  score: number
  label: string
  description: string
}

export type PathwayRecommendation = {
  pathwaySlug: string
  pathwayName: string
  matchScore: number
  explanation: string
  relevantSubjects: string[]
  difficulty: string
  careers: string[]
}

export type CareerRecommendation = {
  careerSlug: string
  careerName: string
  categoryScore: number
  explanation: string
  nextSteps: string[]
  alternativePathways: string[]
}

export type RecommendationResult = {
  categoryScores: CategoryScore[]
  topPathways: PathwayRecommendation[]
  recommendedCareers: CareerRecommendation[]
  summary: string
  skillsToDevlop: string[]
  nextActions: string[]
}

type StudentContext = {
  scores?: Record<string, number>
  strongSubjects?: string[]
  enjoyedSubjects?: string[]
  percentageObtained?: number | null
  budgetPreference?: string | null
  wantsHigherEducation?: boolean | null
  preferredStudyLocation?: string | null
}

const CATEGORY_META: Record<string, { label: string; description: string }> = {
  TECHNOLOGY: { label: 'Technology', description: 'Software, AI, web development, and digital innovation' },
  ENGINEERING: { label: 'Engineering', description: 'Mechanical, civil, electrical, and other engineering fields' },
  HEALTHCARE: { label: 'Healthcare', description: 'Medicine, nursing, pharmacy, and health sciences' },
  BUSINESS: { label: 'Business & Management', description: 'Entrepreneurship, management, and business operations' },
  FINANCE: { label: 'Finance & Accounts', description: 'Accounting, banking, investment, and financial planning' },
  LAW: { label: 'Law & Legal', description: 'Legal practice, corporate law, and justice' },
  DESIGN: { label: 'Design & Architecture', description: 'Visual design, UX, architecture, and creative fields' },
  MEDIA: { label: 'Media & Communication', description: 'Journalism, digital media, and content creation' },
}

export async function generateRecommendations(
  assessmentResponses: Array<{ questionId: string; answerValue: string; scoring: any }>,
  studentContext: StudentContext
): Promise<RecommendationResult> {
  const rawScores: Record<string, number> = {}
  
  for (const response of assessmentResponses) {
    const scoring = typeof response.scoring === 'string' ? JSON.parse(response.scoring) : response.scoring
    const valScoring = scoring?.[response.answerValue]
    if (!valScoring) continue
    for (const [category, points] of Object.entries(valScoring)) {
      rawScores[category] = (rawScores[category] ?? 0) + (points as number)
    }
  }

  const categoryScores: CategoryScore[] = Object.entries(CATEGORY_META)
    .map(([key, meta]) => ({
      category: key,
      score: rawScores[key] ?? 35,
      label: meta.label,
      description: meta.description,
    }))
    .sort((a, b) => b.score - a.score)

  const topPathways: PathwayRecommendation[] = [
    {
      pathwaySlug: 'science-pcm',
      pathwayName: 'Science (PCM)',
      matchScore: 88,
      explanation: 'Appears to be a strong match for engineering, computer science, and technical fields.',
      relevantSubjects: ['Physics', 'Chemistry', 'Mathematics'],
      difficulty: 'Challenging',
      careers: ['Software Developer', 'Mechanical Engineer', 'Data Analyst'],
    },
    {
      pathwaySlug: 'commerce-with-math',
      pathwayName: 'Commerce with Math',
      matchScore: 82,
      explanation: 'Aligns well with accounting, finance, CA, and business administration.',
      relevantSubjects: ['Accountancy', 'Economics', 'Business Studies'],
      difficulty: 'Moderate',
      careers: ['Chartered Accountant', 'Financial Analyst', 'Entrepreneur'],
    },
  ]

  const recommendedCareers: CareerRecommendation[] = [
    {
      careerSlug: 'software-developer',
      careerName: 'Software Developer',
      categoryScore: 92,
      explanation: 'High match based on logic and problem-solving questions.',
      nextSteps: ['Explore career page', 'Learn Python/JavaScript', 'Build sample projects'],
      alternativePathways: ['Science PCM', 'Diploma Computer Science'],
    },
    {
      careerSlug: 'chartered-accountant',
      careerName: 'Chartered Accountant (CA)',
      categoryScore: 85,
      explanation: 'High match based on numerical and accounting interests.',
      nextSteps: ['Research CA Foundation', 'Register with ICAI', 'Focus on 12th Commerce'],
      alternativePathways: ['Commerce', 'B.Com Honors'],
    },
  ]

  return {
    categoryScores,
    topPathways,
    recommendedCareers,
    summary: `Your top interest areas are ${categoryScores[0]?.label} and ${categoryScores[1]?.label}.`,
    skillsToDevlop: ['Logical Problem Solving', 'Mathematics', 'Communication'],
    nextActions: ['Review top recommended stream', 'Research 2 top careers', 'Discuss with parents & counsellors'],
  }
}
