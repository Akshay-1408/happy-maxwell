'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Scale, X, ArrowRight, Building2, Briefcase, ExternalLink, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

function CompareContent() {
  const searchParams = useSearchParams()
  const initialCareer1 = searchParams.get('career1')
  const initialCollege1 = searchParams.get('college1')

  const [compareMode, setCompareMode] = useState<'careers' | 'colleges'>(initialCollege1 ? 'colleges' : 'careers')

  // Careers State
  const [allCareers, setAllCareers] = useState<any[]>([])
  const [selectedCareerSlugs, setSelectedCareerSlugs] = useState<string[]>([])
  const [selectedCareers, setSelectedCareers] = useState<any[]>([])

  // Colleges State
  const [allColleges, setAllColleges] = useState<any[]>([])
  const [selectedCollegeIds, setSelectedCollegeIds] = useState<string[]>([])
  const [selectedColleges, setSelectedColleges] = useState<any[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [carRes, colRes] = await Promise.all([
          fetch('/api/careers'),
          fetch('/api/colleges'),
        ])

        if (carRes.ok) {
          const carData = await carRes.json()
          if (Array.isArray(carData)) {
            setAllCareers(carData)
            if (initialCareer1 && carData.some((c) => c.slug === initialCareer1)) {
              const other = carData.find((c) => c.slug !== initialCareer1)?.slug
              setSelectedCareerSlugs(other ? [initialCareer1, other] : [initialCareer1])
            } else if (carData.length >= 2) {
              setSelectedCareerSlugs([carData[0].slug, carData[1].slug])
            }
          }
        }

        if (colRes.ok) {
          const colData = await colRes.json()
          if (colData.data && Array.isArray(colData.data)) {
            setAllColleges(colData.data)
            if (initialCollege1 && colData.data.some((c: any) => c.id === initialCollege1)) {
              const other = colData.data.find((c: any) => c.id !== initialCollege1)?.id
              setSelectedCollegeIds(other ? [initialCollege1, other] : [initialCollege1])
            } else if (colData.data.length >= 2) {
              setSelectedCollegeIds([colData.data[0].id, colData.data[1].id])
            }
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [initialCareer1, initialCollege1])

  useEffect(() => {
    const list = allCareers.filter((c) => selectedCareerSlugs.includes(c.slug))
    setSelectedCareers(list)
  }, [selectedCareerSlugs, allCareers])

  useEffect(() => {
    const list = allColleges.filter((c) => selectedCollegeIds.includes(c.id))
    setSelectedColleges(list)
  }, [selectedCollegeIds, allColleges])

  const addCareer = (slug: string) => {
    if (slug && !selectedCareerSlugs.includes(slug) && selectedCareerSlugs.length < 3) {
      setSelectedCareerSlugs([...selectedCareerSlugs, slug])
    }
  }

  const removeCareer = (slug: string) => {
    setSelectedCareerSlugs(selectedCareerSlugs.filter((s) => s !== slug))
  }

  const addCollege = (id: string) => {
    if (id && !selectedCollegeIds.includes(id) && selectedCollegeIds.length < 3) {
      setSelectedCollegeIds([...selectedCollegeIds, id])
    }
  }

  const removeCollege = (id: string) => {
    setSelectedCollegeIds(selectedCollegeIds.filter((s) => s !== id))
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Scale className="h-3.5 w-3.5" />
          <span>Multi-Option Comparison</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Side-by-Side Matrix</h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Compare up to 3 careers or colleges side-by-side to make confident decisions on education, fees, and timelines.
        </p>

        {/* Mode Switcher */}
        <div className="flex justify-center pt-2">
          <div className="bg-slate-100 p-1 rounded-xl inline-flex gap-1">
            <button
              onClick={() => setCompareMode('careers')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                compareMode === 'careers' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Compare Careers ({selectedCareers.length}/3)
            </button>
            <button
              onClick={() => setCompareMode('colleges')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                compareMode === 'colleges' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Compare Colleges ({selectedColleges.length}/3)
            </button>
          </div>
        </div>
      </div>

      {/* ─── CAREERS COMPARISON ─────────────────────────────────────────────── */}
      {compareMode === 'careers' && (
        <div className="space-y-6">
          {/* Selectors */}
          <div className="flex flex-wrap items-center justify-center gap-4 max-w-xl mx-auto">
            <Select onValueChange={addCareer}>
              <SelectTrigger className="w-[280px] bg-white h-10 text-xs">
                <SelectValue placeholder="Add another career to compare..." />
              </SelectTrigger>
              <SelectContent>
                {allCareers.map((c) => (
                  <SelectItem key={c.id} value={c.slug} disabled={selectedCareerSlugs.includes(c.slug)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-slate-400 font-medium">({selectedCareers.length}/3 selected)</span>
          </div>

          {selectedCareers.length > 0 ? (
            <Card className="border-slate-200 overflow-hidden shadow-sm bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="p-4 w-1/5 text-xs font-bold text-slate-700">Evaluation Metric</th>
                      {selectedCareers.map((c) => (
                        <th key={c.id} className="p-4 text-slate-900 font-bold text-sm min-w-[240px]">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-base font-extrabold">{c.name}</span>
                            <button
                              onClick={() => removeCareer(c.slug)}
                              className="text-slate-400 hover:text-red-500 transition"
                              title="Remove from comparison"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700">
                            {c.category?.name || 'Career'}
                          </Badge>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">Estimated CTC / Salary</td>
                      {selectedCareers.map((c) => (
                        <td key={c.id} className="p-4 font-extrabold text-blue-600 text-sm">
                          {c.salaryRangeLabel || '₹4.5 - 18.0 LPA'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">Recommended Streams</td>
                      {selectedCareers.map((c) => (
                        <td key={c.id} className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(c.relevantStreams) ? c.relevantStreams : []).map((s: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-[10px]">
                                {s.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">Time to Qualify</td>
                      {selectedCareers.map((c) => (
                        <td key={c.id} className="p-4 font-medium">{c.durationToQualify || '3–5 Years after 12th'}</td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">Entrance Examinations</td>
                      {selectedCareers.map((c) => (
                        <td key={c.id} className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(c.entranceExams) ? c.entranceExams : []).map((ex: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-[10px] bg-slate-100 text-slate-800">{ex}</Badge>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">Work Environment</td>
                      {selectedCareers.map((c) => (
                        <td key={c.id} className="p-4">{c.workEnvironment || 'Office / Tech environment'}</td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">Key Skills</td>
                      {selectedCareers.map((c) => (
                        <td key={c.id} className="p-4">
                          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                            {(Array.isArray(c.skills) ? c.skills : []).slice(0, 4).map((sk: string, i: number) => (
                              <li key={i}>{sk}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">Major Advantages</td>
                      {selectedCareers.map((c) => (
                        <td key={c.id} className="p-4 text-emerald-800">
                          <ul className="space-y-1 text-[11px]">
                            {(Array.isArray(c.pros) ? c.pros : []).slice(0, 2).map((p: string, i: number) => (
                              <li key={i} className="flex items-start gap-1">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">Actions</td>
                      {selectedCareers.map((c) => (
                        <td key={c.id} className="p-4">
                          <Link href={`/careers/${c.slug}`}>
                            <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-1">
                              View Full Guide <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed text-slate-500 text-xs">
              Select at least 1 career from the dropdown above to start comparing.
            </div>
          )}
        </div>
      )}

      {/* ─── COLLEGES COMPARISON ────────────────────────────────────────────── */}
      {compareMode === 'colleges' && (
        <div className="space-y-6">
          {/* Selectors */}
          <div className="flex flex-wrap items-center justify-center gap-4 max-w-xl mx-auto">
            <Select onValueChange={addCollege}>
              <SelectTrigger className="w-[280px] bg-white h-10 text-xs">
                <SelectValue placeholder="Add another college to compare..." />
              </SelectTrigger>
              <SelectContent>
                {allColleges.map((col) => (
                  <SelectItem key={col.id} value={col.id} disabled={selectedCollegeIds.includes(col.id)}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-slate-400 font-medium">({selectedColleges.length}/3 selected)</span>
          </div>

          {selectedColleges.length > 0 ? (
            <Card className="border-slate-200 overflow-hidden shadow-sm bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="p-4 w-1/5 text-xs font-bold text-slate-700">Institution Metric</th>
                      {selectedColleges.map((col) => (
                        <th key={col.id} className="p-4 text-slate-900 font-bold text-sm min-w-[240px]">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-base font-extrabold">{col.name}</span>
                            <button
                              onClick={() => removeCollege(col.id)}
                              className="text-slate-400 hover:text-red-500 transition"
                              title="Remove from comparison"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700">
                            {col.type} · {col.city}, {col.state}
                          </Badge>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">Annual Tuition / Fees</td>
                      {selectedColleges.map((col) => (
                        <td key={col.id} className="p-4 font-extrabold text-blue-600 text-sm">
                          {col.feesRange || 'Subsidized'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">NIRF Ranking</td>
                      {selectedColleges.map((col) => (
                        <td key={col.id} className="p-4">
                          {col.ranking ? (
                            <Badge variant="outline" className="text-amber-800 bg-amber-50 border-amber-300 font-bold">
                              National Rank #{col.ranking}
                            </Badge>
                          ) : (
                            <span className="text-slate-500">Accredited</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">Courses Offered</td>
                      {selectedColleges.map((col) => (
                        <td key={col.id} className="p-4">
                          <div className="space-y-1">
                            {col.courses?.map((c: any) => (
                              <div key={c.id} className="p-1.5 bg-slate-50 rounded border text-[11px]">
                                <span className="font-semibold block text-slate-800">{c.name}</span>
                                <span className="text-slate-500">{c.duration}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">Required Entrance Exams</td>
                      {selectedColleges.map((col) => (
                        <td key={col.id} className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(col.entranceExams) ? col.entranceExams : []).map((ex: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-[10px] bg-blue-50 text-blue-800">{ex}</Badge>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">Student Suitability</td>
                      {selectedColleges.map((col) => (
                        <td key={col.id} className="p-4 text-xs text-slate-600 leading-relaxed">
                          {col.studentSuitability || 'Suitable for students targeting high-quality accredited education.'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/60">Actions</td>
                      {selectedColleges.map((col) => (
                        <td key={col.id} className="p-4">
                          <Link href={`/colleges/${col.id}`}>
                            <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-1">
                              View College Details <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed text-slate-500 text-xs">
              Select at least 1 college from the dropdown above to start comparing.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading comparison tool...
      </div>
    }>
      <CompareContent />
    </Suspense>
  )
}

