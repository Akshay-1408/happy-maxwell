'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Award,
  Compass,
  MessageSquare,
  Users,
  Calendar,
  Layers,
  GraduationCap,
  TrendingUp,
} from 'lucide-react'

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadResult() {
      try {
        const res = await fetch('/api/results')
        if (res.ok) {
          const data = await res.json()
          setResults(data)
          setLoading(false)
          return
        }

        const guestData = sessionStorage.getItem('latest_assessment_result')
        if (guestData) {
          setResults(JSON.parse(guestData))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadResult()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm text-slate-600 font-medium">Generating your explainable career profile...</p>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <Compass className="h-12 w-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Assessment Results Found</h2>
        <p className="text-slate-600 text-sm mb-6">
          Take the 30-question assessment to generate your stream alignment and action plan.
        </p>
        <Link href="/assessment">
          <Button className="bg-blue-600 hover:bg-blue-700 font-semibold text-xs">
            Start Career Assessment
          </Button>
        </Link>
      </div>
    )
  }

  const {
    categoryScores = [],
    topPathways = [],
    recommendedCareers = [],
    summary,
    strengths = [],
    skillsToDevelop = [],
    nextActions = [],
    roadmap = {},
  } = results

  const primaryPathway = topPathways[0]

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-8 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 bg-blue-800/80 text-blue-200 px-3.5 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="h-4 w-4" />
            <span>Explainable Stream Guidance</span>
          </div>
          <Link href="/assessment">
            <Button variant="outline" size="sm" className="text-slate-900 bg-white hover:bg-slate-100 gap-1.5 text-xs font-semibold">
              <RotateCcw className="h-3.5 w-3.5" />
              Retake Assessment
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your Career Decision Profile</h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">{summary}</p>

        {primaryPathway && (
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <span className="text-[11px] text-slate-300 block">Top Recommended Stream:</span>
              <span className="text-lg font-extrabold text-blue-300">{primaryPathway.pathwayName}</span>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-400/30">
              <span className="text-[11px] text-emerald-200 block">Alignment Score:</span>
              <span className="text-lg font-extrabold text-emerald-400">{primaryPathway.matchScore}% Match</span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: Top Recommended Pathways */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">1. Recommended Education Pathways After 10th</h2>
            <p className="text-xs text-slate-500 mt-0.5">Ranked by interest, aptitude, 10th academic marks, and personal preferences.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topPathways.slice(0, 4).map((pathway: any, idx: number) => (
            <Card key={idx} className="border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Badge className="bg-blue-600 text-white font-bold text-xs">
                    {pathway.matchScore}% Match Fit
                  </Badge>
                  <Badge variant="outline" className="text-[11px] font-medium text-slate-600">
                    {pathway.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">{pathway.pathwayName}</CardTitle>
                <CardDescription className="text-xs leading-relaxed mt-2 text-slate-700 bg-slate-50 p-3 rounded-lg border">
                  <strong>Why Recommended:</strong> {pathway.explanation}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 pt-0 text-xs text-slate-700">
                {pathway.strengths && pathway.strengths.length > 0 && (
                  <div>
                    <span className="font-semibold text-emerald-700 block mb-1">Key Strengths Identified:</span>
                    <ul className="space-y-1">
                      {pathway.strengths.map((st: string, sIdx: number) => (
                        <li key={sIdx} className="flex items-start gap-1.5 text-slate-600">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {pathway.thingsToImprove && pathway.thingsToImprove.length > 0 && (
                  <div>
                    <span className="font-semibold text-amber-700 block mb-1">Areas to Strengthen:</span>
                    <ul className="space-y-1">
                      {pathway.thingsToImprove.map((imp: string, iIdx: number) => (
                        <li key={iIdx} className="flex items-start gap-1.5 text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5 ml-1 mr-1" />
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <span className="font-semibold text-slate-800 block mb-1">Key Entrance Exams:</span>
                  <div className="flex flex-wrap gap-1">
                    {pathway.entranceExams?.map((exam: string, eIdx: number) => (
                      <Badge key={eIdx} variant="secondary" className="text-[10px]">{exam}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <div className="p-4 border-t bg-slate-50/50 rounded-b-xl flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">{pathway.duration}</span>
                <Link href={`/pathways/${pathway.pathwaySlug}`}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs gap-1 font-semibold">
                    Explore Pathway Guide <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 2: Top Matching Careers */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">2. Career Options Matching Your Profile</h2>
          <p className="text-xs text-slate-500 mt-0.5">Explore specific professions aligned with your recommended streams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedCareers.slice(0, 6).map((career: any, idx: number) => (
            <Card key={idx} className="border-slate-200 flex flex-col justify-between shadow-xs hover:shadow-sm">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-[10px] text-blue-700 border-blue-200 bg-blue-50 font-bold">
                    {career.matchScore}% Match
                  </Badge>
                  <span className="text-[10px] font-semibold text-slate-500">{career.salaryRange}</span>
                </div>
                <CardTitle className="text-base font-bold text-slate-900">{career.careerName}</CardTitle>
                <CardDescription className="text-xs text-slate-600 line-clamp-2 mt-1">
                  {career.explanation}
                </CardDescription>
              </CardHeader>

              <div className="p-4 pt-2 border-t mt-3 bg-slate-50/40">
                <Link href={`/careers/${career.careerSlug}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1 font-semibold">
                    View Career Details <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 3: Interest Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">3. Interest Area Breakdown</h2>
          <span className="text-xs text-slate-500 font-medium">Domain match score (0–100)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryScores.slice(0, 6).map((item: any, idx: number) => (
            <Card key={idx} className="border-slate-200 shadow-xs">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span>{item.label}</span>
                  <span className="text-blue-600 font-extrabold">{item.score}/100</span>
                </div>
                <Progress value={item.score} className="h-2" />
                <p className="text-xs text-slate-500">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 4: Personalized Action Roadmap */}
      {roadmap && (roadmap.thirtyDays || roadmap.threeMonths) && (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">4. Your Personalized Post-10th Roadmap</h2>
            <p className="text-xs text-slate-500 mt-0.5">Step-by-step milestones to prepare for stream selection, foundation study, and entrance readiness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 30 Days */}
            <Card className="border-blue-200 bg-blue-50/40 shadow-xs">
              <CardHeader className="pb-3 border-b border-blue-100">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Next 30 Days</span>
                </div>
                <CardDescription className="text-[11px] text-blue-900/70">Immediate exploration milestones</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {roadmap.thirtyDays?.map((item: any, i: number) => (
                  <div key={i} className="p-2.5 bg-white rounded-lg border border-blue-100 space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">{item.tag}</span>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-600">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 3 Months */}
            <Card className="border-indigo-200 bg-indigo-50/40 shadow-xs">
              <CardHeader className="pb-3 border-b border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  <span>Next 3 Months</span>
                </div>
                <CardDescription className="text-[11px] text-indigo-900/70">Foundation skill building</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {roadmap.threeMonths?.map((item: any, i: number) => (
                  <div key={i} className="p-2.5 bg-white rounded-lg border border-indigo-100 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">{item.tag}</span>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-600">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 6 Months */}
            <Card className="border-emerald-200 bg-emerald-50/40 shadow-xs">
              <CardHeader className="pb-3 border-b border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <GraduationCap className="h-4 w-4 text-emerald-600" />
                  <span>Next 6 Months</span>
                </div>
                <CardDescription className="text-[11px] text-emerald-900/70">College shortlist & exam prep</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {roadmap.sixMonths?.map((item: any, i: number) => (
                  <div key={i} className="p-2.5 bg-white rounded-lg border border-emerald-100 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">{item.tag}</span>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-600">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* SECTION 5: Next Steps, AI Counselor & Parent Mode CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-blue-700 font-bold text-xs bg-white px-3 py-1 rounded-full shadow-xs">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>AI Career Counselor</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Have Questions About These Results?</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ask our AI Counselor about subject combinations, exam difficulty, coaching options, or career tradeoffs tailored to your score.
            </p>
          </div>
          <div className="pt-4">
            <Link href="/counselor">
              <Button className="bg-blue-600 hover:bg-blue-700 text-xs font-semibold gap-2 shadow-md">
                Chat with AI Counselor <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-amber-50/40 p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-amber-800 font-bold text-xs bg-white px-3 py-1 rounded-full shadow-xs">
              <Users className="h-3.5 w-3.5" />
              <span>Parent Guide</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Discuss with Parents & Family</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Share our Parent Discussion Guide to walk through stream choices, financial considerations, and avoiding unnecessary entrance pressure.
            </p>
          </div>
          <div className="pt-4">
            <Link href="/parents">
              <Button variant="outline" className="text-xs font-semibold gap-2 border-slate-300">
                Open Parent Guide <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Guidance Notice */}
      <Card className="border-amber-200 bg-amber-50/60">
        <CardContent className="p-4 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">Transparent Decision-Support Notice:</span>
            <p>
              SmartCareer recommendations are based on your self-reported assessment inputs and Class 10th academic preferences. These guidance results are designed to facilitate informed discussions with parents, school teachers, and certified career counsellors.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
