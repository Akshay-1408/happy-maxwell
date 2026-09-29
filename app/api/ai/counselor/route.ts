import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/clerk-sync'
import prisma from '@/lib/db/prisma'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

function generateOfflineCounselingResponse(
  userQuery: string,
  profile: any,
  latestResult: any
): string {
  const query = userQuery.toLowerCase()
  const studentName = profile?.studentName || 'Student'
  const mathMarks = profile?.mathMarks ?? profile?.percentageObtained ?? 75
  const scienceMarks = profile?.scienceMarks ?? profile?.percentageObtained ?? 75
  const topPathway = latestResult?.topPathways?.[0]?.pathwayName || 'Science (PCM) or Commerce'

  // Topic 1: PCM vs Commerce
  if (query.includes('commerce') && (query.includes('pcm') || query.includes('science'))) {
    return `Hello ${studentName}! This is one of the most common and important decisions after 10th standard.

### Science (PCM) vs Commerce with Math:
1. **Choose Science (PCM)** if you enjoy quantitative problem-solving, physics, coding, or engineering mechanics. PCM keeps maximum technical options open (B.Tech, Architecture, BCA, Commercial Aviation, Defence NDA).
2. **Choose Commerce with Math** if you are interested in finance, stock markets, Chartered Accountancy (CA), business management, or economics.
${mathMarks >= 75 ? `\n*Note on your profile:* With your solid Mathematics foundation (${mathMarks}%), you are well-equipped for either track!` : ''}

**Key Trade-off:**
Science PCM requires handling intense physics and chemistry numericals alongside math. Commerce with Math replaces physics/chemistry with Accountancy and Economics.

**Next Step for You:**
Would you like to explore specific career outcomes like **Software Engineer** vs **Chartered Accountant**?`
  }

  // Topic 2: Medical / PCB vs Engineering / PCM
  if (query.includes('neet') || query.includes('doctor') || query.includes('pcb') || query.includes('medical') || query.includes('biology')) {
    return `Hello ${studentName}! Here is a clear breakdown for healthcare and biological sciences after 10th:

### Science (PCB) Overview:
- **Core Focus:** Human anatomy, botany, zoology, biochemistry, and clinical medicine.
- **Top Career Paths:** MBBS (Doctor), BDS (Dental), B.Pharm (Pharmacy & Drug Research), BPT (Physiotherapy), B.Sc Biotechnology.
- **Entrance Exam:** NEET-UG (National Eligibility cum Entrance Test).

**Important Realities to Consider:**
- Becoming an MBBS doctor is a **5.5-year commitment** (+ 3 years of MD/MS specialization).
- If you love biology but want a shorter 4-year route, consider **B.Pharm** or **B.Sc Biotechnology**.

${scienceMarks >= 80 ? `*Profile Note:* Your strong Science score (${scienceMarks}%) shows good academic readiness for PCB!` : ''}

Would you like to know more about the syllabus or alternative healthcare careers like Pharmacy or Physiotherapy?`
  }

  // Topic 3: Design / UI/UX / Architecture
  if (query.includes('design') || query.includes('ui') || query.includes('ux') || query.includes('architect') || query.includes('nid')) {
    return `Hello ${studentName}! Creative design and architecture are booming fields with tremendous career opportunities:

### Creative Design & Architecture Pathways:
1. **UI/UX & Digital Product Design:** Available through any 10+2 stream. Top entrance exams include **NID DAT** and **UCEED** (for B.Des at IIT Bombay/Delhi).
2. **Architecture (B.Arch):** Requires **12th with PCM** (Physics, Chemistry, Math) and qualifying **NATA** or **JEE Main Paper 2**.
3. **Animation, VFX & Gaming:** Available after 12th in any stream through B.Des or specialized academies.

**Next Action:**
Would you like to review the entrance exam pattern for **NID DAT / UCEED** or check our **UI/UX Designer** career profile?`
  }

  // Topic 4: Polytechnic Diploma / ITI / Fast Employment
  if (query.includes('diploma') || query.includes('polytechnic') || query.includes('iti') || query.includes('vocational') || query.includes('trade')) {
    return `Hello ${studentName}! A Polytechnic Diploma directly after 10th standard is an excellent, practical, and highly affordable pathway:

### 3-Year Polytechnic Engineering Diploma:
- **Key Advantage:** Direct technical education without 11th/12th school board pressure.
- **Tuition Cost:** Extremely low in Government Polytechnics (typically ₹8,000–15,000/year).
- **Career Flexibility:**
  1. Join the workforce directly as a Junior Engineer (₹3–5 LPA).
  2. Take **Lateral Entry directly into 2nd Year of B.Tech (LEET)**, graduating with a full engineering degree in the exact same timeframe!

Would you like to explore government polytechnics in your home state?`
  }

  // Topic 5: Civil Services / Law / UPSC
  if (query.includes('upsc') || query.includes('ias') || query.includes('ips') || query.includes('law') || query.includes('clat') || query.includes('judge')) {
    return `Hello ${studentName}! Here is guidance on Law and Civil Services:

### Integrated Law & Civil Services:
1. **5-Year Integrated Law (B.A. LL.B):** You can enter premier National Law Universities (NLUs like NLSIU Bangalore) directly after 12th in any stream by cracking **CLAT**.
2. **UPSC Civil Services (IAS/IPS):** Requires any recognized Bachelor degree (B.A., B.Com, B.Tech, MBBS). Many students choose Arts & Humanities (Political Science, History) for syllabus overlap with General Studies.

**Key Strength Needed:** Strong reading comprehension, critical analysis, and public policy awareness.

Would you like to compare the 5-Year Integrated Law pathway with standard 3-year graduation?`
  }

  // Default Profile-Aware Heuristic
  return `Hello ${studentName}! Thank you for your question.

Based on your student profile and assessment:
- **Your Top Recommended Pathway:** ${topPathway}
${latestResult?.summary ? `- **Guidance Summary:** ${latestResult.summary.slice(0, 160)}...` : ''}

**How I can assist you:**
1. Compare specific 11th standard streams (PCM vs PCB vs Commerce vs Arts vs Diploma)
2. Explain national entrance examinations (JEE, NEET, CUET, CLAT, NID, IPMAT)
3. Share fee structures and admission criteria for top Indian colleges
4. Discuss career tradeoffs (salary growth, work environment, training duration)

Feel free to ask any specific question about your stream choices!`
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    const { message, history } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    let profile: any = null
    let latestResult: any = null

    if (user?.id) {
      profile = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
      })

      latestResult = await prisma.assessmentResult.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      })
    }

    // Check if external OpenAI or Google AI key is provided in environment
    const openaiApiKey = process.env.OPENAI_API_KEY
    const googleApiKey = process.env.GOOGLE_AI_API_KEY

    if (openaiApiKey) {
      try {
        const systemPrompt = `You are SmartCareer AI, a professional, empathetic, and objective career counseling expert for Indian students after 10th standard.
Student Context:
- Name: ${profile?.studentName || 'Student'}
- Class: 10th Standard
- Board: ${profile?.board || 'CBSE/State'}
- 10th Marks/Percentage: ${profile?.percentageObtained || 'Not provided'}% (Math: ${profile?.mathMarks || 'N/A'}, Science: ${profile?.scienceMarks || 'N/A'}, English: ${profile?.englishMarks || 'N/A'})
- Preferred Location: ${profile?.preferredStudyLocation || 'India'}
- Budget Preference: ${profile?.budgetPreference || 'Budget friendly'}
- Latest Assessment Top Match: ${latestResult?.topPathways?.[0]?.pathwayName || 'Undecided'}

Guidelines:
1. Provide explainable, objective, realistic education guidance for Indian educational pathways (PCM, PCB, PCMB, Commerce with Math, Arts/Humanities, Polytechnic Diploma, ITI, etc.).
2. Do not guarantee career outcomes or salaries.
3. Be supportive, concise, and structured with clear markdown headings and bullet points.
4. Encourage discussion with parents and school counselors.`

        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...(Array.isArray(history) ? history.slice(-6) : []),
              { role: 'user', content: message },
            ],
            max_tokens: 600,
            temperature: 0.6,
          }),
        })

        if (openAiRes.ok) {
          const aiData = await openAiRes.json()
          const reply = aiData.choices?.[0]?.message?.content
          if (reply) {
            return NextResponse.json({ reply })
          }
        }
      } catch (aiErr) {
        console.warn('OpenAI API call failed, falling back to heuristic counselor:', aiErr)
      }
    }

    // Default intelligent offline counseling engine
    const reply = generateOfflineCounselingResponse(message, profile, latestResult)
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Counselor error:', error)
    return NextResponse.json({
      reply: 'I am here to help you navigate post-10th stream selection. You can ask about Science PCM, PCB, Commerce, Arts, or Polytechnic diplomas!',
    })
  }
}
