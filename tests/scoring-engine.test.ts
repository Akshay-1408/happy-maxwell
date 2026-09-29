import { generateRecommendations, StudentContext } from '../lib/ai/career-recommendation'

async function runTests() {
  let passed = 0
  let failed = 0

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`)
      passed++
    } else {
      console.error(`❌ FAIL: ${testName}`)
      failed++
    }
  }

  console.log('--- RUNNING SCORING ENGINE UNIT TESTS ---')

  // Test 1: STEM / PCM Student with High Math & Logic
  {
    const responses = [
      {
        questionId: 'q-tech-1',
        answerValue: 'A',
        scoring: { A: { TECHNOLOGY: 10, ENGINEERING: 8 } },
      },
      {
        questionId: 'q-tech-2',
        answerValue: 'A',
        scoring: { A: { TECHNOLOGY: 10, SCIENCE: 6 } },
      },
      {
        questionId: 'q-logic-1',
        answerValue: 'B',
        scoring: { B: { ENGINEERING: 10, TECHNOLOGY: 8 } },
      },
    ]
    const profile: StudentContext = {
      mathMarks: 95,
      scienceMarks: 90,
      englishMarks: 80,
      socialMarks: 75,
      enjoyedSubjects: ['Mathematics', 'Computer Science'],
      workEnvironment: 'Tech Office / Remote Workstation',
      learningStyle: 'Problem Solving & Logic',
    }

    const results = await generateRecommendations(responses, profile)
    assert(results.topPathways.length > 0, 'Generates top pathways')
    assert(
      results.topPathways[0].stream === 'SCIENCE_PCM',
      `Top pathway is Science PCM for STEM profile (Got: ${results.topPathways[0].stream})`
    )
    assert(
      results.recommendedCareers.some((c) => c.careerSlug === 'software-engineer' || c.careerSlug === 'ai-ml-engineer'),
      'Top recommended careers include Software Engineer or AI/ML Engineer'
    )
    assert(results.recommendedCareers[0].matchScore >= 60, 'Top match score is >= 60%')
    assert(results.strengths.length > 0, 'Generates student strengths')
    assert(results.roadmap.thirtyDays.length === 3, 'Generates 30-day roadmap')
    assert(results.roadmap.threeMonths.length === 3, 'Generates 3-month roadmap')
    assert(results.roadmap.sixMonths.length === 3, 'Generates 6-month roadmap')
  }

  // Test 2: Medical / PCB Student with High Science, Biology focus
  {
    const responses = [
      {
        questionId: 'q-med-1',
        answerValue: 'A',
        scoring: { A: { HEALTHCARE: 10, SCIENCE: 8 } },
      },
      {
        questionId: 'q-med-2',
        answerValue: 'A',
        scoring: { A: { HEALTHCARE: 10 } },
      },
    ]
    const profile: StudentContext = {
      mathMarks: 50,
      scienceMarks: 95,
      englishMarks: 85,
      socialMarks: 80,
      enjoyedSubjects: ['Biology', 'Science'],
      workEnvironment: 'Hospital / Clinical Care Setting',
    }

    const results = await generateRecommendations(responses, profile)
    assert(
      results.topPathways[0].stream === 'SCIENCE_PCB',
      `Top pathway is Science PCB for Healthcare profile (Got: ${results.topPathways[0].stream})`
    )
    assert(
      results.recommendedCareers.some((c) => c.careerSlug === 'doctor-mbbs' || c.careerSlug === 'biotechnologist'),
      'Top careers include Doctor MBBS or Biotechnologist'
    )
    const healthcareCat = results.categoryScores.find((c) => c.category === 'HEALTHCARE')
    assert(healthcareCat !== undefined && healthcareCat.score >= 70, 'Healthcare category score is >= 70%')
  }

  // Test 3: Commerce / Finance Student
  {
    const responses = [
      {
        questionId: 'q-fin-1',
        answerValue: 'A',
        scoring: { A: { FINANCE: 10, BUSINESS: 8 } },
      },
      {
        questionId: 'q-fin-2',
        answerValue: 'A',
        scoring: { A: { FINANCE: 10 } },
      },
    ]
    const profile: StudentContext = {
      mathMarks: 88,
      scienceMarks: 60,
      englishMarks: 82,
      socialMarks: 85,
      enjoyedSubjects: ['Mathematics', 'Accountancy'],
      workEnvironment: 'Corporate Office / Professional Practice',
    }

    const results = await generateRecommendations(responses, profile)
    assert(
      results.topPathways[0].stream === 'COMMERCE_WITH_MATH',
      `Top pathway is Commerce with Math (Got: ${results.topPathways[0].stream})`
    )
    assert(
      results.recommendedCareers.some((c) => c.careerSlug === 'chartered-accountant' || c.careerSlug === 'investment-banker'),
      'Top career includes Chartered Accountant or Investment Banker'
    )
  }

  // Test 4: Law & Civil Services / Arts Student
  {
    const responses = [
      {
        questionId: 'q-law-1',
        answerValue: 'A',
        scoring: { A: { LAW: 10, GOVERNMENT: 8 } },
      },
      {
        questionId: 'q-gov-1',
        answerValue: 'A',
        scoring: { A: { GOVERNMENT: 10, LAW: 8 } },
      },
    ]
    const profile: StudentContext = {
      mathMarks: 65,
      scienceMarks: 65,
      englishMarks: 92,
      socialMarks: 95,
      enjoyedSubjects: ['History', 'Political Science'],
      govtPrivatePref: 'Govt (Civil Services / PSU)',
    }

    const results = await generateRecommendations(responses, profile)
    assert(
      results.topPathways.some((p) => p.stream === 'ARTS_HUMANITIES' || p.stream === 'INTEGRATED_LAW'),
      'Top pathways include Arts/Humanities or Integrated Law'
    )
    assert(
      results.recommendedCareers.some((c) => c.careerSlug === 'civil-services-ias' || c.careerSlug === 'lawyer-advocate'),
      'Top career includes Civil Services IAS or Lawyer'
    )
  }

  // Test 5: Empty Profile / Boundary inputs
  {
    const responses: any[] = []
    const profile: StudentContext = {}
    const results = await generateRecommendations(responses, profile)
    assert(results.recommendedCareers.length > 0, 'Handles empty profile gracefully without crashing')
    assert(typeof results.recommendedCareers[0].matchScore === 'number', 'Match scores are numbers')
    assert(results.summary.length > 20, 'Produces valid comprehensive narrative summary')
    assert(results.roadmap.thirtyDays.length === 3, 'Produces valid 30-day roadmap with empty profile')
  }

  console.log(`\n===============================`)
  console.log(`Results: ${passed} Passed, ${failed} Failed`)
  console.log(`===============================\n`)

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err)
  process.exit(1)
})
