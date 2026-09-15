'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2, ShieldAlert, Award, Compass } from 'lucide-react'

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadResult() {
      try {
        // Try fetching from database first (for logged-in user)
        const res = await fetch('/api/results')
        if (res.ok) {
          const data = await res.json()
          setResults(data)
          setLoading(false)
          return
        }

        // Fallback to session storage (for guest user)
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
        <p className="text-sm text-slate-600 font-medium">Generating your career interest profile...</p>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <Compass className="h-12 w-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Assessment Results Found</h2>
        <p className="text-slate-600 text-sm mb-6">
          Take the career assessment to generate your personalized stream recommendations.
        </p>
        <Link href="/assessment">
          <Button className="bg-blue-600 hover:bg-blue-700 font-semibold">
            Start Career Assessment
          </Button>
        </Link>
      </div>
    )
  }

  const { categoryScores = [], topPathways = [], recommendedCareers = [], summary, skillsToDevlop = [], nextActions = [] } = results

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-8 rounded-2xl shadow-md space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-800/80 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="h-4 w-4" />
          <span>Assessment Completed</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your Career Guidance Profile</h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">{summary}</p>
        <div className="pt-2">
          <Link href="/assessment">
            <Button variant="outline" size="sm" className="text-slate-900 bg-white hover:bg-slate-100 gap-1.5 text-xs font-medium">
              <RotateCcw className="h-3.5 w-3.5" />
              Retake Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Interest Scores */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">1. Interest Area Breakdown</h2>
          <span className="text-xs text-slate-500 font-medium">Based on 0–100 match score</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryScores.slice(0, 6).map((item: any, idx: number) => (
            <Card key={idx} className="border-slate-200">
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

      {/* Top Recommended Pathways */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">2. Recommended Education Pathways After 10th</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topPathways.map((pathway: any, idx: number) => (
            <Card key={idx} className="border-slate-200 flex flex-col justify-between hover:shadow-md transition">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Badge className="bg-blue-600 text-white font-semibold text-xs">
                    {pathway.matchScore}% Match Fit
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {pathway.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">{pathway.pathwayName}</CardTitle>
                <CardDescription className="text-xs leading-relaxed mt-2 text-slate-600">
                  {pathway.explanation}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Relevant Subjects:</span>
                  <div className="flex flex-wrap gap-1">
                    {pathway.relevantSubjects.map((sub: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-[11px]">{sub}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Key Careers:</span>
                  <p className="text-slate-600">{pathway.careers.join(', ')}</p>
                </div>
              </CardContent>
              <div className="p-4 border-t bg-slate-50/50 rounded-b-xl flex justify-end">
                <Link href={`/pathways/${pathway.pathwaySlug}`}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs gap-1">
                    Explore Pathway Guide <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Careers to Explore */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">3. Careers to Explore</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedCareers.map((career: any, idx: number) => (
            <Card key={idx} className="border-slate-200 flex flex-col justify-between">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-bold text-slate-900">{career.careerName}</CardTitle>
                <CardDescription className="text-xs text-slate-600 line-clamp-3 mt-1">
                  {career.explanation}
                </CardDescription>
              </CardHeader>
              <div className="p-4 pt-2">
                <Link href={`/careers/${career.careerSlug}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                    View Career Details <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Next Actions & Disclaimer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Suggested Next Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-slate-700">
            {nextActions.map((action: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{action}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-base font-bold text-amber-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              Important Guidance Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-amber-800 leading-relaxed space-y-2">
            <p>
              SmartCareer recommendations are based on your self-reported assessment inputs and academic preferences.
            </p>
            <p>
              These results serve as guidance to encourage informed exploration and discussion with parents, teachers, and school career counsellors.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
