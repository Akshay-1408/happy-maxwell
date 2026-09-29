import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  BookOpen,
  DollarSign,
  Compass,
  MessageSquare,
  Users,
} from 'lucide-react'

export const metadata = {
  title: 'Parent Guide: Supporting Your Child After 10th | SmartCareer',
  description: 'How Indian parents can guide their children through post-10th stream selection with objective facts, empathy, and clarity.',
}

export default function ParentsPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <HeartHandshake className="h-4 w-4" />
          <span>Parent & Family Guidance Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Guiding Your Child After 10th Standard
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          How to have open, pressure-free career conversations, understand modern streams, and plan financially for higher education.
        </p>
      </div>

      {/* 3 Core Guiding Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
              <span>1. Guidance, Not Pressure</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 leading-relaxed">
            Every child possesses distinct cognitive strengths. Forcing engineering or medicine without natural aptitude often leads to high stress and lower outcomes.
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
              <span>2. Multi-Pathway Future</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 leading-relaxed">
            Commerce, Law (CLAT), Design (NID/UCEED), and Polytechnic Diplomas offer lucrative, high-growth careers comparable to traditional B.Tech degrees.
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
              <span>3. Financial Reality</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 leading-relaxed">
            Understand fee differences early: Government colleges (IITs/AIIMS/DU/Polytechnics) offer top ROI (&lt; ₹1–2 Lakhs total) vs Private universities (₹10–25 Lakhs).
          </CardContent>
        </Card>
      </div>

      {/* Stream Comparison Overview for Parents */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Understanding Post-10th Streams at a Glance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Science PCM</span>
              <Badge variant="secondary" className="text-[10px]">Math + Physics</Badge>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Best for students strong in logic and math aiming for Software, AI, Engineering, Architecture, or Defence (NDA).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Science PCB</span>
              <Badge variant="secondary" className="text-[10px]">Biology + Health</Badge>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Best for healthcare, clinical medicine (MBBS), Pharmacy, Physiotherapy, and Biotechnology research via NEET-UG.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Commerce with Math</span>
              <Badge variant="secondary" className="text-[10px]">Finance + Accounts</Badge>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Opens doors to Chartered Accountancy (CA), Investment Banking, Corporate Management (IIM IPM), and Data Analytics.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Arts & Humanities</span>
              <Badge variant="secondary" className="text-[10px]">Law + Civil Services</Badge>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Premier path for 5-Year Integrated Law (NLUs via CLAT), UPSC Civil Services (IAS/IPS), UI/UX Design, and Psychology.
            </p>
          </div>
        </div>
      </section>

      {/* 5 Questions Parents Should Ask */}
      <Card className="border-blue-200 bg-blue-50/50 shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-blue-950 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            5 Healthy Questions to Ask Your Child
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs sm:text-sm text-slate-800">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p><strong>1. "Which subjects make you lose track of time when you study?"</strong> Helps identify natural flow vs forced effort.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p><strong>2. "Which subjects cause you stress or anxiety?"</strong> Highlights potential burnout areas before committing to 11th standard.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p><strong>3. "Do you prefer solving math problems or reading and writing essays?"</strong> Guides between quantitative and verbal streams.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p><strong>4. "How do you feel about 2–3 years of intense competitive exam coaching (JEE/NEET)?"</strong> Gauges psychological readiness for heavy exam cycles.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p><strong>5. "What kind of daily work environment sounds exciting to you?"</strong> Differentiates desk/code vs clinic vs field/adventure.</p>
          </div>
        </CardContent>
      </Card>

      {/* How to Avoid Burnout */}
      <Card className="border-amber-200 bg-amber-50/60 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold text-amber-950 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Avoiding Entrance Exam Burnout in 11th & 12th
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-amber-900 leading-relaxed">
          <p>
            Over 20 lakh students compete for JEE and NEET annually with less than 2% admission rates at top government colleges. Ensure your child always has a <strong>viable Plan B</strong> (e.g. State CETs, BCA, B.Sc, Commerce, or CUET).
          </p>
          <p>
            Encourage adequate sleep, physical sports, and hobbies to maintain mental health throughout 11th and 12th standard.
          </p>
        </CardContent>
      </Card>

      {/* Bottom CTA */}
      <div className="text-center pt-4 flex flex-col sm:flex-row justify-center gap-3">
        <Link href="/assessment">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-bold text-xs sm:text-sm gap-2 shadow-md w-full sm:w-auto">
            Take Career Assessment With Your Child
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/counselor">
          <Button variant="outline" size="lg" className="text-xs sm:text-sm font-semibold gap-2 border-slate-300 w-full sm:w-auto">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            Ask AI Counselor Questions
          </Button>
        </Link>
      </div>
    </div>
  )
}
