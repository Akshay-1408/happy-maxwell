'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GsapReveal } from '@/components/animations/gsap-reveal'
import {
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Building2,
  CheckSquare,
  Square,
  Plus,
  MessageSquare,
  User,
  ShieldCheck,
  Target,
  Clock,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useUser()
  const [profile, setProfile]             = useState<any>(null)
  const [savedCareers, setSavedCareers]   = useState<any[]>([])
  const [savedColleges, setSavedColleges] = useState<any[]>([])
  const [latestResult, setLatestResult]   = useState<any>(null)
  const [goals, setGoals]                 = useState<any[]>([])
  const [newGoalTitle, setNewGoalTitle]   = useState('')
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [profRes, savedCarRes, savedColRes, resRes, goalsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/saved'),
          fetch('/api/colleges/save'),
          fetch('/api/results'),
          fetch('/api/goals'),
        ])
        if (profRes.ok)       setProfile(await profRes.json())
        if (savedCarRes.ok)   setSavedCareers(await savedCarRes.json())
        if (savedColRes.ok)   setSavedColleges(await savedColRes.json())
        if (resRes.ok)        setLatestResult(await resRes.json())
        if (goalsRes.ok)      setGoals(await goalsRes.json())
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const toggleGoal = async (goalId: string, currentCompleted: boolean) => {
    const updated = !currentCompleted
    setGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, completed: updated } : g)))
    try {
      await fetch('/api/goals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId, completed: updated }),
      })
    } catch (e) { console.error(e) }
  }

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoalTitle.trim()) return
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newGoalTitle.trim(), timeframe: '30_DAYS', category: 'ACADEMIC' }),
      })
      if (res.ok) {
        setGoals((prev) => [...prev, await res.json()])
        setNewGoalTitle('')
      }
    } catch (e) { console.error(e) }
  }

  const completionPercentage = profile?.completionPercentage ?? (profile?.studentName ? 80 : 30)
  const displayName = user?.fullName || user?.firstName || profile?.studentName || 'Student'

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl space-y-6">

        {/* ── Welcome Bar ── */}
        <GsapReveal animation="fade-up" duration={0.5}>
          <div className="card-surface rounded-xl p-5 sm:p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-0.5">Dashboard</p>
              <h1 className="text-xl font-bold text-slate-900">
                Welcome back, {displayName}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Track your stream recommendation, bookmarked colleges, and milestones.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/onboarding">
                <button className="btn-secondary text-xs px-3.5 py-2">
                  <User className="h-3.5 w-3.5" />
                  Edit Profile
                </button>
              </Link>
              <Link href="/assessment">
                <button className="btn-primary text-xs px-3.5 py-2">
                  <RotateCcw className="h-3.5 w-3.5" />
                  {latestResult ? 'Retake Assessment' : 'Start Assessment'}
                </button>
              </Link>
            </div>
          </div>
        </GsapReveal>

        {/* ── Quick Stats ── */}
        <GsapReveal animation="fade-up" delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Profile completion */}
            <div className="card-surface rounded-xl p-5 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Profile</span>
                <Target className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{completionPercentage}%</p>
                <p className="text-xs text-slate-400 mt-0.5">{completionPercentage === 100 ? 'Complete' : 'Incomplete'}</p>
              </div>
              <Progress value={completionPercentage} className="h-1.5 bg-slate-100" />
            </div>

            {/* Assessment */}
            <div className="card-surface rounded-xl p-5 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Assessment</span>
                <Sparkles className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full shrink-0 ${latestResult ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                <p className="text-sm font-semibold text-slate-800">
                  {latestResult ? 'Completed' : 'Not started'}
                </p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {latestResult
                  ? latestResult.topPathways?.[0]?.pathwayName || 'Stream matched'
                  : 'Take the 30-question test'}
              </p>
            </div>

            {/* Saved Careers */}
            <div className="card-surface rounded-xl p-5 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Saved Careers</span>
                <Bookmark className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{savedCareers.length}</p>
              <p className="text-xs text-slate-400">Bookmarked careers</p>
            </div>

            {/* Saved Colleges */}
            <div className="card-surface rounded-xl p-5 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Saved Colleges</span>
                <Building2 className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{savedColleges.length}</p>
              <p className="text-xs text-slate-400">Shortlisted colleges</p>
            </div>
          </div>
        </GsapReveal>

        {/* ── Main Content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left col (2/3) */}
          <div className="lg:col-span-2 space-y-5">

            {/* Recommendation */}
            <GsapReveal animation="fade-up" delay={0.15}>
              {latestResult ? (
                <div className="card-surface rounded-xl p-6 bg-white space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-0.5">Your Top Match</p>
                      <h3 className="font-bold text-slate-900">
                        {latestResult.topPathways?.[0]?.pathwayName || 'Stream Recommendation'}
                      </h3>
                    </div>
                    <Link href="/results">
                      <button className="btn-secondary text-xs py-1.5 px-3">
                        Full Report
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-4 border border-slate-200">
                    {latestResult.summary}
                  </p>

                  {latestResult.topPathways?.[0]?.careers && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-xs font-medium text-slate-500">Matching roles:</span>
                      {latestResult.topPathways[0].careers.slice(0, 4).map((career: string, i: number) => (
                        <span key={i} className="badge-blue text-[11px] px-2 py-0.5">{career}</span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="card-surface rounded-xl p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-amber-400">
                  <div>
                    <h3 className="font-bold text-slate-900">You haven't taken the assessment yet</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Answer 30 questions on interest and aptitude to get your personalized stream recommendation.
                    </p>
                  </div>
                  <Link href="/assessment">
                    <button className="btn-primary text-sm shrink-0">Take Assessment</button>
                  </Link>
                </div>
              )}
            </GsapReveal>

            {/* Saved Careers */}
            <GsapReveal animation="fade-up" delay={0.2}>
              <div className="card-surface rounded-xl p-5 bg-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-blue-500" />
                    <h3 className="font-bold text-slate-900 text-sm">Bookmarked Careers</h3>
                  </div>
                  <Link href="/careers" className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    Browse all →
                  </Link>
                </div>

                {savedCareers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedCareers.map((saved) => (
                      <div key={saved.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors bg-slate-50">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{saved.career?.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{saved.career?.category?.name}</p>
                        </div>
                        <Link href={`/careers/${saved.career?.slug}`}>
                          <button className="btn-ghost text-xs text-blue-600 px-2.5 py-1">View</button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-slate-400 border border-dashed border-slate-200 rounded-lg">
                    No careers bookmarked yet.
                    <br />
                    <Link href="/careers">
                      <button className="btn-secondary text-xs mt-3 px-4 py-1.5">Browse Career Directory</button>
                    </Link>
                  </div>
                )}
              </div>
            </GsapReveal>

            {/* Saved Colleges */}
            <GsapReveal animation="fade-up" delay={0.25}>
              <div className="card-surface rounded-xl p-5 bg-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <h3 className="font-bold text-slate-900 text-sm">Shortlisted Colleges</h3>
                  </div>
                  <Link href="/colleges" className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    Browse all →
                  </Link>
                </div>

                {savedColleges.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedColleges.map((saved) => (
                      <div key={saved.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors bg-slate-50">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{saved.college?.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{saved.college?.city}, {saved.college?.state}</p>
                        </div>
                        <Link href={`/colleges/${saved.college?.id}`}>
                          <button className="btn-ghost text-xs text-blue-600 px-2.5 py-1">View</button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-slate-400 border border-dashed border-slate-200 rounded-lg">
                    No colleges shortlisted yet.
                    <br />
                    <Link href="/colleges">
                      <button className="btn-secondary text-xs mt-3 px-4 py-1.5">Browse Colleges</button>
                    </Link>
                  </div>
                )}
              </div>
            </GsapReveal>
          </div>

          {/* Right col (1/3) */}
          <div className="space-y-5">

            {/* Milestones */}
            <GsapReveal animation="fade-up" delay={0.15}>
              <div className="card-surface rounded-xl p-5 bg-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-blue-500" />
                    <h3 className="font-bold text-slate-900 text-sm">My Milestones</h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    {goals.filter((g) => g.completed).length}/{goals.length} done
                  </span>
                </div>

                <div className="space-y-2">
                  {goals.length > 0 ? (
                    goals.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => toggleGoal(g.id, g.completed)}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer select-none transition-colors text-sm ${
                          g.completed
                            ? 'bg-slate-50 border-slate-100 text-slate-400 line-through'
                            : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200'
                        }`}
                      >
                        {g.completed
                          ? <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          : <Square className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                        }
                        <span className="font-medium leading-relaxed">{g.title}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-xs text-slate-400">No milestones added yet.</p>
                  )}
                </div>

                <form onSubmit={handleAddGoal} className="flex gap-2">
                  <Input
                    placeholder="Add a milestone..."
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="h-8 text-xs bg-slate-50 border-slate-200"
                  />
                  <Button type="submit" size="sm" className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white shrink-0">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </div>
            </GsapReveal>

            {/* AI Counselor CTA */}
            <GsapReveal animation="fade-up" delay={0.2}>
              <div className="card-surface rounded-xl p-5 bg-white space-y-3 border-l-4 border-l-blue-500">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-slate-900 text-sm">AI Counselor</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Confused between streams or careers? Get instant, honest advice based on your 10th marks.
                </p>
                <Link href="/counselor" className="block">
                  <button className="btn-primary w-full justify-center text-xs py-2">
                    Chat with AI Counselor
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </GsapReveal>

            {/* Parent Guide */}
            <GsapReveal animation="fade-up" delay={0.25}>
              <div className="card-surface rounded-xl p-5 bg-white space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-semibold text-slate-900 text-sm">Parent Guide</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Key questions to discuss with parents, fee planning, and avoiding burnout.
                </p>
                <Link href="/parents" className="block">
                  <button className="btn-secondary w-full justify-center text-xs py-2">
                    Read Parent Guide
                  </button>
                </Link>
              </div>
            </GsapReveal>
          </div>
        </div>
      </div>
    </div>
  )
}
