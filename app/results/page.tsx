'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import {
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Compass,
  MessageSquare,
  Users,
  Calendar,
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600" />
        <p className="text-sm text-slate-500">Loading your results...</p>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <Compass className="h-10 w-10 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">No results yet</h2>
        <p className="text-slate-500 text-sm mb-6">
          Take the 30-question assessment to get your stream recommendation and a personalized career roadmap.
        </p>
        <Link href="/assessment">
          <button className="btn-primary">
            Start Assessment
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    )
  }

  const {
    categoryScores = [],
    topPathways = [],
    recommendedCareers = [],
    summary,
    roadmap = {},
  } = results

  const primaryPathway = topPathways[0]

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl space-y-8">

        {/* Page Header */}
        <div className="card-surface rounded-xl p-6 sm:p-7 bg-white space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Assessment Results</p>
              <h1 className="text-display text-2xl sm:text-3xl text-slate-900">Your Stream Recommendation</h1>
              {summary && (
                <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">{summary}</p>
              )}
            </div>
            <Link href="/assessment">
              <button className="btn-secondary text-xs px-4 py-2 shrink-0">
                <RotateCcw className="h-3.5 w-3.5" />
                Retake
              </button>
            </Link>
          </div>

          {primaryPathway && (
            <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg">
                <span className="text-xs text-slate-500">Top match</span>
                <span className="font-bold text-slate-900 text-sm">{primaryPathway.pathwayName}</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg">
                <span className="text-xs text-slate-500">Fit score</span>
                <span className="font-bold text-emerald-700 text-sm">{primaryPathway.matchScore}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Recommended Pathways */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recommended streams</h2>
            <p className="text-xs text-slate-500 mt-0.5">Ranked by interest, aptitude, marks, and preferences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {topPathways.slice(0, 4).map((pathway: any, idx: number) => (
              <div key={idx} className="card-surface rounded-xl bg-white overflow-hidden flex flex-col">
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="badge-blue text-[11px] font-bold">{pathway.matchScore}% fit</span>
                    <span className="badge-slate text-[11px]">{pathway.difficulty}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{pathway.pathwayName}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2 bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <strong className="text-slate-700">Why this fits: </strong>{pathway.explanation}
                    </p>
                  </div>

                  {pathway.strengths && pathway.strengths.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide mb-1.5">Your strengths</p>
                      <ul className="space-y-1">
                        {pathway.strengths.map((st: string, sIdx: number) => (
                          <li key={sIdx} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {pathway.thingsToImprove && pathway.thingsToImprove.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mb-1.5">Areas to work on</p>
                      <ul className="space-y-1">
                        {pathway.thingsToImprove.map((imp: string, iIdx: number) => (
                          <li key={iIdx} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {pathway.entranceExams && pathway.entranceExams.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Key exams</p>
                      <div className="flex flex-wrap gap-1.5">
                        {pathway.entranceExams.map((exam: string, eIdx: number) => (
                          <span key={eIdx} className="badge-slate text-[11px] px-2 py-0.5">{exam}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 p-4 flex items-center justify-between bg-slate-50">
                  <span className="text-[11px] text-slate-400">{pathway.duration}</span>
                  <Link href={`/pathways/${pathway.pathwaySlug}`}>
                    <button className="btn-primary text-xs px-4 py-1.5">
                      Explore pathway
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Matching Careers */}
        {recommendedCareers.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Matching careers</h2>
              <p className="text-xs text-slate-500 mt-0.5">Based on your recommended streams and interests.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedCareers.slice(0, 6).map((career: any, idx: number) => (
                <div key={idx} className="card-surface rounded-xl bg-white overflow-hidden flex flex-col">
                  <div className="p-4 flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="badge-blue text-[11px]">{career.matchScore}% match</span>
                      <span className="text-[11px] font-semibold text-emerald-700">{career.salaryRange}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{career.careerName}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{career.explanation}</p>
                  </div>
                  <div className="border-t border-slate-100 p-3">
                    <Link href={`/careers/${career.careerSlug}`}>
                      <button className="w-full btn-secondary text-xs py-1.5 justify-between">
                        <span>View career</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interest Breakdown */}
        {categoryScores.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your interests by domain</h2>
              <p className="text-xs text-slate-500 mt-0.5">Domain match scores out of 100.</p>
            </div>
            <div className="card-surface rounded-xl bg-white p-5 sm:p-6 space-y-4">
              {categoryScores.slice(0, 6).map((item: any, idx: number) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="font-bold text-blue-600">{item.score}/100</span>
                  </div>
                  <Progress value={item.score} className="h-1.5 bg-slate-100" />
                  {item.description && (
                    <p className="text-xs text-slate-400">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Roadmap */}
        {roadmap && (roadmap.thirtyDays || roadmap.threeMonths) && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your action plan</h2>
              <p className="text-xs text-slate-500 mt-0.5">Steps to get stream-ready over the next 6 months.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="card-surface rounded-xl bg-white overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Next 30 days</p>
                    <p className="text-xs text-slate-400">Start exploring</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {roadmap.thirtyDays?.map((item: any, i: number) => (
                    <div key={i} className="space-y-0.5">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">{item.tag}</span>
                      <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-surface rounded-xl bg-white overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Next 3 months</p>
                    <p className="text-xs text-slate-400">Build your foundation</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {roadmap.threeMonths?.map((item: any, i: number) => (
                    <div key={i} className="space-y-0.5">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">{item.tag}</span>
                      <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-surface rounded-xl bg-white overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Next 6 months</p>
                    <p className="text-xs text-slate-400">College shortlist and exam prep</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {roadmap.sixMonths?.map((item: any, i: number) => (
                    <div key={i} className="space-y-0.5">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">{item.tag}</span>
                      <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card-surface rounded-xl p-5 bg-white space-y-3 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-bold text-slate-900">Have questions about these results?</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ask the AI Counselor about subject choices, entrance exams, or career tradeoffs tailored to your profile.
            </p>
            <Link href="/counselor">
              <button className="btn-primary text-xs px-4 py-2">
                Chat with AI Counselor
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>

          <div className="card-surface rounded-xl p-5 bg-white space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-600" />
              <p className="text-sm font-bold text-slate-900">Discuss with parents</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our Parent Guide walks through stream choices, fee planning, and how to avoid exam burnout together.
            </p>
            <Link href="/parents">
              <button className="btn-secondary text-xs px-4 py-2">
                Open Parent Guide
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="notice-amber">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold">Heads up: </strong>
            These results are based on your self-reported answers. Use them to start conversations with your parents, teachers, and career counselors, not as final decisions.
          </p>
        </div>

      </div>
    </div>
  )
}
