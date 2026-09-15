'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Scale, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ComparePage() {
  const [allCareers, setAllCareers] = useState<any[]>([])
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([])
  const [selectedCareers, setSelectedCareers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCareers() {
      try {
        const res = await fetch('/api/careers')
        const data = await res.json()
        if (Array.isArray(data)) {
          setAllCareers(data)
          // Default select first two for preview
          if (data.length >= 2) {
            setSelectedSlugs([data[0].slug, data[1].slug])
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadCareers()
  }, [])

  useEffect(() => {
    const list = allCareers.filter((c) => selectedSlugs.includes(c.slug))
    setSelectedCareers(list)
  }, [selectedSlugs, allCareers])

  const addCareer = (slug: string) => {
    if (slug && !selectedSlugs.includes(slug) && selectedSlugs.length < 3) {
      setSelectedSlugs([...selectedSlugs, slug])
    }
  }

  const removeCareer = (slug: string) => {
    setSelectedSlugs(selectedSlugs.filter((s) => s !== slug))
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 max-w-6xl">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Scale className="h-3.5 w-3.5" />
          <span>Side-by-Side Comparison</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Compare Careers</h1>
        <p className="text-slate-600 text-sm">
          Select up to 3 careers to compare required streams, duration, skills, and work environments side-by-side.
        </p>
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap items-center justify-center gap-4 max-w-xl mx-auto">
        <Select onValueChange={addCareer}>
          <SelectTrigger className="w-[260px] bg-white">
            <SelectValue placeholder="Add career to compare..." />
          </SelectTrigger>
          <SelectContent>
            {allCareers.map((c) => (
              <SelectItem key={c.id} value={c.slug} disabled={selectedSlugs.includes(c.slug)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-slate-400">({selectedCareers.length}/3 selected)</span>
      </div>

      {/* Comparison Table */}
      {selectedCareers.length > 0 ? (
        <Card className="border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="p-4 w-1/4 text-xs font-bold text-slate-700">Feature</th>
                  {selectedCareers.map((c) => (
                    <th key={c.id} className="p-4 text-slate-900 font-bold text-base min-w-[220px]">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span>{c.name}</span>
                        <button
                          onClick={() => removeCareer(c.slug)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {c.category?.name || 'Career'}
                      </Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y text-xs text-slate-700">
                <tr>
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Relevant Streams</td>
                  {selectedCareers.map((c) => (
                    <td key={c.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {c.relevantStreams.map((s: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-[10px]">
                            {s.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Duration to Qualify</td>
                  {selectedCareers.map((c) => (
                    <td key={c.id} className="p-4">{c.durationToQualify || '3–5 Years'}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Work Environment</td>
                  {selectedCareers.map((c) => (
                    <td key={c.id} className="p-4">{c.workEnvironment || 'Office / Tech environment'}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Key Skills Needed</td>
                  {selectedCareers.map((c) => (
                    <td key={c.id} className="p-4">
                      <ul className="list-disc list-inside space-y-0.5">
                        {c.skills.slice(0, 4).map((sk: string, i: number) => (
                          <li key={i}>{sk}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">Action</td>
                  {selectedCareers.map((c) => (
                    <td key={c.id} className="p-4">
                      <Link href={`/careers/${c.slug}`}>
                        <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                          View Details <ArrowRight className="h-3 w-3" />
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
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed text-slate-500 text-sm">
          Select at least 1 career from the dropdown above to start comparing.
        </div>
      )}
    </div>
  )
}
