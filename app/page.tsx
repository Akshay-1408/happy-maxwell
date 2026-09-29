'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { GsapReveal } from '@/components/animations/gsap-reveal'
import { Spotlight } from '@/components/animations/spotlight'
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Compass,
  ShieldCheck,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  Building2,
  Scale,
  Award,
  Zap,
  Target,
  Brain,
  TrendingUp,
  ChevronDown,
  BookOpen,
  Check,
} from 'lucide-react'

// ─── Data ───────────────────────────────────────────────────────────────────

const streams = [
  {
    name: 'Science (PCM)',
    icon: '⚛️',
    gradient: 'from-blue-500/20 to-indigo-500/20',
    accentColor: 'text-blue-400',
    borderColor: 'hover:border-blue-500/40',
    desc: 'Physics, Chemistry, Mathematics. Ideal for software engineering, AI/ML, robotics, architecture, and aviation.',
    careers: ['Software Developer', 'AI/ML Engineer', 'Mechanical Engineer', 'Commercial Pilot'],
    link: '/pathways/science-pcm',
  },
  {
    name: 'Science (PCB)',
    icon: '🧬',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    accentColor: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/40',
    desc: 'Physics, Chemistry, Biology. Ideal for clinical medicine, dental, pharmacy, physiotherapy, and biotechnology.',
    careers: ['Clinical Doctor (MBBS)', 'Pharmacist', 'Physiotherapist', 'Biotechnologist'],
    link: '/pathways/science-pcb',
  },
  {
    name: 'Science (PCMB)',
    icon: '🔬',
    gradient: 'from-violet-500/20 to-purple-500/20',
    accentColor: 'text-violet-400',
    borderColor: 'hover:border-violet-500/40',
    desc: 'Combined Mathematics & Biology. Keeps both Engineering (JEE) and Medical (NEET) options open.',
    careers: ['Biomedical Engineer', 'Bioinformatics Specialist', 'Clinical Doctor', 'Forensic Scientist'],
    link: '/pathways/science-pcmb',
  },
  {
    name: 'Commerce with Math',
    icon: '📈',
    gradient: 'from-amber-500/20 to-orange-500/20',
    accentColor: 'text-amber-400',
    borderColor: 'hover:border-amber-500/40',
    desc: 'Accountancy, Economics, Business Studies & Math. Ideal for Chartered Accountancy, Investment Banking, and IIM IPM.',
    careers: ['Chartered Accountant (CA)', 'Investment Banker', 'Product Manager', 'Data Analyst'],
    link: '/pathways/commerce-with-math',
  },
  {
    name: 'Arts & Humanities',
    icon: '🎭',
    gradient: 'from-rose-500/20 to-pink-500/20',
    accentColor: 'text-rose-400',
    borderColor: 'hover:border-rose-500/40',
    desc: 'History, Political Science, Psychology, Sociology. Ideal for corporate law (CLAT), Civil Services (UPSC), and UI/UX design.',
    careers: ['Corporate Lawyer', 'Civil Services Officer (IAS)', 'UI/UX Designer', 'Clinical Psychologist'],
    link: '/pathways/arts-humanities',
  },
  {
    name: 'Polytechnic Diploma',
    icon: '⚙️',
    gradient: 'from-cyan-500/20 to-sky-500/20',
    accentColor: 'text-cyan-400',
    borderColor: 'hover:border-cyan-500/40',
    desc: '3-Year Practical technical diploma after 10th. Direct entry into industry or lateral admission to 2nd year B.Tech.',
    careers: ['Junior Engineer', 'CAD Specialist', 'Automation Supervisor'],
    link: '/pathways/diploma-engineering',
  },
]

const features = [
  {
    icon: Scale,
    title: 'Side-by-Side Comparison',
    desc: 'Compare up to 3 careers or 3 colleges side-by-side evaluating tuition costs, duration, skills, and eligibility.',
    link: '/compare',
    linkText: 'Open Comparison Matrix',
    gradient: 'from-indigo-500 to-violet-500',
    glow: 'shadow-indigo-500/20',
  },
  {
    icon: Building2,
    title: 'College & Course Discovery',
    desc: 'Explore 20+ premier Indian colleges (IITs, NITs, AIIMS, SRCC, Polytechnics) with verified fees and entrance exams.',
    link: '/colleges',
    linkText: 'Browse College Explorer',
    gradient: 'from-violet-500 to-purple-500',
    glow: 'shadow-violet-500/20',
  },
  {
    icon: HeartHandshake,
    title: 'Parent Discussion Guide',
    desc: 'Questions parents should ask, avoiding entrance exam burnout, and financial planning for higher education.',
    link: '/parents',
    linkText: 'Read Parent Guide',
    gradient: 'from-cyan-500 to-blue-500',
    glow: 'shadow-cyan-500/20',
  },
]

const faqs = [
  {
    q: 'Is this a guaranteed prediction of my exact career?',
    a: 'No. SmartCareer provides objective decision-support guidance based on your academic performance, subject interests, and aptitude. It empowers you to understand stream tradeoffs and discuss options with parents and school counselors.',
  },
  {
    q: 'How are stream recommendations calculated?',
    a: 'Recommendations use a transparent multi-factor scoring engine that weighs Interest (30%), Aptitude (20%), 10th Standard Academic Marks (20%), Work/Learning Preferences (15%), Personality Fit (10%), and Constraints (5%).',
  },
  {
    q: 'Can I compare colleges and careers side-by-side?',
    a: 'Yes! You can compare up to 3 careers or up to 3 colleges side-by-side, evaluating tuition fees, entrance exams, salaries, skills, and eligibility.',
  },
  {
    q: 'Is SmartCareer completely free to use?',
    a: 'Yes! The 30-question assessment, career directory, college explorer, comparison tool, AI counselor, and parent guide are 100% free for students.',
  },
  {
    q: 'How does the AI Career Counselor work?',
    a: 'Our server-side AI counselor uses your stored 10th profile and assessment scores to answer questions, explain stream tradeoffs, and recommend next steps without making unrealistic guarantees.',
  },
]

const stats = [
  { value: '30+', label: 'Career Paths', icon: Target },
  { value: '20+', label: 'Top Colleges', icon: Building2 },
  { value: '6', label: 'Stream Guides', icon: Compass },
  { value: '100%', label: 'Free Forever', icon: Award },
]

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from('.hero-headline', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      })
      gsap.from('.hero-sub', {
        y: 25,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
      })
      gsap.from('.hero-cta', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        delay: 0.35,
        ease: 'power3.out',
      })
      gsap.from('.hero-card', {
        scale: 0.93,
        opacity: 0,
        duration: 1,
        delay: 0.25,
        ease: 'power2.out',
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative overflow-x-hidden bg-[#090a0f]">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-violet-600/8 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden py-16 lg:py-24">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative container mx-auto px-4 sm:px-6 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold shadow-inner">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>AI-Assisted Career Intelligence for 10th Standard</span>
              </div>

              {/* Headline */}
              <div className="hero-headline space-y-3">
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-white">
                  What Should You Do{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">
                    After 10th Standard?
                  </span>
                </h1>
              </div>

              {/* Sub-headline */}
              <p className="hero-sub text-[16px] sm:text-[18px] text-slate-400 max-w-xl leading-relaxed">
                Stop guessing your stream. Analyze your academic marks, subject interests, aptitude, and career goals with{' '}
                <span className="text-slate-200 font-semibold">transparent, data-backed guidance.</span>
              </p>

              {/* CTAs */}
              <div className="hero-cta flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/assessment">
                  <button className="btn-gradient flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-[14px] font-bold text-white shadow-xl shadow-indigo-500/20 group">
                    <Sparkles className="h-4 w-4 text-indigo-200" />
                    <span>Start Free Assessment</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </Link>
                <Link href="/careers">
                  <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-semibold text-slate-300 bg-white/[0.04] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.08] hover:text-white transition-all duration-200">
                    Explore 30+ Careers
                  </button>
                </Link>
                <Link href="/counselor">
                  <button className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-[14px] font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all duration-200">
                    <MessageSquare className="h-4 w-4" />
                    AI Counselor
                  </button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-[13px] text-slate-400 pt-2">
                {['30-Question Aptitude Engine', 'Multi-Factor Scoring', '100% Free Forever'].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Decision Engine Simulation Card */}
            <div className="hero-card relative">
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08] relative overflow-hidden shadow-2xl shadow-black/80">
                <Spotlight fill="rgba(99, 102, 241, 0.22)" />

                {/* Card header */}
                <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/[0.06]">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Multi-Factor Engine</span>
                    <h3 className="text-lg font-extrabold text-white">SmartCareer Assessment Fit</h3>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-inner">
                    <Brain className="h-5 w-5 text-indigo-400" />
                  </div>
                </div>

                {/* Inputs flow */}
                <div className="relative z-10 space-y-3">
                  {[
                    { label: '10th Academics', value: 'Math (88%), Science (92%)', pct: 20, color: 'from-indigo-500 to-indigo-600' },
                    { label: 'Subject Interest', value: 'Coding, Physics & Robotics', pct: 30, color: 'from-violet-500 to-purple-600' },
                    { label: 'Career Goals', value: 'Tech / Software Engineering', pct: 15, color: 'from-cyan-500 to-blue-600' },
                    { label: 'Personality Fit', value: 'Analytical & Structured', pct: 10, color: 'from-emerald-500 to-teal-600' },
                  ].map((item) => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-300">{item.label}</span>
                        <span className="text-[11px] text-slate-500">{item.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#090b12] rounded-full overflow-hidden border border-white/[0.04]">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                          style={{ width: `${item.pct * 3.3}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Result Preview Box */}
                <div className="relative z-10 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-[#0e1220] to-[#121729] border border-indigo-500/25 p-4 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Top Stream Match</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      89% Fit Score
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">⚛️</span>
                    <div>
                      <p className="text-[15px] font-bold text-white">Science (PCM)</p>
                      <p className="text-[12px] text-slate-400">JEE Main/Adv → B.Tech → AI / Software</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/[0.04] text-slate-400">
                    <span>Est. Starting CTC: <span className="text-emerald-400 font-bold">₹8 - 24 LPA</span></span>
                    <span className="text-indigo-400 font-semibold">High Growth Outlook</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────── */}
      <GsapReveal animation="fade-in">
        <div className="border-y border-white/[0.07] bg-[#0c0e17]/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3.5 group">
                  <div className="h-11 w-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:border-indigo-400/40 transition-colors">
                    <stat.icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white tracking-tight leading-none">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GsapReveal>

      {/* ── Pathways Grid ─────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 space-y-14">
          <GsapReveal animation="fade-up" className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Compass className="h-3.5 w-3.5" />
              Stream Directory
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Explore Pathways <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">After 10th</span>
            </h2>
            <p className="text-slate-400 text-[15px] leading-relaxed">
              Understand subject combinations, difficulty levels, and career outcomes for all primary Indian educational streams.
            </p>
          </GsapReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((s, idx) => (
              <GsapReveal key={idx} animation="fade-up" delay={idx * 0.08}>
                <div
                  className={`glass-card rounded-2xl p-6 flex flex-col gap-4 border border-white/[0.07] h-full ${s.borderColor}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`text-3xl p-3 rounded-2xl bg-gradient-to-br ${s.gradient} border border-white/5`}>
                      {s.icon}
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${s.accentColor} bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/[0.06]`}>
                      Stream
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-[17px] font-bold text-white">{s.name}</h3>
                    <p className="text-[13px] text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {s.careers.map((c, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-medium text-slate-300 bg-[#0b0e18] border border-white/[0.06]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <Link href={s.link} className="mt-auto pt-2">
                    <button
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-semibold border border-white/[0.08] hover:border-indigo-500/40 hover:bg-indigo-500/10 text-slate-200 hover:text-white transition-all group`}
                    >
                      <span>Explore Stream Guide</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </Link>
                </div>
              </GsapReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Bento Grid ───────────────────────────────────── */}
      <section className="py-24 border-t border-white/[0.07] relative">
        <div className="container mx-auto px-4 sm:px-6 space-y-14">
          <GsapReveal animation="fade-up" className="text-center max-w-xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" />
              Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything You Need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Decide Confidently</span>
            </h2>
          </GsapReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <GsapReveal key={idx} animation="fade-up" delay={idx * 0.1}>
                <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 h-full border border-white/[0.07] hover:border-indigo-500/30">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg ${f.glow}`}>
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-[17px] font-bold text-white">{f.title}</h3>
                    <p className="text-[13px] text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                  <Link
                    href={f.link}
                    className="mt-auto flex items-center gap-1.5 text-[13px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors pt-2"
                  >
                    {f.linkText}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </GsapReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/[0.07]">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-10">
          <GsapReveal animation="fade-up" className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Questions</span>
            </h2>
            <p className="text-slate-400 text-[14px]">Common questions about post-10th stream selection and assessment.</p>
          </GsapReveal>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <GsapReveal key={idx} animation="fade-up" delay={idx * 0.05}>
                <FaqAccordionItem faq={faq} />
              </GsapReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/[0.07] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 text-center space-y-8 max-w-2xl relative z-10">
          <GsapReveal animation="fade-up" className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to Discover Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">Ideal Pathway?</span>
            </h2>
            <p className="text-slate-400 text-[16px] leading-relaxed">
              Take the free 30-question assessment and get an explainable, personalized stream recommendation in minutes.
            </p>
          </GsapReveal>
          <GsapReveal animation="fade-up" delay={0.15}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/assessment">
                <button className="btn-gradient flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[15px] font-bold text-white shadow-xl shadow-indigo-500/25">
                  <Sparkles className="h-5 w-5 text-indigo-200" />
                  <span>Start Free Assessment</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/counselor">
                <button className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-[15px] font-semibold text-slate-300 bg-white/[0.04] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.08] hover:text-white transition-all">
                  <MessageSquare className="h-5 w-5 text-indigo-400" />
                  <span>Chat with AI Counselor</span>
                </button>
              </Link>
            </div>
          </GsapReveal>
        </div>
      </section>

    </div>
  )
}

function FaqAccordionItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="glass-card rounded-2xl overflow-hidden cursor-pointer border border-white/[0.07] transition-all"
      onClick={() => setOpen((v) => !v)}
    >
      <div className="flex items-center justify-between gap-4 p-5">
        <h3 className="text-[15px] font-semibold text-slate-200 leading-snug">{faq.q}</h3>
        <ChevronDown
          className={`h-4 w-4 text-indigo-400 shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </div>
      {open && (
        <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/[0.04] pt-4">
          {faq.a}
        </div>
      )}
    </div>
  )
}
