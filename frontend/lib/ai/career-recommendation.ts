/**
 * SmartCareer Recommendation Service
 * 
 * Architecture:
 * - Primary: Deterministic scoring engine (works without any API key)
 * - Future: Can swap in OpenAI/Gemini by setting API keys in .env
 * 
 * The scoring engine maps assessment answers to career interest categories,
 * combines with student profile data, and returns ranked recommendations.
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

function computePathwayScore(pathwaySlug: string, scores: Record<string, number>): number {
  const mapping = PATHWAY_CAREER_MAP[pathwaySlug]
  if (!mapping) return 0
  const relevantScores = mapping.minCategories.map(cat => scores[cat] ?? 0)
  if (relevantScores.length === 0) return 0
  return Math.round(relevantScores.reduce((a, b) => a + b, 0) / relevantScores.length)
}

function generatePathwayExplanation(pathwaySlug: string, scores: Record<string, number>, studentContext: StudentContext): string {
  const topCategories = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat]) => CATEGORY_META[cat]?.label ?? cat)
  
  const pathwayMeta: Record<string, string> = {
    'science-pcm': `Science with PCM appears to be a strong match based on your interest in ${topCategories.slice(0, 2).join(' and ')}. This stream provides a foundation for engineering, technology, and mathematics-focused careers.`,
    'science-pcb': `Science with PCB aligns well with your expressed interest in healthcare and biological sciences. This is the recommended path for students exploring medicine, nursing, and allied health.`,
    'science-pcmb': `Science with PCMB (all four subjects) may suit you if you want to keep both engineering and medical options open. It is a demanding combination that offers maximum flexibility.`,
    'commerce-with-math': `Commerce with Mathematics aligns with your interest in ${topCategories.slice(0, 2).join(' and ')}. This stream opens doors to finance, CA, economics, and business-related careers.`,
    'commerce-no-math': `Commerce without Mathematics suits your interest profile and offers flexibility in business, management, law, and communications.`,
    'arts-humanities': `Arts and Humanities appears to be a strong match given your interest in ${topCategories.slice(0, 2).join(' and ')}. This stream leads to careers in law, civil services, media, social work, and education.`,
    'diploma-engineering': `A Diploma in Engineering (Polytechnic) could be a practical and cost-effective pathway for your interest in technical fields. It allows direct employment or lateral entry into a degree.`,
    'vocational-iti': `Vocational and ITI programs offer practical skill-based training and a faster route to employment. Suitable if you prefer hands-on learning over academic study.`,
  }
  
  return pathwayMeta[pathwaySlug] ?? `This pathway aligns with your assessed interest areas.`
}

function generateCareerExplanation(careerSlug: string, categories: string[], scores: Record<string, number>): string {
  const relevantScores = categories.map(cat => ({ cat: CATEGORY_META[cat]?.label ?? cat, score: scores[cat] ?? 0 }))
  const topArea = relevantScores.sort((a, b) => b.score - a.score)[0]
  
  const explanations: Record<string, string> = {
    'software-developer': `Technology-related pathways appear to be a strong match based on your interest in problem-solving and digital tools. Software development combines logical thinking with creative engineering.`,
    'data-analyst': `Data analysis may align well with your aptitude for mathematics and interest in finding patterns. This career suits those who enjoy working with numbers and communicating insights.`,
    'ai-ml-engineer': `Your interest in technology and mathematics suggests AI/ML engineering as a potential fit. This field is at the cutting edge of computer science and requires strong mathematical foundations.`,
    'doctor-mbbs': `Your expressed interest in healthcare and helping people suggests medicine as a potential pathway. MBBS is a long but deeply rewarding journey for those committed to patient care.`,
    'chartered-accountant': `Your interest in finance and business suggests Chartered Accountancy as a potential match. CA is a prestigious and in-demand qualification in India's financial sector.`,
    'lawyer-advocate': `Your interest in law, social issues, and analytical thinking aligns with a legal career. Law rewards strong reading, reasoning, and communication abilities.`,
    'civil-services-officer': `Your interest in governance and public service suggests the civil services pathway. UPSC is extremely competitive but offers unparalleled opportunity to serve the nation.`,
    'ui-ux-designer': `Your interest in design and technology aligns with UI/UX design. This field rewards both creative visual thinking and understanding how users interact with products.`,
    'journalist': `Your interest in writing, communication, and social issues suggests journalism as a potential fit. Modern journalism spans print, digital, and broadcast media.`,
  }
  
  return explanations[careerSlug] 
    ?? `Your interest in ${topArea?.cat ?? 'this area'} (score: ${topArea?.score ?? 0}/100) suggests this career may be worth exploring further.`
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
    'History': ['SOCIAL_SCIENCE', 'GOVERNMENT'],
    'Political Science': ['GOVERNMENT', 'LAW', 'SOCIAL_SCIENCE'],
    'English': ['MEDIA', 'EDUCATION', 'LAW'],
    'Art': ['DESIGN'],
    'Business Studies': ['BUSINESS'],
    'Sociology': ['SOCIAL_SCIENCE'],
    'Psychology': ['SOCIAL_SCIENCE', 'HEALTHCARE'],
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
  
  const pathwayScores = Object.keys(PATHWAY_CAREER_MAP).map(slug => ({
    slug,
    score: computePathwayScore(slug, normalizedScores),
  })).sort((a, b) => b.score - a.score)
  
  const topPathways: PathwayRecommendation[] = pathwayScores.slice(0, 4).map(({ slug, score }) => {
    const mapping = PATHWAY_CAREER_MAP[slug]
    return {
      pathwaySlug: slug,
      pathwayName: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      matchScore: score > 0 ? score : 65,
      explanation: generatePathwayExplanation(slug, normalizedScores, studentContext),
      relevantSubjects: mapping.minCategories.flatMap(cat => {
        if (cat === 'TECHNOLOGY') return ['Mathematics', 'Computer Science']
        if (cat === 'ENGINEERING') return ['Physics', 'Mathematics']
        if (cat === 'HEALTHCARE') return ['Biology', 'Chemistry']
        if (cat === 'FINANCE') return ['Accountancy', 'Mathematics', 'Economics']
        if (cat === 'BUSINESS') return ['Business Studies', 'Economics']
        if (cat === 'LAW') return ['English', 'Political Science']
        if (cat === 'DESIGN') return ['Art', 'Mathematics']
        if (cat === 'MEDIA') return ['English', 'Journalism']
        if (cat === 'GOVERNMENT') return ['Political Science', 'History', 'Geography']
        if (cat === 'SOCIAL_SCIENCE') return ['Sociology', 'Psychology', 'History']
        return []
      }).filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
      difficulty: mapping.minCategories.includes('HEALTHCARE') || mapping.minCategories.includes('TECHNOLOGY') ? 'Challenging' : 'Moderate',
      careers: Object.entries(CAREER_CATEGORY_MAP)
        .filter(([, cats]) => cats.some(c => mapping.minCategories.includes(c)))
        .map(([slug]) => slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
        .slice(0, 4),
    }
  })
  
  const careerScores = Object.entries(CAREER_CATEGORY_MAP).map(([slug, cats]) => {
    const avgScore = cats.reduce((sum, cat) => sum + (normalizedScores[cat] ?? 25), 0) / cats.length
    return { slug, score: Math.round(avgScore), categories: cats }
  }).sort((a, b) => b.score - a.score)
  
  const recommendedCareers: CareerRecommendation[] = careerScores.slice(0, 6).map(({ slug, score, categories }) => ({
    careerSlug: slug,
    careerName: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    categoryScore: score,
    explanation: generateCareerExplanation(slug, categories, normalizedScores),
    nextSteps: [
      `Research the ${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} career page on SmartCareer`,
      'Talk to a professional in this field',
      'Explore online resources and introductory courses',
    ],
    alternativePathways: topPathways.slice(0, 2).map(p => p.pathwayName),
  }))
  
  const topCategory = categoryScores[0]
  const secondCategory = categoryScores[1]
  const summary = `Based on your assessment, your strongest interest areas are ${topCategory.label} and ${secondCategory.label}. \nThe pathways that appear to be the strongest fit are ${topPathways[0]?.pathwayName} and ${topPathways[1]?.pathwayName}. \nRemember — this is a starting point for exploration, not a final decision. You are encouraged to explore multiple options, speak with professionals, and revisit your assessment as your interests evolve.`
  
  const skillsToDevlop = categoryScores.slice(0, 3).flatMap(cat => {
    const skillMap: Record<string, string[]> = {
      TECHNOLOGY: ['Basic programming (Python or JavaScript)', 'Logical thinking', 'Mathematics problem-solving'],
      ENGINEERING: ['Physics fundamentals', 'Technical drawing', 'Mathematics'],
      HEALTHCARE: ['Biology and Chemistry', 'Empathy and communication', 'First-aid basics'],
      BUSINESS: ['Communication and presentation', 'Basic financial literacy', 'Leadership activities'],
      FINANCE: ['Mathematics and accounting basics', 'Excel and spreadsheets', 'Financial news reading'],
      LAW: ['Reading and writing practice', 'Debating and public speaking', 'Current affairs'],
      DESIGN: ['Drawing and sketching', 'Digital tools (Canva, Figma basics)', 'Visual thinking'],
      MEDIA: ['Writing practice', 'Photography or video basics', 'Current affairs reading'],
      EDUCATION: ['Subject expertise', 'Communication and patience', 'Reading widely'],
      GOVERNMENT: ['NCERT History/Polity/Geography reading', 'Current affairs', 'Essay writing'],
      SOCIAL_SCIENCE: ['Reading about society and psychology', 'Empathy and listening skills', 'Research basics'],
      SCIENCE: ['Physics and Chemistry experiments', 'Scientific reading habits', 'Mathematics'],
      VOCATIONAL: ['Trade-specific skills', 'Industry certifications', 'Workshop exposure'],
    }
    return skillMap[cat.category] ?? []
  }).filter((v, i, a) => a.indexOf(v) === i).slice(0, 6)
  
  const nextActions = [
    `Explore the ${topPathways[0]?.pathwayName ?? 'recommended'} pathway in detail`,
    `Research these careers: ${recommendedCareers.slice(0, 2).map(c => c.careerName).join(', ')}`,
    'Talk to students or professionals in your top interest areas',
    'Discuss your assessment results with a parent or school counsellor',
    'Save careers you find interesting for future reference',
  ]
  
  return {
    categoryScores,
    topPathways,
    recommendedCareers,
    summary,
    skillsToDevlop,
    nextActions,
  }
}
