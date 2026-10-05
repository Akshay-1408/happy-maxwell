'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { GsapReveal } from '@/components/animations/gsap-reveal'
import { Spotlight } from '@/components/animations/spotlight'
import {
  GraduationCap,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Building2,
  Compass,
  Calendar,
  CheckSquare,
  Square,
  Plus,
  MessageSquare,
  User,
  ShieldCheck,
  TrendingUp,
  Target,
  FileText,
  Clock,
  Layers,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useUser()
  const [profile, setProfile] = useState<any>(null)
  const [savedCareers, setSavedCareers] = useState<any[]>([])
  const [savedColleges, setSavedColleges] = useState<any[]>([])
  const [latestResult, setLatestResult] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profRes, savedCarRes, savedColRes, resRes, goalsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/saved'),
          fetch('/api/colleges/save'),
          fetch('/api/results'),
          fetch('/api/goals'),
        ])

        if (profRes.ok) setProfile(await profRes.json())
        if (savedCarRes.ok) setSavedCareers(await savedCarRes.json())
        if (savedColRes.ok) setSavedColleges(await savedColRes.json())
        if (resRes.ok) setLatestResult(await resRes.json())
        if (goalsRes.ok) setGoals(await goalsRes.json())
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  const toggleGoal = async (goalId: string, currentCompleted: boolean) => {
    const updatedStatus = !currentCompleted
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, completed: updatedStatus } : g))
    )

    try {
      await fetch('/api/goals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId, completed: updatedStatus }),
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoalTitle.trim()) return

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newGoalTitle.trim(),
          timeframe: '30_DAYS',
          category: 'ACADEMIC',
        }),
      })
      if (res.ok) {
        const created = await res.json()
        setGoals((prev) => [...prev, created])
        setNewGoalTitle('')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const completionPercentage =
    profile?.completionPercentage ?? (profile?.studentName ? 80 : 30)

  const displayName =
    user?.fullName ||
    user?.firstName ||
    profile?.studentName ||
    'Student'

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden bg-[#090a0f]">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-10 w-[450px] h-[350px] bg-violet-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 sm:px-6 pt-8 space-y-8 max-w-6xl relative z-10">
        {/* Welcome Banner */}
        <GsapReveal animation="fade-up" duration={0.7}>
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#121629] via-[#0f121e] to-[#141026] p-6 sm:p-8 shadow-2xl shadow-black/50">
            <Spotlight fill="rgba(99, 102, 241, 0.18)" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Personalized Student Command Center</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome back,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">
                    {displayName}
                  </span>
                  !
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Track your personalized 10th standard stream recommendation, bookmarked colleges, and milestones.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link href="/onboarding">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.05] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                    <User className="h-3.5 w-3.5 text-indigo-400" />
                    Edit Profile
                  </button>
                </Link>
                <Link href="/assessment">
                  <button className="btn-gradient flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg">
                    <RotateCcw className="h-3.5 w-3.5" />
                    {latestResult ? 'Retake Assessment' : 'Start Assessment'}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </GsapReveal>

        {/* Quick Stats Grid */}
        <GsapReveal animation="fade-up" delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Profile Completion */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Profile Completion</span>
                <Target className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-extrabold text-white">{completionPercentage}%</span>
                <span className="text-[11px] font-medium text-slate-400">
                  {completionPercentage === 100 ? 'Complete' : 'Needs details'}
                </span>
              </div>
              <Progress value={completionPercentage} className="h-1.5 bg-slate-800" />
            </div>

            {/* Assessment Status */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Assessment Status</span>
                <Sparkles className="h-4 w-4 text-violet-400" />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${latestResult ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]' : 'bg-amber-400'
                    }`}
                />
                <span className="text-base font-bold text-white">
                  {latestResult ? 'Test Completed' : 'Not Started'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {latestResult
                  ? `${latestResult.topPathways?.[0]?.pathwayName || 'Stream Recommended'}`
                  : 'Take 30-min test for fit'}
              </p>
            </div>

            {/* Bookmarked Careers */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Saved Careers</span>
                <Bookmark className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-extrabold text-white">{savedCareers.length}</div>
              <p className="text-[11px] text-slate-400">Bookmarked professions</p>
            </div>

            {/* Bookmarked Colleges */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Saved Colleges</span>
                <Building2 className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-extrabold text-white">{savedColleges.length}</div>
              <p className="text-[11px] text-slate-400">Shortlisted institutions</p>
            </div>
          </div>
        </GsapReveal>

        {/* Main Grid: Content & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Results & Saved Items (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Latest Recommendation Summary */}
            <GsapReveal animation="fade-up" delay={0.2}>
              {latestResult ? (
                <div className="glass-card rounded-2xl p-6 space-y-4 border border-indigo-500/25 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-indigo-400 font-bold text-xs mb-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Top AI Match</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {latestResult.topPathways?.[0]?.pathwayName || 'Recommended Stream Pathway'}
                      </h3>
                    </div>
                    <Link href="/results">
                      <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all">
                        Full Guidance Report <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-[#0a0d16] p-4 rounded-xl border border-white/[0.06]">
                    {latestResult.summary}
                  </p>

                  {latestResult.topPathways?.[0]?.careers && (
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-xs font-semibold text-slate-400">Matching Roles:</span>
                      {latestResult.topPathways[0].careers.slice(0, 4).map((car: string, cIdx: number) => (
                        <span
                          key={cIdx}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20"
                        >
                          {car}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-6 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base">You haven't taken the assessment yet</h3>
                    <p className="text-xs text-slate-400">
                      Answer 30 questions on interest and aptitude to unlock your personalized stream fit.
                    </p>
                  </div>
                  <Link href="/assessment">
                    <button className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0">
                      Take Assessment
                    </button>
                  </Link>
                </div>
              )}
            </GsapReveal>

            {/* Bookmarked Careers */}
            <GsapReveal animation="fade-up" delay={0.25}>
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-base font-bold text-white">Bookmarked Careers</h3>
                  </div>
                  <Link href="/careers" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                    Explore All Careers →
                  </Link>
                </div>

                {savedCareers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedCareers.map((saved) => (
                      <div
                        key={saved.id}
                        className="p-3.5 bg-[#0b0e18] rounded-xl border border-white/[0.06] flex items-center justify-between text-xs hover:border-indigo-500/30 transition-all"
                      >
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-white">{saved.career?.name}</h4>
                          <span className="text-[11px] text-slate-400">{saved.career?.category?.name}</span>
                        </div>
                        <Link href={`/careers/${saved.career?.slug}`}>
                          <button className="px-2.5 py-1 rounded-md text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-500/20 transition-colors">
                            View
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400 space-y-2 bg-[#0b0e18] rounded-xl border border-dashed border-white/10">
                    <p>No careers bookmarked yet.</p>
                    <Link href="/careers">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-white/[0.05] border border-white/10 hover:bg-white/10">
                        Browse Career Directory
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </GsapReveal>

            {/* Bookmarked Colleges */}
            <GsapReveal animation="fade-up" delay={0.3}>
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">Shortlisted Colleges</h3>
                  </div>
                  <Link href="/colleges" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                    Explore Colleges →
                  </Link>
                </div>

                {savedColleges.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedColleges.map((saved) => (
                      <div
                        key={saved.id}
                        className="p-3.5 bg-[#0b0e18] rounded-xl border border-white/[0.06] flex items-center justify-between text-xs hover:border-cyan-500/30 transition-all"
                      >
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-white">{saved.college?.name}</h4>
                          <span className="text-[11px] text-slate-400">
                            {saved.college?.city}, {saved.college?.state}
                          </span>
                        </div>
                        <Link href={`/colleges/${saved.college?.id}`}>
                          <button className="px-2.5 py-1 rounded-md text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-colors">
                            View
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400 space-y-2 bg-[#0b0e18] rounded-xl border border-dashed border-white/10">
                    <p>No colleges shortlisted yet.</p>
                    <Link href="/colleges">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-white/[0.05] border border-white/10 hover:bg-white/10">
                        Browse College Explorer
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </GsapReveal>
          </div>

          {/* Right Column: Goal Tracker & Next Steps */}
          <div className="space-y-6">
            {/* Action Milestones Tracker */}
            <GsapReveal animation="fade-up" delay={0.2}>
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-base font-bold text-white">My Milestones</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {goals.filter((g) => g.completed).length}/{goals.length} done
                  </span>
                </div>

                <div className="space-y-2">
                  {goals.length > 0 ? (
                    goals.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => toggleGoal(g.id, g.completed)}
                        className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 cursor-pointer transition select-none ${g.completed
                            ? 'bg-slate-900/50 border-white/[0.04] text-slate-500 line-through'
                            : 'bg-[#0b0e18] border-white/[0.08] text-slate-200 hover:border-indigo-500/40'
                          }`}
                      >
                        {g.completed ? (
                          <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                        <span className="font-medium leading-relaxed">{g.title}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-500">
                      No personal milestones added yet.
                    </div>
                  )}
                </div>

                {/* Add Custom Goal Form */}
                <form onSubmit={handleAddGoal} className="flex gap-2 pt-1">
                  <Input
                    placeholder="Add a milestone..."
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="h-9 text-xs bg-[#0b0e18] border-white/10 text-white placeholder-slate-500"
                  />
                  <Button type="submit" size="sm" className="h-9 text-xs btn-gradient px-3 shrink-0">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </div>
            </GsapReveal>

            {/* Quick Guidance Card */}
            <GsapReveal animation="fade-up" delay={0.25}>
              <div className="glass-card rounded-2xl p-5 space-y-2.5 border border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 to-[#0e111a]">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                  <MessageSquare className="h-4 w-4 text-indigo-400" />
                  <span>AI Counseling Chat</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Confused between streams or careers? Get instant objective advice tailored to your 10th marks.
                </p>
                <Link href="/counselor" className="block pt-2">
                  <button className="w-full py-2.5 rounded-xl text-xs font-bold text-white btn-gradient">
                    Chat with AI Counselor →
                  </button>
                </Link>
              </div>
            </GsapReveal>

            {/* Parent Guide Card */}
            <GsapReveal animation="fade-up" delay={0.3}>
              <div className="glass-card rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Parent Discussion Guide</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Key questions to discuss with parents, fee planning, and avoiding entrance exam burnout.
                </p>
                <Link href="/parents" className="block pt-2">
                  <button className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/[0.05] border border-white/10 hover:bg-white/10 hover:text-white transition-all">
                    Open Parent Guide →
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

