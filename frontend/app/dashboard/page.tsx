'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ActionPlanWidget } from '@/components/dashboard/action-plan'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, ArrowRight, BookOpen, Compass, RotateCcw } from 'lucide-react'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<any>(null)
  const [savedCareers, setSavedCareers] = useState<any[]>([])
  const [latestResult, setLatestResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profRes, savedRes, resRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/saved'),
          fetch('/api/results'),
        ])

        if (profRes.ok) setProfile(await profRes.json())
        if (savedRes.ok) setSavedCareers(await savedRes.json())
        if (resRes.ok) setLatestResult(await resRes.json())
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 max-w-6xl">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Badge className="bg-blue-600 text-white mb-1">Student Dashboard</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Welcome back, {session?.user?.name || profile?.studentName || 'Student'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Track your stream recommendations, saved careers, and post-10th milestone tasks.
          </p>
        </div>

        <Link href="/assessment">
          <Button className="bg-white text-blue-900 hover:bg-slate-100 font-semibold gap-1.5 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            {latestResult ? 'Retake Assessment' : 'Take Assessment'}
          </Button>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Assessment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${latestResult ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-lg font-bold text-slate-900">
                {latestResult ? 'Completed' : 'Not Started'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {latestResult ? 'Guidance report available' : 'Take 10-min test for results'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Saved Careers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <span className="text-2xl font-extrabold text-blue-600">{savedCareers.length}</span>
            <p className="text-xs text-slate-500">Careers bookmarked for review</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Student Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <span className="text-base font-bold text-slate-900">
              {profile?.board || '10th Standard'} · {profile?.state || 'India'}
            </span>
            <p className="text-xs text-slate-500">Targeting admissions after 10th</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Results & Saved */}
        <div className="lg:col-span-2 space-y-8">
          {latestResult && (
            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Top Match Summary</CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Based on latest assessment</p>
                </div>
                <Link href="/results">
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    View Full Results <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-700">
                <p className="leading-relaxed bg-slate-50 p-3 rounded-lg border">{latestResult.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Saved Careers List */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Bookmarked Careers</CardTitle>
            </CardHeader>
            <CardContent>
              {savedCareers.length > 0 ? (
                <div className="space-y-3">
                  {savedCareers.map((saved) => (
                    <div key={saved.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900">{saved.career.name}</h4>
                        <span className="text-slate-500">{saved.career.category?.name}</span>
                      </div>
                      <Link href={`/careers/${saved.career.slug}`}>
                        <Button size="sm" variant="ghost" className="text-xs">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-500 space-y-2">
                  <p>You haven't saved any careers yet.</p>
                  <Link href="/careers">
                    <Button variant="outline" size="sm" className="text-xs">
                      Browse Career Directory
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Action Plan Widget */}
        <div>
          <ActionPlanWidget />
        </div>
      </div>
    </div>
  )
}
