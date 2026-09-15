import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Frontend Neon PostgreSQL seed...')

  const catTech = await prisma.careerCategory.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      name: 'Technology',
      slug: 'technology',
      description: 'Software, AI, web development, and digital systems',
      iconName: 'Cpu',
      orderIndex: 1,
    },
  })

  const catEng = await prisma.careerCategory.upsert({
    where: { slug: 'engineering' },
    update: {},
    create: {
      name: 'Engineering',
      slug: 'engineering',
      description: 'Mechanical, civil, electrical, and physical engineering fields',
      iconName: 'Wrench',
      orderIndex: 2,
    },
  })

  const catHealth = await prisma.careerCategory.upsert({
    where: { slug: 'healthcare' },
    update: {},
    create: {
      name: 'Healthcare',
      slug: 'healthcare',
      description: 'Medicine, nursing, pharmacy, and allied health sciences',
      iconName: 'Heart',
      orderIndex: 3,
    },
  })

  const catFin = await prisma.careerCategory.upsert({
    where: { slug: 'finance' },
    update: {},
    create: {
      name: 'Finance & Accounts',
      slug: 'finance',
      description: 'Accounting, banking, investments, and financial planning',
      iconName: 'TrendingUp',
      orderIndex: 5,
    },
  })

  const careersData = [
    {
      name: 'Software Developer',
      slug: 'software-developer',
      categoryId: catTech.id,
      shortDescription: 'Build mobile apps, websites, AI systems, and digital platforms.',
      fullDescription: 'Software developers write code to build software applications. They solve logical problems, design software architectures, and work with technologies like Web, Mobile, and Cloud.',
      relevantStreams: ['SCIENCE_PCM', 'DIPLOMA_ENGINEERING'],
      requiredEducation: ['10th Standard', '12th with PCM or Diploma in CS/IT', 'B.Tech / B.E. / BCA / B.Sc Computer Science'],
      durationToQualify: '4 Years after 12th',
      workEnvironment: 'Tech Office / Remote Flexible',
      whoMightEnjoy: 'Students who love math, logic puzzles, coding, and building digital tools.',
      alternativeRoutes: ['Polytechnic Diploma -> Lateral Entry B.Tech', 'Self-taught programming + Coding Bootcamps'],
      skills: ['JavaScript/TypeScript', 'Python', 'Problem Solving', 'Data Structures'],
      toolsUsed: ['VS Code', 'Git/GitHub', 'Docker', 'React / Next.js'],
      pros: ['High salary potential', 'Global remote work options', 'Continuous learning and innovation'],
      challenges: ['Requires continuous skill updating', 'Long desk hours', 'Screen fatigue'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'Doctor (MBBS)',
      slug: 'doctor-mbbs',
      categoryId: catHealth.id,
      shortDescription: 'Diagnose illnesses, treat patients, and save lives through clinical medicine.',
      fullDescription: 'Doctors examine patients, prescribe treatments, perform surgeries, and prevent diseases. Becoming an MBBS doctor is a prestigious, high-impact career path in India.',
      relevantStreams: ['SCIENCE_PCB', 'SCIENCE_PCMB'],
      requiredEducation: ['10th Standard', '12th with PCB (Physics, Chemistry, Biology)', 'Qualify NEET-UG Entrance Exam', '5.5 Years MBBS Degree (includes 1 year Internship)'],
      durationToQualify: '5.5 Years after 12th',
      workEnvironment: 'Hospitals, Clinics, Medical Research Labs',
      whoMightEnjoy: 'Students passionate about biological science, helping people, and willing to study long term.',
      alternativeRoutes: ['BDS (Dental)', 'BAMS (Ayurveda)', 'BHMS (Homeopathy)', 'B.Sc Nursing / Allied Health'],
      skills: ['Medical Diagnosis', 'Patient Empathy', 'Clinical Reasoning', 'Emergency Care'],
      toolsUsed: ['Stethoscope', 'Diagnostic Equipment', 'EHR Software'],
      pros: ['Deep social impact and respect', 'Always in demand everywhere', 'Lifelong stable career'],
      challenges: ['Highly competitive entrance (NEET)', 'Long training duration', 'High stress & night shifts'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'Chartered Accountant (CA)',
      slug: 'chartered-accountant',
      categoryId: catFin.id,
      shortDescription: 'Manage financial accounts, auditing, taxation, and financial advice for businesses.',
      fullDescription: 'Chartered Accountants are certified financial experts who audit accounts, advise companies on tax planning, manage corporate finance, and ensure financial compliance under ICAI.',
      relevantStreams: ['COMMERCE_WITH_MATH', 'COMMERCE_NO_MATH'],
      requiredEducation: ['10th Standard', '12th Standard (Commerce preferred)', 'CA Foundation Exam', 'CA Intermediate + 2 Years Articleship', 'CA Final Exam'],
      durationToQualify: '4.5 - 5 Years after 12th',
      workEnvironment: 'Corporate Office, CA Audit Firms, Private Practice',
      whoMightEnjoy: 'Students who like numbers, accounting rules, tax regulations, and financial planning.',
      alternativeRoutes: ['CMA (Cost & Management Accounting)', 'CS (Company Secretary)', 'B.Com + CFA'],
      skills: ['Financial Auditing', 'Taxation Laws', 'Corporate Accounting', 'Excel & Tally'],
      toolsUsed: ['Tally Prime', 'MS Excel', 'SAP Financials'],
      pros: ['Prestigious Indian qualification', 'Can start independent practice', 'Excellent salary growth'],
      challenges: ['Rigorous exam pass rates', 'Peak audit tax season workload'],
      isFeatured: true,
      orderIndex: 3,
    },
  ]

  for (const c of careersData) {
    await prisma.career.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    })
  }

  const pathwaysData = [
    {
      name: 'Science (PCM) Pathway',
      slug: 'science-pcm',
      stream: 'SCIENCE_PCM',
      shortDescription: 'Physics, Chemistry, Mathematics stream after 10th standard.',
      difficultyLevel: 'CHALLENGING',
      duration: '2 Years (11th & 12th)',
      keySubjects: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Computer Science / PE'],
      entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CETs', 'CUET'],
      higherEducationOptions: ['B.Tech / B.E.', 'B.Sc Computer Science', 'B.Arch', 'BCA', 'NDA'],
      commonCareers: ['Software Developer', 'Mechanical Engineer', 'Data Analyst', 'Architect'],
      steps: [
        { title: 'Step 1: 10th Completion', description: 'Score well in Math and Science subjects.' },
        { title: 'Step 2: 11th & 12th PCM', description: 'Choose Physics, Chemistry, Math combination.' },
        { title: 'Step 3: Entrance Preparation', description: 'Prepare for JEE Main or State CETs in parallel.' },
        { title: 'Step 4: Degree Admission', description: 'Pursue B.Tech, BCA, or B.Sc in desired discipline.' },
      ],
      orderIndex: 1,
    },
    {
      name: 'Science (PCB) Pathway',
      slug: 'science-pcb',
      stream: 'SCIENCE_PCB',
      shortDescription: 'Physics, Chemistry, Biology stream for medical & life sciences.',
      difficultyLevel: 'CHALLENGING',
      duration: '2 Years (11th & 12th)',
      keySubjects: ['Physics', 'Chemistry', 'Biology', 'English', 'Psychology / PE'],
      entranceExams: ['NEET-UG', 'CUET (Biology/Biotech)', 'State Paramedical CETs'],
      higherEducationOptions: ['MBBS', 'BDS', 'B.Pharm', 'B.Sc Nursing', 'B.Sc Biotechnology'],
      commonCareers: ['Doctor (MBBS)', 'Nurse', 'Pharmacist', 'Biotechnologist'],
      steps: [
        { title: 'Step 1: 10th Board Completion', description: 'Build strong base in Science and Biology.' },
        { title: 'Step 2: 11th & 12th PCB', description: 'Focus on Biology concepts and organic chemistry.' },
        { title: 'Step 3: NEET-UG Prep', description: 'Prepare for NEET Medical Entrance exam.' },
        { title: 'Step 4: Medical / Healthcare Degree', description: 'Enroll in MBBS, BDS, B.Pharm, or Allied Health.' },
      ],
      orderIndex: 2,
    },
  ]

  for (const p of pathwaysData) {
    await prisma.pathway.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
  }

  const questionsData = [
    {
      questionText: 'How much do you enjoy solving complex logic puzzles, mathematical equations, or writing computer code?',
      questionType: 'LIKERT',
      category: 'TECHNOLOGY',
      orderIndex: 1,
      scoring: {
        '5': { TECHNOLOGY: 25, ENGINEERING: 15 },
        '4': { TECHNOLOGY: 20, ENGINEERING: 10 },
        '3': { TECHNOLOGY: 10, ENGINEERING: 5 },
        '2': { TECHNOLOGY: 5 },
        '1': { TECHNOLOGY: 0 },
      },
    },
    {
      questionText: 'How interested are you in learning about human body biology, medical treatments, and healthcare sciences?',
      questionType: 'LIKERT',
      category: 'HEALTHCARE',
      orderIndex: 2,
      scoring: {
        '5': { HEALTHCARE: 25, SCIENCE: 15 },
        '4': { HEALTHCARE: 20, SCIENCE: 10 },
        '3': { HEALTHCARE: 10 },
        '2': { HEALTHCARE: 5 },
        '1': { HEALTHCARE: 0 },
      },
    },
  ]

  for (const q of questionsData) {
    await prisma.assessmentQuestion.create({
      data: q,
    })
  }

  console.log('✅ Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Seed error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
