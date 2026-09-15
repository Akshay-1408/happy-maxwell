/**
 * SmartCareer Backend Recommendation Service
 */

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
  EDUCATION: { label: 'Education & Research', description: 'Teaching, academia, and educational leadership' },
  GOVERNMENT: { label: 'Government & Public Service', description: 'Civil services, administration, and public sector' },
  SCIENCE: { label: 'Pure & Applied Science', description: 'Physics, chemistry, biology, and research' },
  SOCIAL_SCIENCE: { label: 'Social Sciences', description: 'Psychology, sociology, and social studies' },
  VOCATIONAL: { label: 'Skilled & Vocational', description: 'Trade skills and technical certifications' },
}

const PATHWAY_CAREER_MAP: Record<string, { slug: string; minCategories: string[]; minScore: number }> = {
  'science-pcm': { slug: 'science-pcm', minCategories: ['TECHNOLOGY', 'ENGINEERING', 'SCIENCE'], minScore: 40 },
  'science-pcb': { slug: 'science-pcb', minCategories: ['HEALTHCARE', 'SCIENCE'], minScore: 40 },
  'science-pcmb': { slug: 'science-pcmb', minCategories: ['HEALTHCARE', 'TECHNOLOGY', 'SCIENCE'], minScore: 35 },
  'commerce-with-math': { slug: 'commerce-with-math', minCategories: ['FINANCE', 'BUSINESS', 'LAW'], minScore: 35 },
  'commerce-no-math': { slug: 'commerce-no-math', minCategories: ['BUSINESS', 'MEDIA', 'SOCIAL_SCIENCE'], minScore: 30 },
  'arts-humanities': { slug: 'arts-humanities', minCategories: ['SOCIAL_SCIENCE', 'LAW', 'MEDIA', 'EDUCATION', 'GOVERNMENT'], minScore: 30 },
  'diploma-engineering': { slug: 'diploma-engineering', minCategories: ['ENGINEERING', 'TECHNOLOGY'], minScore: 30 },
  'vocational-iti': { slug: 'vocational-iti', minCategories: ['VOCATIONAL', 'ENGINEERING'], minScore: 20 },
}

const CAREER_CATEGORY_MAP: Record<string, string[]> = {
  'software-developer': ['TECHNOLOGY'],
  'data-analyst': ['TECHNOLOGY', 'FINANCE'],
  'ai-ml-engineer': ['TECHNOLOGY', 'SCIENCE'],
  'cybersecurity-analyst': ['TECHNOLOGY', 'ENGINEERING'],
  'mechanical-engineer': ['ENGINEERING'],
  'civil-engineer': ['ENGINEERING'],
  'doctor-mbbs': ['HEALTHCARE', 'SCIENCE'],
  'nurse': ['HEALTHCARE'],
  'pharmacist': ['HEALTHCARE', 'SCIENCE'],
  'chartered-accountant': ['FINANCE', 'BUSINESS'],
  'financial-analyst': ['FINANCE'],
  'company-secretary': ['FINANCE', 'LAW'],
  'lawyer-advocate': ['LAW'],
  'ui-ux-designer': ['DESIGN', 'TECHNOLOGY'],
  'graphic-designer': ['DESIGN'],
  'architect': ['DESIGN', 'ENGINEERING'],
  'journalist': ['MEDIA'],
  'digital-marketing-specialist': ['BUSINESS', 'MEDIA'],
  'teacher-educator': ['EDUCATION'],
  'civil-services-officer': ['GOVERNMENT', 'SOCIAL_SCIENCE'],
  'psychologist': ['SOCIAL_SCIENCE', 'HEALTHCARE'],
  'entrepreneur': ['BUSINESS'],
}

export function generateRecommendations(
  assessmentResponses: Array<{ questionId: string; answerValue: string; scoring: any }>,
  studentContext: StudentContext
): RecommendationResult {
  const rawScores: Record<string, number> = {}

  for (const response of assessmentResponses) {
    const scoring = typeof response.scoring === 'string' ? JSON.parse(response.scoring) : response.scoring
    const valScoring = scoring?.[response.answerValue]
    if (!valScoring) continue
    for (const [category, points] of Object.entries(valScoring)) {
      rawScores[category] = (rawScores[category] ?? 0) + (points as number)
    }
  }

  const maxPossible = 100
  const normalizedScores: Record<string, number> = {}
  for (const [cat, score] of Object.entries(rawScores)) {
    normalizedScores[cat] = Math.min(100, Math.round((score / maxPossible) * 100))
  }

  const subjectCategoryMap: Record<string, string[]> = {
    'Mathematics': ['TECHNOLOGY', 'ENGINEERING', 'FINANCE', 'SCIENCE'],
    'Science': ['ENGINEERING', 'HEALTHCARE', 'SCIENCE'],
    'Biology': ['HEALTHCARE', 'SCIENCE'],
    'Computer Science': ['TECHNOLOGY'],
    'Physics': ['ENGINEERING', 'SCIENCE'],
    'Chemistry': ['HEALTHCARE', 'SCIENCE'],
    'Accountancy': ['FINANCE', 'BUSINESS'],
    'Economics': ['FINANCE', 'BUSINESS', 'SOCIAL_SCIENCE'],
  }

  for (const subject of (studentContext.enjoyedSubjects ?? [])) {
    const cats = subjectCategoryMap[subject] ?? []
    for (const cat of cats) {
      normalizedScores[cat] = Math.min(100, (normalizedScores[cat] ?? 0) + 8)
    }
  }

  const categoryScores: CategoryScore[] = Object.entries(CATEGORY_META)
    .map(([key, meta]) => ({
      category: key,
      score: normalizedScores[key] ?? 20,
      label: meta.label,
      description: meta.description,
    }))
    .sort((a, b) => b.score - a.score)

  const topPathways: PathwayRecommendation[] = Object.keys(PATHWAY_CAREER_MAP).slice(0, 4).map((slug) => {
    const mapping = PATHWAY_CAREER_MAP[slug]
    const avgScore = mapping.minCategories.reduce((sum, cat) => sum + (normalizedScores[cat] ?? 25), 0) / mapping.minCategories.length
    return {
      pathwaySlug: slug,
      pathwayName: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      matchScore: Math.round(avgScore) > 0 ? Math.round(avgScore) : 65,
      explanation: `Aligns with your top interests in ${mapping.minCategories.join(' and ')}.`,
      relevantSubjects: ['Mathematics', 'Science', 'English'],
      difficulty: 'Moderate',
      careers: ['Software Developer', 'Data Analyst', 'Engineer'],
    }
  })

  const recommendedCareers: CareerRecommendation[] = Object.entries(CAREER_CATEGORY_MAP).slice(0, 6).map(([slug, cats]) => {
    const score = Math.round(cats.reduce((sum, c) => sum + (normalizedScores[c] ?? 25), 0) / cats.length)
    return {
      careerSlug: slug,
      careerName: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      categoryScore: score,
      explanation: `Strong match based on your interest profile score.`,
      nextSteps: [`Research ${slug} in directory`, 'Speak with professionals', 'Take introductory course'],
      alternativePathways: ['Science PCM', 'Commerce'],
    }
  })

  return {
    categoryScores,
    topPathways,
    recommendedCareers,
    summary: `Your strongest interest areas are ${categoryScores[0]?.label} and ${categoryScores[1]?.label}.`,
    skillsToDevlop: ['Problem Solving', 'Logical Thinking', 'Communication'],
    nextActions: ['Explore recommended pathways', 'Review target careers', 'Consult parents & counsellors'],
  }
}
