'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
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
    glow: 'shadow-indigo-500/30',
  },
  {
    icon: Building2,
    title: 'College & Course Discovery',
    desc: 'Explore 20+ premier Indian colleges (IITs, NITs, AIIMS, SRCC, Polytechnics) with real fees and entrance exams.',
    link: '/colleges',
    linkText: 'Browse College Explorer',
    gradient: 'from-violet-500 to-purple-500',
    glow: 'shadow-violet-500/30',
  },
  {
    icon: HeartHandshake,
    title: 'Parent Discussion Guide',
    desc: 'Questions parents should ask, avoiding entrance exam burnout, and financial planning for higher education.',
    link: '/parents',
    linkText: 'Read Parent Guide',
    gradient: 'from-rose-500 to-pink-500',
    glow: 'shadow-rose-500/30',
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

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

// ─── FAQ Item ──────────────────────────────────────────────────────────────────

function FaqItem({ faq, idx }: { faq: { q: string; a: string }; idx: number }) {
  const ref = useScrollReveal()
  const [open, setOpen] = useState(false)

  return (
    <div
      ref={ref}
      className="reveal glass-card rounded-2xl overflow-hidden cursor-pointer group"
      style={{ transitionDelay: `${idx * 60}ms` }}
      onClick={() => setOpen((v) => !v)}
    >
      <div className="flex items-start justify-between gap-4 p-5">
        <h3 className="text-[15px] font-semibold text-slate-200 leading-snug">{faq.q}</h3>
        <ChevronDown
          className={`h-5 w-5 text-indigo-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </div>
      {open && (
        <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/[0.04] pt-4 animate-fade-in-up">
          {faq.a}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const statsRef = useScrollReveal()
  const pathwaysRef = useScrollReveal()
  const featuresRef = useScrollReveal()
  const faqRef = useScrollReveal()

  return (
    <div className="relative overflow-x-hidden">

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Blob backgrounds */}
        <div className="blob blob-1 w-[600px] h-[600px] -top-32 -left-32" />
        <div className="blob blob-2 w-[500px] h-[500px] top-20 -right-24" />
        <div className="blob blob-3 w-[400px] h-[400px] bottom-0 left-1/3" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative container mx-auto px-4 sm:px-6 py-20 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge pill */}
              <div className="opacity-0 animate-fade-in-up animation-delay-100 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-semibold">
                <Sparkles className="h-4 w-4 animate-pulse" />
                AI-Assisted Career Platform for Indian Students
              </div>

              {/* Headline */}
              <div className="opacity-0 animate-fade-in-up animation-delay-200 space-y-2">
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
                  What Should You Do{' '}
                  <br className="hidden sm:block" />
                  <span className="gradient-text">After 10th Standard?</span>
                </h1>
              </div>

              {/* Sub-headline */}
              <p className="opacity-0 animate-fade-in-up animation-delay-300 text-[17px] text-slate-400 max-w-lg leading-relaxed font-body">
                Stop guessing your stream. Analyze your academic marks, subject interests, aptitude, and career goals to get{' '}
                <span className="text-slate-200 font-semibold">explainable, data-driven recommendations.</span>
              </p>

              {/* CTAs */}
              <div className="opacity-0 animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row gap-3">
                <Link href="/assessment">
                  <button className="relative group flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-bold text-white btn-gradient overflow-hidden">
                    <Sparkles className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Start Career Assessment</span>
                    <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </Link>
                <Link href="/careers">
                  <button className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold text-slate-300 border border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/5 hover:text-white transition-all duration-300">
                    Explore 30+ Careers
                  </button>
                </Link>
                <Link href="/counselor">
                  <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all duration-200">
                    <MessageSquare className="h-4 w-4" />
                    AI Counselor
                  </button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="opacity-0 animate-fade-in-up animation-delay-500 flex flex-wrap items-center gap-5 text-[13px] text-slate-500">
                {['30-Question Assessment', 'Multi-Factor Scoring', '100% Free'].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Decision Engine Card */}
            <div className="opacity-0 animate-fade-in-up animation-delay-400 animate-float">
              <div className="glass-card rounded-3xl p-7 space-y-5 gradient-border relative">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Decision Engine</p>
                    <h3 className="text-lg font-bold text-white">SmartCareer Analysis</h3>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-indigo-400" />
                  </div>
                </div>

                {/* Inputs flow */}
                <div className="space-y-2">
                  {[
                    { label: '10th Marks', value: 'Baseline Academic Score', pct: 20 },
                    { label: 'Subject Interest', value: 'Science & Math Aptitude', pct: 30 },
                    { label: 'Career Goals', value: 'Engineering / Technology', pct: 15 },
                    { label: 'Personality Fit', value: 'Analytical & Creative', pct: 10 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-28 shrink-0">
                        <p className="text-[11px] font-semibold text-slate-400">{item.label}</p>
                        <p className="text-[10px] text-slate-600 truncate">{item.value}</p>
                      </div>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                          style={{ width: `${item.pct * 3.3}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-indigo-300 w-8 text-right">{item.pct}%</span>
                    </div>
                  ))}
                </div>

                {/* Result */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Top Stream Match</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      88% Fit Score
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚛️</span>
                    <div>
                      <p className="text-[14px] font-bold text-white">Science (PCM)</p>
                      <p className="text-[11px] text-slate-400">JEE → B.Tech → Software Engineer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    <span>₹8–25 LPA · <span className="text-emerald-400 font-semibold">High Demand</span></span>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="flex flex-wrap gap-2">
                  {['Explains WHY', '6-Month Roadmap', 'Entrance Exams'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-medium text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────── */}
      <div ref={statsRef} className="reveal border-y border-white/[0.06] glass">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 group"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors duration-200">
                  <stat.icon className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold gradient-text-static leading-none">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pathways Grid ─────────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        <div className="blob blob-1 w-[400px] h-[400px] top-10 -right-32 opacity-10" />

        <div className="container mx-auto px-4 sm:px-6 space-y-12">
          {/* Section header */}
          <div ref={pathwaysRef} className="reveal text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Compass className="h-3.5 w-3.5" />
              Education Streams
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Explore Pathways <span className="gradient-text">After 10th</span>
            </h2>
            <p className="text-slate-400 text-[15px] leading-relaxed">
              Understand subjects, difficulty levels, and career outcomes for all primary Indian educational streams.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {streams.map((s, idx) => (
              <StreamCard key={idx} stream={s} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Bento Grid ───────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="container mx-auto px-4 sm:px-6 space-y-12">
          <div ref={featuresRef} className="reveal text-center max-w-xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" />
              Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything You Need to{' '}
              <span className="gradient-text">Decide Confidently</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f, idx) => (
              <FeatureCard key={idx} feature={f} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-10">
          <div ref={faqRef} className="reveal text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-slate-500 text-[14px]">Common questions about post-10th stream selection and assessment.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <FaqItem key={idx} faq={faq} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="container mx-auto px-4 sm:px-6 text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Ready to Find Your{' '}
              <span className="gradient-text">Perfect Path?</span>
            </h2>
            <p className="text-slate-400 text-[16px] leading-relaxed">
              Take the free 30-question assessment and get an explainable, personalized stream recommendation in minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/assessment">
              <button className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[16px] font-bold text-white btn-gradient">
                <Sparkles className="h-5 w-5" />
                Start Free Assessment
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
            <Link href="/counselor">
              <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[16px] font-semibold text-slate-300 border border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/5 hover:text-white transition-all duration-300">
                <MessageSquare className="h-5 w-5" />
                Chat with AI Counselor
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

// ─── Stream Card Sub-component ─────────────────────────────────────────────────

function StreamCard({ stream, idx }: { stream: typeof streams[0]; idx: number }) {
  const ref = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`reveal glass-card rounded-2xl p-6 flex flex-col gap-4 border border-white/[0.06] transition-all duration-300 cursor-default ${stream.borderColor}`}
      style={{ transitionDelay: `${idx * 80}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className={`text-3xl p-2.5 rounded-xl bg-gradient-to-br ${stream.gradient}`}>
          {stream.icon}
        </div>
        <span className={`text-xs font-semibold ${stream.accentColor} opacity-60 mt-1`}>Stream</span>
      </div>

      {/* Title & Description */}
      <div className="space-y-1.5">
        <h3 className="text-[16px] font-bold text-white">{stream.name}</h3>
        <p className="text-[13px] text-slate-400 leading-relaxed">{stream.desc}</p>
      </div>

      {/* Career tags */}
      <div className="flex flex-wrap gap-1.5">
        {stream.careers.map((c, i) => (
          <span
            key={i}
            className="px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06]"
          >
            {c}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link href={stream.link} className="mt-auto">
        <button
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-semibold border border-white/[0.08] hover:border-current ${stream.accentColor} hover:bg-white/5 transition-all duration-200 group`}
        >
          <span>Explore Stream Guide</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </Link>
    </div>
  )
}

// ─── Feature Card Sub-component ──────────────────────────────────────────────

function FeatureCard({ feature, idx }: { feature: typeof features[0]; idx: number }) {
  const ref = useScrollReveal()

  return (
    <div
      ref={ref}
      className="reveal glass-card rounded-2xl p-6 flex flex-col gap-4 group hover:scale-[1.02] transition-all duration-300"
      style={{ transitionDelay: `${idx * 100}ms` }}
    >
      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg ${feature.glow}`}>
        <feature.icon className="h-6 w-6 text-white" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-[16px] font-bold text-white">{feature.title}</h3>
        <p className="text-[13px] text-slate-400 leading-relaxed">{feature.desc}</p>
      </div>
      <Link
        href={feature.link}
        className="mt-auto flex items-center gap-1.5 text-[13px] font-semibold text-indigo-400 hover:text-indigo-300 group-hover:gap-2.5 transition-all duration-200"
      >
        {feature.linkText}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
