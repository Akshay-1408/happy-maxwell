'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { GsapReveal } from '@/components/animations/gsap-reveal'
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Compass,
  HeartHandshake,
  MessageSquare,
  Building2,
  Scale,
  Award,
  Target,
  ChevronDown,
  Brain,
  Sparkles,
  BookOpen,
  TrendingUp,
  Zap,
} from 'lucide-react'

// ─── Data ───────────────────────────────────────────────────────────────────

const streams = [
  {
    name: 'Science (PCM)',
    icon: '⚛️',
    color: 'blue',
    desc: 'Physics, Chemistry, Mathematics. Ideal for engineering, software, AI/ML, and aviation.',
    careers: ['Software Developer', 'AI Engineer', 'Mechanical Engineer', 'Pilot'],
    link: '/pathways/science-pcm',
  },
  {
    name: 'Science (PCB)',
    icon: '🧬',
    color: 'emerald',
    desc: 'Physics, Chemistry, Biology. Ideal for medicine, dentistry, pharmacy, and biotech.',
    careers: ['MBBS Doctor', 'Pharmacist', 'Physiotherapist', 'Biotechnologist'],
    link: '/pathways/science-pcb',
  },
  {
    name: 'Science (PCMB)',
    icon: '🔬',
    color: 'violet',
    desc: 'Combined Maths & Biology. Keeps both JEE and NEET options open simultaneously.',
    careers: ['Biomedical Engineer', 'Clinical Doctor', 'Bioinformatics Specialist'],
    link: '/pathways/science-pcmb',
  },
  {
    name: 'Commerce with Math',
    icon: '📈',
    color: 'amber',
    desc: 'Accountancy, Economics, Business & Math. Great for CA, investment banking, and IIM IPM.',
    careers: ['Chartered Accountant', 'Investment Banker', 'Data Analyst'],
    link: '/pathways/commerce-with-math',
  },
  {
    name: 'Arts & Humanities',
    icon: '🎭',
    color: 'rose',
    desc: 'History, Political Science, Psychology. Paths include law (CLAT), UPSC, and design.',
    careers: ['Corporate Lawyer', 'IAS Officer', 'UX Designer', 'Psychologist'],
    link: '/pathways/arts-humanities',
  },
  {
    name: 'Polytechnic Diploma',
    icon: '⚙️',
    color: 'cyan',
    desc: '3-year practical diploma. Enter industry faster or join B.Tech via lateral entry.',
    careers: ['Junior Engineer', 'CAD Specialist', 'Automation Technician'],
    link: '/pathways/diploma-engineering',
  },
]

const colorMap: Record<string, { bg: string; text: string; border: string; tag: string }> = {
  blue:    { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   tag: 'bg-blue-50 text-blue-600 border-blue-200' },
  emerald: { bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',tag: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  violet:  { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', tag: 'bg-violet-50 text-violet-600 border-violet-200' },
  amber:   { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  tag: 'bg-amber-50 text-amber-600 border-amber-200' },
  rose:    { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200',   tag: 'bg-rose-50 text-rose-600 border-rose-200' },
  cyan:    { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200',   tag: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
}

const features = [
  {
    icon: Scale,
    title: 'Side-by-Side Comparison',
    desc: 'Compare up to 3 careers or colleges at once — fees, entrance exams, salaries, and eligibility.',
    link: '/compare',
    linkText: 'Open Comparison Tool',
    iconBg: 'bg-blue-600',
  },
  {
    icon: Building2,
    title: 'College & Course Discovery',
    desc: 'Explore 20+ top Indian colleges — IITs, NITs, AIIMS, SRCC — with verified fees and entrance info.',
    link: '/colleges',
    linkText: 'Browse Colleges',
    iconBg: 'bg-blue-600',
  },
  {
    icon: HeartHandshake,
    title: 'Parent Discussion Guide',
    desc: 'Key questions to ask together, how to plan fees, and how to avoid entrance exam burnout.',
    link: '/parents',
    linkText: 'Read the Guide',
    iconBg: 'bg-blue-600',
  },
]

const faqs = [
  {
    q: 'Is this a guaranteed prediction of my career?',
    a: 'No. SmartCareer gives you objective, data-backed guidance — not guarantees. It helps you understand your options, not make decisions for you.',
  },
  {
    q: 'How are recommendations calculated?',
    a: 'A transparent scoring engine weighs 6 factors: Interest (30%), Aptitude (20%), Academic Marks (20%), Work Style (15%), Personality Fit (10%), and Constraints (5%).',
  },
  {
    q: 'Can I compare careers and colleges?',
    a: 'Yes. Compare up to 3 careers or 3 colleges side-by-side across fees, entrance exams, expected salaries, and required skills.',
  },
  {
    q: 'Is SmartCareer free to use?',
    a: 'Yes — 100% free. The assessment, career directory, college explorer, comparison tool, AI counselor, and parent guide are all free.',
  },
  {
    q: 'How does the AI Counselor work?',
    a: 'It uses your saved 10th profile and assessment results to answer questions about streams and career tradeoffs in plain, honest language.',
  },
]

const stats = [
  { value: '30+', label: 'Career Paths Covered',   icon: Target },
  { value: '20+', label: 'Top Colleges Listed',    icon: Building2 },
  { value: '6',   label: 'Stream Guides Available', icon: Compass },
  { value: '100%', label: 'Free for Students',     icon: Award },
]

const howItWorks = [
  { step: 1, title: 'Create your 10th profile', desc: 'Add your marks, subject interests, and career goals.', icon: BookOpen },
  { step: 2, title: 'Take the 30-question assessment', desc: 'Answer questions on aptitude, personality, and preferences.', icon: Brain },
  { step: 3, title: 'Get your stream recommendation', desc: 'See a ranked list of streams with fit scores and explanations.', icon: TrendingUp },
]

// ─── Page ───────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.from('.hero-badge', { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out' })
      gsap.from('.hero-headline', { y: 30, opacity: 0, duration: 0.7, delay: 0.1, ease: 'power3.out' })
      gsap.from('.hero-sub',      { y: 20, opacity: 0, duration: 0.6, delay: 0.25, ease: 'power2.out' })
      gsap.from('.hero-cta',      { y: 16, opacity: 0, duration: 0.5, delay: 0.38, ease: 'power2.out' })
      gsap.from('.hero-trust',    { y: 12, opacity: 0, duration: 0.5, delay: 0.5,  ease: 'power2.out' })
      gsap.from('.hero-card',     { y: 24, opacity: 0, duration: 0.8, delay: 0.2,  ease: 'power3.out' })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div className="bg-[#f8fafc]">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 hero-pattern opacity-60 pointer-events-none"
          aria-hidden="true"
        />
        {/* Subtle top-edge blue glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-100 blur-[100px] opacity-50 pointer-events-none rounded-full"
          aria-hidden="true"
        />

        <div className="relative container mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left */}
            <div className="space-y-7 max-w-xl">
              <div className="hero-badge">
                <span className="badge-blue">
                  <Sparkles className="h-3 w-3" />
                  AI-Assisted Career Guidance · After 10th Standard
                </span>
              </div>

              <div className="hero-headline">
                <h1 className="text-display text-4xl sm:text-5xl text-slate-900 leading-[1.1]">
                  What Should You Do{' '}
                  <span className="text-gradient-blue">After 10th Standard?</span>
                </h1>
              </div>

              <p className="hero-sub text-lg text-slate-600 leading-relaxed">
                Stop guessing your stream. Get a clear, honest recommendation based on your academic marks, subject interests, aptitude, and career goals.
              </p>

              <div className="hero-cta flex flex-wrap gap-3">
                <Link href="/assessment">
                  <button className="btn-primary px-6 py-2.5 text-sm">
                    Start Free Assessment
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/careers">
                  <button className="btn-secondary px-5 py-2.5 text-sm">
                    Explore Careers
                  </button>
                </Link>
                <Link href="/counselor">
                  <button className="btn-ghost text-sm flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                    <MessageSquare className="h-4 w-4" />
                    AI Counselor
                  </button>
                </Link>
              </div>

              <div className="hero-trust flex flex-wrap gap-5 text-sm text-slate-500">
                {['30-question aptitude test', 'Transparent scoring', '100% free forever'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Preview Card */}
            <div className="hero-card">
              <div className="card-raised rounded-xl p-6 sm:p-7 space-y-5 bg-white">
                {/* Card header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-0.5">
                      Assessment Preview
                    </p>
                    <h3 className="text-base font-bold text-slate-900">Your Stream Fit Score</h3>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                </div>

                {/* Scoring bars */}
                <div className="space-y-3.5">
                  {[
                    { label: '10th Marks',        value: 'Math 88%, Science 92%',   pct: 88, color: 'bg-blue-500' },
                    { label: 'Subject Interest',   value: 'Coding & Physics',        pct: 92, color: 'bg-blue-600' },
                    { label: 'Career Goals',       value: 'Tech / Software',         pct: 85, color: 'bg-blue-400' },
                    { label: 'Personality Fit',    value: 'Analytical & Structured', pct: 78, color: 'bg-slate-400' },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700">{item.label}</span>
                        <span className="text-slate-400">{item.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Result */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Top Match</span>
                    <span className="badge-green text-xs">89% fit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚛️</span>
                    <div>
                      <p className="font-bold text-slate-900">Science (PCM)</p>
                      <p className="text-xs text-slate-500">JEE → B.Tech → AI / Software Engineering</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-blue-200 text-slate-500">
                    <span>Starting CTC: <span className="font-semibold text-emerald-600">₹8 – 24 LPA</span></span>
                    <span className="text-blue-600 font-medium">High growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────────── */}
      <GsapReveal animation="fade-in">
        <div className="border-y border-slate-200 bg-white">
          <div className="container mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-slate-100">
              {stats.map((stat, i) => (
                <div key={stat.label} className={`flex items-center gap-3 ${i > 0 ? 'pl-6' : ''}`}>
                  <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <stat.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GsapReveal>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section className="py-20 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6">
          <GsapReveal animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge-blue mb-4">
              <Zap className="h-3 w-3" />
              How It Works
            </span>
            <h2 className="text-display text-3xl sm:text-4xl text-slate-900 mb-3">
              Three steps to clarity
            </h2>
            <p className="text-slate-600 text-base">
              No complex forms. No jargon. Just a clear path to understanding your best options after 10th.
            </p>
          </GsapReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, idx) => (
              <GsapReveal key={idx} animation="fade-up" delay={idx * 0.12}>
                <div className="flex flex-col items-start gap-4">
                  <div className="step-number">{step.step}</div>
                  <div className="h-11 w-11 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </GsapReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stream Pathways Grid ──────────────────────────────────────── */}
      <section className="py-20 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6">
          <GsapReveal animation="fade-up" className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge-blue mb-4">
              <Compass className="h-3 w-3" />
              Stream Directory
            </span>
            <h2 className="text-display text-3xl sm:text-4xl text-slate-900 mb-3">
              Explore your options after 10th
            </h2>
            <p className="text-slate-600 text-base">
              Understand subject combinations, difficulty, and career outcomes for every major Indian stream.
            </p>
          </GsapReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {streams.map((s, idx) => {
              const c = colorMap[s.color]
              return (
                <GsapReveal key={idx} animation="fade-up" delay={idx * 0.07}>
                  <div className="card-surface rounded-xl p-5 flex flex-col gap-4 h-full bg-white">
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl h-11 w-11 flex items-center justify-center rounded-lg ${c.bg} border ${c.border}`}>
                        {s.icon}
                      </span>
                      <span className={`badge-slate text-[11px]`}>Stream</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{s.name}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {s.careers.map((career, i) => (
                        <span key={i} className={`text-[11px] px-2 py-0.5 rounded border font-medium ${c.tag}`}>
                          {career}
                        </span>
                      ))}
                    </div>
                    <Link href={s.link} className="mt-auto">
                      <button className="w-full btn-secondary justify-between text-sm py-2">
                        <span>View Stream Guide</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                </GsapReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <GsapReveal animation="fade-up" className="text-center max-w-xl mx-auto mb-12">
            <span className="badge-blue mb-4">
              <Zap className="h-3 w-3" />
              Platform Features
            </span>
            <h2 className="text-display text-3xl sm:text-4xl text-slate-900 mb-3">
              Everything you need to decide
            </h2>
            <p className="text-slate-600 text-base">
              Free tools that give you real information, not vague advice.
            </p>
          </GsapReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <GsapReveal key={idx} animation="fade-up" delay={idx * 0.1}>
                <div className="card-surface rounded-xl p-6 flex flex-col gap-4 h-full bg-white">
                  <div className={`h-11 w-11 rounded-lg ${f.iconBg} flex items-center justify-center shadow-sm`}>
                    <f.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1.5">{f.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                  <Link href={f.link} className="mt-auto">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                      {f.linkText}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </div>
              </GsapReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <GsapReveal animation="fade-up" className="text-center mb-10">
            <h2 className="text-display text-3xl sm:text-4xl text-slate-900 mb-3">
              Frequently asked questions
            </h2>
            <p className="text-slate-500 text-base">Common questions about stream selection and the assessment.</p>
          </GsapReveal>

          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <GsapReveal key={idx} animation="fade-up" delay={idx * 0.05}>
                <FaqItem faq={faq} />
              </GsapReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-2xl">
          <GsapReveal animation="fade-up" className="space-y-6">
            <h2 className="text-display text-3xl sm:text-4xl text-white">
              Ready to find your stream?
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Take the free 30-question assessment and get a clear, personalized recommendation in minutes.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/assessment">
                <button className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm">
                  Start Free Assessment
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/counselor">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold text-sm hover:bg-blue-400 transition-colors border border-blue-400">
                  <MessageSquare className="h-4 w-4" />
                  Ask AI Counselor
                </button>
              </Link>
            </div>
          </GsapReveal>
        </div>
      </section>
    </div>
  )
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="card-surface rounded-lg overflow-hidden cursor-pointer bg-white"
      onClick={() => setOpen((v) => !v)}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-800">{faq.q}</h3>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </div>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
          {faq.a}
        </div>
      )}
    </div>
  )
}
