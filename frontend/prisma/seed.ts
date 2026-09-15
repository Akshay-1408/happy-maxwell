import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Neon PostgreSQL seed...')

  // ─── 1. Career Categories ────────────────────────────────────────────────
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

  const catBus = await prisma.careerCategory.upsert({
    where: { slug: 'business' },
    update: {},
    create: {
      name: 'Business & Management',
      slug: 'business',
      description: 'Entrepreneurship, management, and business operations',
      iconName: 'Briefcase',
      orderIndex: 4,
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

  const catLaw = await prisma.careerCategory.upsert({
    where: { slug: 'law' },
    update: {},
    create: {
      name: 'Law & Legal',
      slug: 'law',
      description: 'Legal practice, corporate law, and justice systems',
      iconName: 'Scale',
      orderIndex: 6,
    },
  })

  const catDesign = await prisma.careerCategory.upsert({
    where: { slug: 'design' },
    update: {},
    create: {
      name: 'Design & Architecture',
      slug: 'design',
      description: 'UI/UX design, visual graphics, architecture, and creative media',
      iconName: 'Palette',
      orderIndex: 7,
    },
  })

  const catGov = await prisma.careerCategory.upsert({
    where: { slug: 'government' },
    update: {},
    create: {
      name: 'Government & Public Service',
      slug: 'government',
      description: 'Civil services, public administration, and governance',
      iconName: 'Landmark',
      orderIndex: 8,
    },
  })

  console.log('✅ Created Career Categories')

  // ─── 2. Careers Seed Data ─────────────────────────────────────────────────
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
    {
      name: 'Mechanical Engineer',
      slug: 'mechanical-engineer',
      categoryId: catEng.id,
      shortDescription: 'Design, manufacture, and maintain machines, engines, robotics, and physical systems.',
      fullDescription: 'Mechanical engineers design and analyze mechanical devices, automotive systems, robotics, energy systems, and manufacturing machinery.',
      relevantStreams: ['SCIENCE_PCM', 'DIPLOMA_ENGINEERING'],
      requiredEducation: ['10th Standard', '12th with PCM or Diploma in Mechanical', 'B.Tech / B.E. in Mechanical Engineering'],
      durationToQualify: '4 Years after 12th',
      workEnvironment: 'Manufacturing Plants, Automotive R&D Labs, Design Offices',
      whoMightEnjoy: 'Students who love physics, machinery, automobiles, robotics, and hands-on tinkering.',
      alternativeRoutes: ['3-Year Polytechnic Diploma in Mechanical Engineering'],
      skills: ['CAD Design', 'Thermodynamics', 'Material Science', 'Robotics'],
      toolsUsed: ['AutoCAD', 'SolidWorks', 'ANSYS'],
      pros: ['Versatile engineering field', 'Opportunities in EV & aerospace', 'Practical field work'],
      challenges: ['Requires physical & mathematical rigour', 'Initial factory floor postings'],
      isFeatured: false,
      orderIndex: 4,
    },
    {
      name: 'Lawyer / Advocate',
      slug: 'lawyer-advocate',
      categoryId: catLaw.id,
      shortDescription: 'Represent clients in court, draft legal contracts, and provide legal advice.',
      fullDescription: 'Advocates represent individuals and corporate entities in civil, criminal, corporate, and constitutional matters.',
      relevantStreams: ['ARTS_HUMANITIES', 'COMMERCE_WITH_MATH', 'SCIENCE_PCM'],
      requiredEducation: ['10th Standard', '12th Standard in any stream', 'CLAT / Entrance Exam for 5-Year Integrated B.A. LL.B / B.B.A. LL.B', 'Bar Council Enrollment'],
      durationToQualify: '5 Years after 12th',
      workEnvironment: 'Courts, Corporate Law Firms, Consulting Offices',
      whoMightEnjoy: 'Students with strong public speaking, reading comprehension, debate, and analytical skills.',
      alternativeRoutes: ['3-Year LL.B after any 3-Year Bachelor Degree'],
      skills: ['Legal Research', 'Argumentation & Debating', 'Contract Drafting', 'Public Speaking'],
      toolsUsed: ['SCC Online', 'Manupatra', 'Legal Databases'],
      pros: ['High prestige & social standing', 'Diverse options (Corporate, Constitutional, IP Law)'],
      challenges: ['Extensive reading requirements', 'Challenging initial litigation practice years'],
      isFeatured: true,
      orderIndex: 5,
    },
    {
      name: 'Civil Services Officer (UPSC)',
      slug: 'civil-services-officer',
      categoryId: catGov.id,
      shortDescription: 'Serve in IAS, IPS, IFS, or IRS leading district administration and public policy.',
      fullDescription: 'Civil Services Officers manage government administration, maintain law and order, formulate policies, and execute national development projects.',
      relevantStreams: ['ARTS_HUMANITIES', 'COMMERCE_WITH_MATH', 'SCIENCE_PCM', 'SCIENCE_PCB'],
      requiredEducation: ['10th Standard', '12th Standard in any stream', 'Bachelor Degree in any discipline', 'Pass UPSC Civil Services Examination (Prelims, Mains, Interview)'],
      durationToQualify: '3 Years Degree + UPSC prep',
      workEnvironment: 'Government Headquarters, District Administration Offices',
      whoMightEnjoy: 'Students passionate about nation building, public service, governance, and leadership.',
      alternativeRoutes: ['State Public Service Commission Exams (State PSC)'],
      skills: ['Public Administration', 'Policy Analysis', 'Leadership', 'General Studies & Current Affairs'],
      toolsUsed: ['Government Portals', 'Policy Frameworks'],
      pros: ['Unmatched social impact & authority', 'Job security & perks', 'Nationwide service scope'],
      challenges: ['Highly competitive selection rate', 'Frequent administrative transfers'],
      isFeatured: true,
      orderIndex: 6,
    },
  ]

  for (const c of careersData) {
    await prisma.career.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    })
  }

  console.log('✅ Created Careers Dataset')

  // ─── 3. Pathways Seed Data ────────────────────────────────────────────────
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
    {
      name: 'Commerce Stream Pathway',
      slug: 'commerce-with-math',
      stream: 'COMMERCE_WITH_MATH',
      shortDescription: 'Accountancy, Economics, Business Studies stream.',
      difficultyLevel: 'MODERATE',
      duration: '2 Years (11th & 12th)',
      keySubjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics / Informatics', 'English'],
      entranceExams: ['CA Foundation', 'CUET', 'IPMAT (IIM Integrated Management)'],
      higherEducationOptions: ['B.Com (Hons)', 'BBA', 'CA / CMA / CS', 'B.Sc Economics'],
      commonCareers: ['Chartered Accountant', 'Financial Analyst', 'Entrepreneur', 'Banker'],
      steps: [
        { title: 'Step 1: 10th Completion', description: 'Clear 10th with interest in social & financial concepts.' },
        { title: 'Step 2: 11th & 12th Commerce', description: 'Master Accountancy, Economics, and Math.' },
        { title: 'Step 3: Professional Registrations', description: 'Register for CA Foundation or IPMAT.' },
        { title: 'Step 4: Higher Studies', description: 'Pursue B.Com, BBA, or CA qualifications.' },
      ],
      orderIndex: 3,
    },
    {
      name: 'Arts & Humanities Pathway',
      slug: 'arts-humanities',
      stream: 'ARTS_HUMANITIES',
      shortDescription: 'History, Political Science, Sociology, Psychology stream.',
      difficultyLevel: 'MODERATE',
      duration: '2 Years (11th & 12th)',
      keySubjects: ['History', 'Political Science', 'Sociology', 'Psychology', 'English', 'Economics'],
      entranceExams: ['CLAT (Law)', 'CUET (Central Varsities)', 'NID / NIFT (Design)'],
      higherEducationOptions: ['B.A. Integrated Law (LL.B)', 'B.A. Humanities', 'B.Des', 'B.J.M.C. (Journalism)'],
      commonCareers: ['Lawyer / Advocate', 'Civil Services Officer', 'Psychologist', 'Journalist'],
      steps: [
        { title: 'Step 1: 10th Completion', description: 'Develop strong reading and analytical writing habits.' },
        { title: 'Step 2: 11th & 12th Arts', description: 'Choose Humanities subjects matching your interests.' },
        { title: 'Step 3: Entrance Preparation', description: 'Prepare for CLAT, CUET, or Design entrance exams.' },
        { title: 'Step 4: Degree Specialization', description: 'Pursue B.A. LL.B, B.Des, or B.A. Honors.' },
      ],
      orderIndex: 4,
    },
    {
      name: 'Polytechnic Diploma Pathway',
      slug: 'diploma-engineering',
      stream: 'DIPLOMA_ENGINEERING',
      shortDescription: '3-Year Polytechnic Technical Diploma directly after 10th standard.',
      difficultyLevel: 'MODERATE',
      duration: '3 Years after 10th',
      keySubjects: ['Applied Physics', 'Applied Chemistry', 'Engineering Drawing', 'Branch Specialization'],
      entranceExams: ['State Polytechnic Entrance Exams (e.g. POLYCET, JEECUP)'],
      higherEducationOptions: ['Lateral Entry to B.Tech 2nd Year (LEET)', 'Advanced Diplomas'],
      commonCareers: ['Junior Engineer', 'Lab Technician', 'CAD Specialist', 'Maintenance Supervisor'],
      steps: [
        { title: 'Step 1: 10th Completion', description: 'Clear 10th standard board exam.' },
        { title: 'Step 2: Polytechnic Admission', description: 'Qualify State Polytechnic Entrance Test.' },
        { title: 'Step 3: 3-Year Diploma Course', description: 'Complete practical engineering diploma.' },
        { title: 'Step 4: Job or B.Tech LEET', description: 'Start job as Junior Engineer or enter 2nd Year B.Tech.' },
      ],
      orderIndex: 5,
    },
  ]

  for (const p of pathwaysData) {
    await prisma.pathway.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
  }

  console.log('✅ Created Pathways Dataset')

  // ─── 4. Assessment Questions Seed ──────────────────────────────────────────
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
    {
      questionText: 'How much do you enjoy reading business news, analyzing financial numbers, stock markets, or accounting rules?',
      questionType: 'LIKERT',
      category: 'FINANCE',
      orderIndex: 3,
      scoring: {
        '5': { FINANCE: 25, BUSINESS: 15 },
        '4': { FINANCE: 20, BUSINESS: 10 },
        '3': { FINANCE: 10 },
        '2': { FINANCE: 5 },
        '1': { FINANCE: 0 },
      },
    },
    {
      questionText: 'How interested are you in legal rights, debates, constitutional laws, and defending cases in court?',
      questionType: 'LIKERT',
      category: 'LAW',
      orderIndex: 4,
      scoring: {
        '5': { LAW: 25, SOCIAL_SCIENCE: 15 },
        '4': { LAW: 20, SOCIAL_SCIENCE: 10 },
        '3': { LAW: 10 },
        '2': { LAW: 5 },
        '1': { LAW: 0 },
      },
    },
    {
      questionText: 'How much do you enjoy sketching, visual designing, UI/UX, or creating aesthetic digital media?',
      questionType: 'LIKERT',
      category: 'DESIGN',
      orderIndex: 5,
      scoring: {
        '5': { DESIGN: 25, MEDIA: 15 },
        '4': { DESIGN: 20, MEDIA: 10 },
        '3': { DESIGN: 10 },
        '2': { DESIGN: 5 },
        '1': { DESIGN: 0 },
      },
    },
    {
      questionText: 'How strongly do you feel about serving in public administration, government policy, or civil services (UPSC)?',
      questionType: 'LIKERT',
      category: 'GOVERNMENT',
      orderIndex: 6,
      scoring: {
        '5': { GOVERNMENT: 25, SOCIAL_SCIENCE: 15 },
        '4': { GOVERNMENT: 20, SOCIAL_SCIENCE: 10 },
        '3': { GOVERNMENT: 10 },
        '2': { GOVERNMENT: 5 },
        '1': { GOVERNMENT: 0 },
      },
    },
  ]

  for (const q of questionsData) {
    await prisma.assessmentQuestion.create({
      data: q,
    })
  }

  console.log('✅ Created Assessment Questions')

  // ─── 5. Colleges (Sample Data) ──────────────────────────────────────────────
  await prisma.college.create({
    data: {
      name: 'Indian Institute of Technology (IIT) Bombay [Demo]',
      city: 'Mumbai',
      state: 'Maharashtra',
      type: 'IIT',
      affiliation: 'Autonomous Institute of National Importance',
      ranking: 1,
      isDemoData: true,
      courses: {
        create: [
          { name: 'B.Tech Computer Science & Engineering', degreeType: 'UNDERGRADUATE', duration: '4 Years', eligibility: '12th PCM + JEE Advanced' },
          { name: 'B.Tech Mechanical Engineering', degreeType: 'UNDERGRADUATE', duration: '4 Years', eligibility: '12th PCM + JEE Advanced' },
        ],
      },
    },
  })

  await prisma.college.create({
    data: {
      name: 'All India Institute of Medical Sciences (AIIMS) Delhi [Demo]',
      city: 'New Delhi',
      state: 'Delhi NCR',
      type: 'AIIMS',
      affiliation: 'Autonomous Medical Institute',
      ranking: 1,
      isDemoData: true,
      courses: {
        create: [
          { name: 'MBBS (Bachelor of Medicine & Surgery)', degreeType: 'UNDERGRADUATE', duration: '5.5 Years', eligibility: '12th PCB + NEET-UG' },
          { name: 'B.Sc (Hons) Nursing', degreeType: 'UNDERGRADUATE', duration: '4 Years', eligibility: '12th PCB' },
        ],
      },
    },
  })

  console.log('✅ Created Demo Colleges')
  console.log('🎉 Neon PostgreSQL Seed completed successfully!')
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
