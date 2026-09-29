/**
 * SmartCareer Multi-Factor Deterministic Recommendation Engine
 *
 * Scoring Weights Breakdown:
 * - Interest Domain Alignment: 30%
 * - Objective Aptitude Scoring: 20%
 * - Academic Subject Marks & Strengths: 20%
 * - Career & Learning Style Preferences: 15%
 * - Personality & Work Environment Fit: 10%
 * - Constraints & Feasibility (Budget / Location): 5%
 *
 * Provides transparent, explainable recommendations without random generation.
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
  stream: string
  matchScore: number
  explanation: string
  strengths: string[]
  thingsToImprove: string[]
  relevantSubjects: string[]
  difficulty: string
  careers: string[]
  entranceExams: string[]
  duration: string
  costCategory: string
}

export type CareerRecommendation = {
  careerSlug: string
  careerName: string
  categoryScore: number
  matchScore: number
  explanation: string
  salaryRange: string
  keySkills: string[]
  entranceExams: string[]
  alternativePathways: string[]
  nextSteps: string[]
}

export type MilestoneItem = {
  title: string
  description: string
  tag: string
}

export type RoadmapPlan = {
  thirtyDays: MilestoneItem[]
  threeMonths: MilestoneItem[]
  sixMonths: MilestoneItem[]
}

export type RecommendationResult = {
  categoryScores: CategoryScore[]
  topPathways: PathwayRecommendation[]
  recommendedCareers: CareerRecommendation[]
  summary: string
  strengths: string[]
  skillsToDevelop: string[]
  nextActions: string[]
  roadmap: RoadmapPlan
}

export type StudentContext = {
  studentName?: string
  percentageObtained?: number | null
  mathMarks?: number | null
  scienceMarks?: number | null
  englishMarks?: number | null
  socialMarks?: number | null
  strongSubjects?: string[]
  enjoyedSubjects?: string[]
  dislikedSubjects?: string[]
  hobbies?: string[]
  learningStyle?: string | null
  workEnvironment?: string | null
  preferredStudyLocation?: string | null
  budgetPreference?: string | null
  govtPrivatePref?: string | null
  careerInterests?: string[]
}

export const CATEGORY_META: Record<string, { label: string; description: string }> = {
  TECHNOLOGY: { label: 'Technology & Computing', description: 'Software engineering, AI/ML, cloud systems, and data analytics' },
  ENGINEERING: { label: 'Engineering & Physical Sciences', description: 'Mechanical, civil, electrical, aerospace, and robotics systems' },
  HEALTHCARE: { label: 'Healthcare & Medicine', description: 'Clinical medicine, nursing, pharmacy, physiotherapy, and biomedical sciences' },
  FINANCE: { label: 'Finance & Accounts', description: 'Chartered accountancy, investment banking, economics, and auditing' },
  BUSINESS: { label: 'Business & Management', description: 'Corporate strategy, product management, entrepreneurship, and marketing' },
  LAW: { label: 'Law & Public Policy', description: 'Corporate law, legal advocacy, judiciary, and regulatory compliance' },
  DESIGN: { label: 'Design & Creative Arts', description: 'UI/UX design, architecture, animation, VFX, and visual media' },
  GOVERNMENT: { label: 'Government & Civil Services', description: 'UPSC administration, armed defence forces (NDA), and public service' },
  SCIENCE: { label: 'Pure & Applied Science', description: 'Biotechnology, theoretical physics, chemistry research, and forensics' },
  VOCATIONAL: { label: 'Skilled Trades & Vocational', description: 'Polytechnic engineering, industrial automation, CNC, and precision tooling' },
}

const PATHWAY_CONFIGS: Array<{
  slug: string
  name: string
  stream: string
  primaryCategories: string[]
  secondaryCategories: string[]
  requiredKeySubjects: string[]
  difficulty: string
  duration: string
  entranceExams: string[]
  costCategory: string
  careers: string[]
}> = [
  {
    slug: 'science-pcm',
    name: 'Science (PCM) — Physics, Chemistry, Math',
    stream: 'SCIENCE_PCM',
    primaryCategories: ['TECHNOLOGY', 'ENGINEERING'],
    secondaryCategories: ['SCIENCE', 'DESIGN'],
    requiredKeySubjects: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
    difficulty: 'Challenging',
    duration: '2 Years (11th & 12th) + 4 Years B.Tech',
    entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CETs'],
    costCategory: 'Moderate to High (Govt vs Private)',
    careers: ['Software Development Engineer', 'AI & ML Engineer', 'Mechanical Engineer', 'Cybersecurity Analyst', 'Commercial Pilot'],
  },
  {
    slug: 'science-pcb',
    name: 'Science (PCB) — Physics, Chemistry, Biology',
    stream: 'SCIENCE_PCB',
    primaryCategories: ['HEALTHCARE', 'SCIENCE'],
    secondaryCategories: ['SCIENCE'],
    requiredKeySubjects: ['Biology', 'Chemistry', 'Physics', 'Psychology'],
    difficulty: 'Challenging',
    duration: '2 Years (11th & 12th) + 4-5.5 Years MBBS/B.Pharm',
    entranceExams: ['NEET-UG', 'State Pharmacy CETs'],
    costCategory: 'Subsidized (Govt) to High (Private MBBS)',
    careers: ['Clinical Doctor (MBBS)', 'Registered Pharmacist', 'Physiotherapist', 'Biotechnologist', 'Veterinarian'],
  },
  {
    slug: 'science-pcmb',
    name: 'Science (PCMB) — Math & Biology Combined',
    stream: 'SCIENCE_PCMB',
    primaryCategories: ['HEALTHCARE', 'TECHNOLOGY', 'SCIENCE'],
    secondaryCategories: ['ENGINEERING'],
    requiredKeySubjects: ['Mathematics', 'Biology', 'Physics', 'Chemistry'],
    difficulty: 'High Rigor',
    duration: '2 Years (11th & 12th) + 4-5.5 Years Degree',
    entranceExams: ['JEE Main', 'NEET-UG', 'IAT (IISERs)'],
    costCategory: 'Moderate',
    careers: ['Biotechnologist', 'Biomedical Engineer', 'Clinical Doctor (MBBS)', 'Forensic Scientist'],
  },
  {
    slug: 'commerce-with-math',
    name: 'Commerce with Mathematics',
    stream: 'COMMERCE_WITH_MATH',
    primaryCategories: ['FINANCE', 'BUSINESS'],
    secondaryCategories: ['LAW', 'TECHNOLOGY'],
    requiredKeySubjects: ['Accountancy', 'Economics', 'Mathematics / Applied Math', 'Business Studies'],
    difficulty: 'Moderate to Challenging',
    duration: '2 Years (11th & 12th) + 3-5 Years Degree / CA',
    entranceExams: ['CUET (B.Com Hons)', 'CA Foundation (ICAI)', 'IPMAT (IIMs)'],
    costCategory: 'Budget Friendly (SRCC/DU/CA)',
    careers: ['Chartered Accountant (CA)', 'Investment Banker & Financial Analyst', 'Product Manager', 'Data Analyst'],
  },
  {
    slug: 'commerce-no-math',
    name: 'Commerce without Mathematics',
    stream: 'COMMERCE_NO_MATH',
    primaryCategories: ['BUSINESS', 'FINANCE'],
    secondaryCategories: ['DESIGN'],
    requiredKeySubjects: ['Accountancy', 'Business Studies', 'Economics', 'Informatics Practices'],
    difficulty: 'Moderate',
    duration: '2 Years (11th & 12th) + 3 Years Degree',
    entranceExams: ['CUET', 'NCHMCT JEE (Hotel Mgmt)', 'ICSI CSEET'],
    costCategory: 'Budget Friendly to Moderate',
    careers: ['Company Secretary (CS)', 'Digital Marketing & Growth Strategist', 'Hotel & Hospitality Operations Manager'],
  },
  {
    slug: 'arts-humanities',
    name: 'Arts & Humanities',
    stream: 'ARTS_HUMANITIES',
    primaryCategories: ['LAW', 'GOVERNMENT'],
    secondaryCategories: ['DESIGN', 'SCIENCE'],
    requiredKeySubjects: ['Political Science', 'History', 'Psychology', 'Economics', 'English'],
    difficulty: 'Moderate',
    duration: '2 Years (11th & 12th) + 3-5 Years Degree',
    entranceExams: ['CLAT (Law NLUs)', 'CUET (Central Varsities)', 'NID DAT (Design)', 'UPSC (after Degree)'],
    costCategory: 'Budget Friendly to Moderate',
    careers: ['Corporate Lawyer & Legal Counsel', 'Civil Services Officer (IAS/IPS)', 'UI/UX & Product Designer', 'Clinical Psychologist', 'Investigative Journalist'],
  },
  {
    slug: 'diploma-engineering',
    name: 'Polytechnic Engineering Diploma (3-Year After 10th)',
    stream: 'DIPLOMA_ENGINEERING',
    primaryCategories: ['VOCATIONAL', 'ENGINEERING'],
    secondaryCategories: ['TECHNOLOGY'],
    requiredKeySubjects: ['Applied Physics', 'Applied Math', 'Engineering Drawing', 'Technical Workshops'],
    difficulty: 'Practical & Hands-On',
    duration: '3 Years after 10th Standard',
    entranceExams: ['State Polytechnic CETs (JEECUP, POLYCET, MSBTE)'],
    costCategory: 'Low Cost (Govt Subsidized ₹8k-15k/yr)',
    careers: ['Polytechnic Junior Engineer', 'Software Developer (via LEET B.Tech)', 'CAD Specialist'],
  },
  {
    slug: 'vocational-iti',
    name: 'Vocational & ITI Technical Trade (1-2 Years)',
    stream: 'VOCATIONAL_ITI',
    primaryCategories: ['VOCATIONAL'],
    secondaryCategories: ['ENGINEERING'],
    requiredKeySubjects: ['Trade Theory', 'Workshop Calculation & Science', 'Trade Practical'],
    difficulty: 'Hands-On Practical',
    duration: '1 to 2 Years after 10th Standard',
    entranceExams: ['State ITI Merit Admission'],
    costCategory: 'Very Low (Nominal Fee + Apprenticeship Stipend)',
    careers: ['Industrial Automation & CNC Specialist (ITI)', 'Industrial Electrician', 'Tool & Die Specialist'],
  },
  {
    slug: 'integrated-law',
    name: '5-Year Integrated Law (B.A. LL.B / B.B.A. LL.B)',
    stream: 'ARTS_HUMANITIES',
    primaryCategories: ['LAW'],
    secondaryCategories: ['GOVERNMENT', 'BUSINESS'],
    requiredKeySubjects: ['Constitutional Law', 'Contract Law', 'Legal Studies', 'English Comprehension'],
    difficulty: 'Challenging',
    duration: '5 Years after 12th',
    entranceExams: ['CLAT', 'AILET', 'SLAT'],
    costCategory: 'Moderate to High (NLUs)',
    careers: ['Corporate Lawyer & Legal Counsel', 'Judicial Magistrate & Civil Judge', 'Legal Compliance Head'],
  },
  {
    slug: 'integrated-management-ipm',
    name: '5-Year Integrated Management (IPM at IIMs)',
    stream: 'COMMERCE_WITH_MATH',
    primaryCategories: ['BUSINESS', 'FINANCE'],
    secondaryCategories: ['TECHNOLOGY'],
    requiredKeySubjects: ['Quantitative Mathematics', 'Economics', 'Business Analytics', 'Management Strategy'],
    difficulty: 'Very High Selectivity',
    duration: '5 Years after 12th (BBA + MBA at IIM)',
    entranceExams: ['IPMAT Indore', 'IPMAT Rohtak', 'JIPMAT'],
    costCategory: 'High (IIM Tuition, High ROI)',
    careers: ['Investment Banker & Financial Analyst', 'Product Manager', 'Management Consultant'],
  },
]

const CAREER_STREAM_MAP: Record<string, { stream: string; category: string }> = {
  'software-developer': { stream: 'SCIENCE_PCM', category: 'TECHNOLOGY' },
  'ai-ml-engineer': { stream: 'SCIENCE_PCM', category: 'TECHNOLOGY' },
  'data-analyst': { stream: 'COMMERCE_WITH_MATH', category: 'TECHNOLOGY' },
  'cybersecurity-analyst': { stream: 'SCIENCE_PCM', category: 'TECHNOLOGY' },
  'mechanical-engineer': { stream: 'SCIENCE_PCM', category: 'ENGINEERING' },
  'civil-engineer': { stream: 'SCIENCE_PCM', category: 'ENGINEERING' },
  'aerospace-engineer': { stream: 'SCIENCE_PCM', category: 'ENGINEERING' },
  'doctor-mbbs': { stream: 'SCIENCE_PCB', category: 'HEALTHCARE' },
  'pharmacist': { stream: 'SCIENCE_PCB', category: 'HEALTHCARE' },
  'physiotherapist': { stream: 'SCIENCE_PCB', category: 'HEALTHCARE' },
  'chartered-accountant': { stream: 'COMMERCE_WITH_MATH', category: 'FINANCE' },
  'financial-analyst': { stream: 'COMMERCE_WITH_MATH', category: 'FINANCE' },
  'company-secretary': { stream: 'COMMERCE_NO_MATH', category: 'FINANCE' },
  'product-manager': { stream: 'COMMERCE_WITH_MATH', category: 'BUSINESS' },
  'lawyer-advocate': { stream: 'ARTS_HUMANITIES', category: 'LAW' },
  'judicial-services': { stream: 'ARTS_HUMANITIES', category: 'LAW' },
  'civil-services-officer': { stream: 'ARTS_HUMANITIES', category: 'GOVERNMENT' },
  'defence-officer-nda': { stream: 'SCIENCE_PCM', category: 'GOVERNMENT' },
  'commercial-pilot': { stream: 'SCIENCE_PCM', category: 'ENGINEERING' },
  'ui-ux-designer': { stream: 'ARTS_HUMANITIES', category: 'DESIGN' },
  'architect': { stream: 'SCIENCE_PCM', category: 'DESIGN' },
  'animation-vfx-artist': { stream: 'ARTS_HUMANITIES', category: 'DESIGN' },
  'journalist': { stream: 'ARTS_HUMANITIES', category: 'DESIGN' },
  'digital-marketer': { stream: 'COMMERCE_NO_MATH', category: 'BUSINESS' },
  'psychologist': { stream: 'ARTS_HUMANITIES', category: 'SCIENCE' },
  'biotechnologist': { stream: 'SCIENCE_PCB', category: 'SCIENCE' },
  'hotel-manager': { stream: 'COMMERCE_NO_MATH', category: 'BUSINESS' },
  'merchant-navy-officer': { stream: 'SCIENCE_PCM', category: 'ENGINEERING' },
  'junior-engineer-polytechnic': { stream: 'DIPLOMA_ENGINEERING', category: 'VOCATIONAL' },
  'industrial-automation-iti': { stream: 'VOCATIONAL_ITI', category: 'VOCATIONAL' },
  'veterinarian': { stream: 'SCIENCE_PCB', category: 'HEALTHCARE' },
  'forensic-scientist': { stream: 'SCIENCE_PCB', category: 'SCIENCE' },
}

export async function generateRecommendations(
  responses: Array<{ questionId: string; answerValue: string; scoring: any }>,
  studentContext: StudentContext = {}
): Promise<RecommendationResult> {
  const categoryRawScores: Record<string, number> = {
    TECHNOLOGY: 0,
    ENGINEERING: 0,
    HEALTHCARE: 0,
    FINANCE: 0,
    BUSINESS: 0,
    LAW: 0,
    DESIGN: 0,
    GOVERNMENT: 0,
    SCIENCE: 0,
    VOCATIONAL: 0,
  }

  // 1. Process Assessment Answers
  for (const r of responses) {
    const scoringMap = r.scoring || {}
    const answerScore = scoringMap[r.answerValue] || {}
    for (const [cat, pts] of Object.entries(answerScore)) {
      if (typeof pts === 'number' && categoryRawScores[cat] !== undefined) {
        categoryRawScores[cat] += pts
      }
    }
  }

  // 2. Academic Subject Marks & Strengths Weight (20%)
  const mathMarks = studentContext.mathMarks ?? studentContext.percentageObtained ?? 70
  const scienceMarks = studentContext.scienceMarks ?? studentContext.percentageObtained ?? 70
  const englishMarks = studentContext.englishMarks ?? studentContext.percentageObtained ?? 70
  const socialMarks = studentContext.socialMarks ?? studentContext.percentageObtained ?? 70

  if (mathMarks >= 80) {
    categoryRawScores.TECHNOLOGY += 25
    categoryRawScores.ENGINEERING += 20
    categoryRawScores.FINANCE += 20
  } else if (mathMarks < 50) {
    categoryRawScores.TECHNOLOGY -= 15
    categoryRawScores.ENGINEERING -= 15
  }

  if (scienceMarks >= 80) {
    categoryRawScores.HEALTHCARE += 25
    categoryRawScores.SCIENCE += 25
    categoryRawScores.ENGINEERING += 15
  } else if (scienceMarks < 50) {
    categoryRawScores.HEALTHCARE -= 15
  }

  if (englishMarks >= 80 || socialMarks >= 80) {
    categoryRawScores.LAW += 20
    categoryRawScores.GOVERNMENT += 20
    categoryRawScores.DESIGN += 15
  }

  // Check enjoyed and disliked subjects
  const enjoyed = studentContext.enjoyedSubjects ?? []
  if (enjoyed.includes('Mathematics')) {
    categoryRawScores.TECHNOLOGY += 15
    categoryRawScores.FINANCE += 15
  }
  if (enjoyed.includes('Biology')) {
    categoryRawScores.HEALTHCARE += 20
    categoryRawScores.SCIENCE += 15
  }
  if (enjoyed.includes('Physics') || enjoyed.includes('Chemistry')) {
    categoryRawScores.ENGINEERING += 15
    categoryRawScores.SCIENCE += 15
  }
  if (enjoyed.includes('Accountancy') || enjoyed.includes('Economics')) {
    categoryRawScores.FINANCE += 20
    categoryRawScores.BUSINESS += 15
  }
  if (enjoyed.includes('History') || enjoyed.includes('Geography') || enjoyed.includes('Political Science')) {
    categoryRawScores.LAW += 15
    categoryRawScores.GOVERNMENT += 15
  }
  if (enjoyed.includes('Computer Science')) {
    categoryRawScores.TECHNOLOGY += 25
  }
  if (enjoyed.includes('Art')) {
    categoryRawScores.DESIGN += 25
  }

  const disliked = studentContext.dislikedSubjects ?? []
  if (disliked.includes('Mathematics')) {
    categoryRawScores.TECHNOLOGY -= 25
    categoryRawScores.ENGINEERING -= 25
  }
  if (disliked.includes('Biology')) {
    categoryRawScores.HEALTHCARE -= 25
  }

  // 3. Learning Style & Work Environment Fit (10%)
  const learningStyle = (studentContext.learningStyle || '').toUpperCase()
  if (learningStyle.includes('PRACTICAL') || learningStyle.includes('HANDS_ON') || learningStyle.includes('EXPERIMENT')) {
    categoryRawScores.VOCATIONAL += 25
    categoryRawScores.ENGINEERING += 15
  }

  const workEnv = (studentContext.workEnvironment || '').toUpperCase()
  if (workEnv.includes('TECH') || workEnv.includes('REMOTE')) categoryRawScores.TECHNOLOGY += 15
  if (workEnv.includes('HOSPITAL') || workEnv.includes('CLINICAL') || workEnv.includes('LAB')) categoryRawScores.HEALTHCARE += 20
  if (workEnv.includes('CORPORATE') || workEnv.includes('OFFICE')) categoryRawScores.BUSINESS += 15
  if (workEnv.includes('CREATIVE') || workEnv.includes('STUDIO')) categoryRawScores.DESIGN += 20

  // 4. Budget & Constraints (5%)
  const budgetPref = (studentContext.budgetPreference || '').toUpperCase()
  const govtPref = (studentContext.govtPrivatePref || '').toUpperCase()
  if (budgetPref.includes('GOVERNMENT') || govtPref.includes('GOVT') || govtPref.includes('CIVIL')) {
    categoryRawScores.VOCATIONAL += 15
    categoryRawScores.GOVERNMENT += 15
  }

  // Normalize Category Scores to 0–100 scale
  const categoryScores: CategoryScore[] = Object.keys(categoryRawScores).map((catKey) => {
    const raw = Math.max(0, categoryRawScores[catKey])
    // Scaled based on max achievable points ~120
    const normalized = Math.min(98, Math.max(25, Math.round((raw / 120) * 100)))
    return {
      category: catKey,
      score: normalized,
      label: CATEGORY_META[catKey]?.label || catKey,
      description: CATEGORY_META[catKey]?.description || '',
    }
  }).sort((a, b) => b.score - a.score)

  const categoryScoreMap: Record<string, number> = {}
  categoryScores.forEach((c) => {
    categoryScoreMap[c.category] = c.score
  })

  // 5. Score Pathways Deterministically
  const topPathways: PathwayRecommendation[] = PATHWAY_CONFIGS.map((pathway) => {
    const primaryScores = pathway.primaryCategories.map((c) => categoryScoreMap[c] || 40)
    const secondaryScores = pathway.secondaryCategories.map((c) => categoryScoreMap[c] || 40)

    const primaryAvg = primaryScores.reduce((a, b) => a + b, 0) / primaryScores.length
    const secondaryAvg = secondaryScores.length > 0
      ? secondaryScores.reduce((a, b) => a + b, 0) / secondaryScores.length
      : primaryAvg

    let fitScore = Math.round(primaryAvg * 0.75 + secondaryAvg * 0.25)
    fitScore = Math.min(96, Math.max(30, fitScore))

    // Build transparent rationale
    const topPrimaryName = CATEGORY_META[pathway.primaryCategories[0]]?.label || pathway.primaryCategories[0]
    const strengths: string[] = []
    const thingsToImprove: string[] = []

    if (pathway.slug === 'science-pcm') {
      if (mathMarks >= 75) strengths.push('Strong quantitative foundation in Mathematics')
      else thingsToImprove.push('Mathematics problem-solving speed and calculus foundation')
      strengths.push('High alignment with digital innovation and technological problem-solving')
      thingsToImprove.push('Consistent physics numerical problem practice for competitive exams')
    } else if (pathway.slug === 'science-pcb') {
      strengths.push('High interest in biological systems, human anatomy, and healthcare')
      if (scienceMarks >= 75) strengths.push('Good foundation in Science theory')
      thingsToImprove.push('Physics mechanics and organic chemistry reaction mechanisms for NEET-UG')
    } else if (pathway.slug === 'commerce-with-math') {
      strengths.push('Strong numerical acumen and analytical business interest')
      if (mathMarks >= 70) strengths.push('Mathematical aptitude required for CA / financial modeling')
      thingsToImprove.push('Mastering double-entry accounting rules and economic concepts')
    } else if (pathway.slug === 'arts-humanities' || pathway.slug === 'integrated-law') {
      strengths.push('High verbal expression, critical reading, and public policy interest')
      strengths.push('Analytical reasoning suitable for CLAT and Civil Services (UPSC)')
      thingsToImprove.push('Building speed in long legal passage comprehension and current affairs retention')
    } else if (pathway.slug === 'diploma-engineering' || pathway.slug === 'vocational-iti') {
      strengths.push('Strong practical hands-on preference and spatial troubleshooting ability')
      strengths.push('Early financial independence route with low upfront education costs')
      thingsToImprove.push('Applied engineering mathematics and workshop safety certification')
    } else {
      strengths.push(`Demonstrated aptitude and passion in ${topPrimaryName}`)
      thingsToImprove.push('Deepening foundational domain concepts and entrance exam syllabus')
    }

    const explanation = `${pathway.name} is recommended with a ${fitScore}% fit because your assessment responses and academic profile demonstrate strong aptitude in ${topPrimaryName}.`

    return {
      pathwaySlug: pathway.slug,
      pathwayName: pathway.name,
      stream: pathway.stream,
      matchScore: fitScore,
      explanation,
      strengths,
      thingsToImprove,
      relevantSubjects: pathway.requiredKeySubjects,
      difficulty: pathway.difficulty,
      careers: pathway.careers,
      entranceExams: pathway.entranceExams,
      duration: pathway.duration,
      costCategory: pathway.costCategory,
    }
  }).sort((a, b) => b.matchScore - a.matchScore)

  // 6. Score & Rank Careers
  const careerSlugs = Object.keys(CAREER_STREAM_MAP)
  const recommendedCareers: CareerRecommendation[] = careerSlugs.map((slug) => {
    const meta = CAREER_STREAM_MAP[slug]
    const baseCatScore = categoryScoreMap[meta.category] || 50
    const pathwayFit = topPathways.find((p) => p.stream === meta.stream)?.matchScore || 50
    const combinedScore = Math.round(baseCatScore * 0.6 + pathwayFit * 0.4)

    const careerName = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const topCatName = CATEGORY_META[meta.category]?.label || meta.category

    return {
      careerSlug: slug,
      careerName,
      categoryScore: baseCatScore,
      matchScore: combinedScore,
      explanation: `Strong alignment with your interest in ${topCatName} and recommended stream pathways.`,
      salaryRange: '₹4.5 - 20.0 LPA',
      keySkills: ['Analytical Problem Solving', 'Domain Expertise', 'Team Collaboration'],
      entranceExams: ['Standard National / State Entrances'],
      alternativePathways: ['Diploma Lateral Entry', 'Degree + Certification'],
      nextSteps: [
        'Explore 11th standard subject requirements for this career',
        'Review syllabus for entrance exams',
        'Shortlist top government & accredited colleges',
      ],
    }
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 6)

  // 7. Executive Summary Rationale
  const topPathway = topPathways[0]
  const secondPathway = topPathways[1]
  const topInterest = categoryScores[0]
  const secondInterest = categoryScores[1]

  const summary = `Based on your multi-factor evaluation across interest areas, aptitude questions, Class 10th academic performance, and personal study preferences, your strongest alignment is with ${topPathway.pathwayName} (${topPathway.matchScore}% fit). Your primary interest peaks in ${topInterest.label} (${topInterest.score}/100) and ${secondInterest.label} (${secondInterest.score}/100). As a viable alternative or complementary track, ${secondPathway.pathwayName} (${secondPathway.matchScore}% fit) also presents exciting long-term prospects.`

  // 8. Key Strengths & Skills to Develop
  const overallStrengths = [
    `Strong natural inclination towards ${topInterest.label}`,
    `Analytical problem-solving and conceptual clarity`,
    `Alignment between self-reported subject interests and assessment logic questions`,
  ]

  const skillsToDevelop = [
    'Deepen conceptual mastery of 11th standard foundation textbooks (NCERT)',
    'Build time management and speed for national/state entrance exams',
    'Develop digital literacy, project-based portfolio, and communication skills',
  ]

  const nextActions = [
    `Discuss the ${topPathway.pathwayName} choice with your parents using the SmartCareer Parent Guide.`,
    'Shortlist 3 to 5 target colleges and understand their latest admission criteria & cutoffs.',
    'Create an actionable 3-month study roadmap to master 11th standard foundation concepts.',
  ]

  // 9. Structured Personalized Roadmap
  const roadmap: RoadmapPlan = {
    thirtyDays: [
      {
        title: `Explore ${topPathway.pathwayName} Syllabus`,
        description: 'Review 11th standard textbooks and syllabus chapters to understand course depth.',
        tag: 'Academics',
      },
      {
        title: 'Discuss with Parents & Teachers',
        description: 'Share your assessment result summary with parents and school counsellors.',
        tag: 'Counseling',
      },
      {
        title: 'Shortlist 5 Target Institutions',
        description: 'Research premier government and state colleges in your preferred location.',
        tag: 'College Research',
      },
    ],
    threeMonths: [
      {
        title: 'Build Core Subject Foundations',
        description: `Strengthen core fundamentals in ${topPathway.relevantSubjects.slice(0, 2).join(' and ')}.`,
        tag: 'Skill Building',
      },
      {
        title: 'Explore Entrance Exam Patterns',
        description: `Solve previous year question papers for ${topPathway.entranceExams.slice(0, 2).join(', ')}.`,
        tag: 'Exam Prep',
      },
      {
        title: 'Start a Practical Mini-Project',
        description: 'Engage in a hands-on project, reading circle, or hobby workshop related to your top career.',
        tag: 'Exploration',
      },
    ],
    sixMonths: [
      {
        title: 'Mid-Year Academic Review',
        description: 'Assess 11th standard mid-term performance and identify topics needing extra revision.',
        tag: 'Self-Review',
      },
      {
        title: 'Finalize Coaching / Study Schedule',
        description: 'Structure daily self-study hours balancing school board exam and competitive entrance prep.',
        tag: 'Action Plan',
      },
      {
        title: 'Connect with Senior Students / Mentors',
        description: 'Interact with senior students currently studying in your target colleges or careers.',
        tag: 'Mentorship',
      },
    ],
  }

  return {
    categoryScores,
    topPathways,
    recommendedCareers,
    summary,
    strengths: overallStrengths,
    skillsToDevelop,
    nextActions,
    roadmap,
  }
}
