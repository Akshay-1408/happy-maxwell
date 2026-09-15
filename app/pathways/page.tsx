'use client'

import { useState, useEffect } from 'react'
import { PathwayCard } from '@/components/career/pathway-card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen } from 'lucide-react'

export default function PathwaysPage() {
  const [pathways, setPathways] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStream, setSelectedStream] = useState('ALL')

  const streams = [
    { id: 'ALL', name: 'All Streams' },
    { id: 'SCIENCE_PCM', name: 'Science PCM' },
    { id: 'SCIENCE_PCB', name: 'Science PCB' },
    { id: 'COMMERCE_WITH_MATH', name: 'Commerce' },
    { id: 'ARTS_HUMANITIES', name: 'Arts & Humanities' },
    { id: 'DIPLOMA_ENGINEERING', name: 'Diploma' },
    { id: 'VOCATIONAL_ITI', name: 'Vocational / ITI' },
  ]

  useEffect(() => {
    async function loadPathways() {
      setLoading(true)
      try {
        const query = selectedStream !== 'ALL' ? `?stream=${selectedStream}` : ''
        const res = await fetch(`/api/pathways${query}`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setPathways(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadPathways()
  }, [selectedStream])

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 max-w-6xl">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Stream Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Education Pathways After 10th</h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Every stream after 10th standard opens distinct higher education and career opportunities.
        </p>
      </div>

      <div className="overflow-x-auto pb-2 max-w-4xl mx-auto">
        <Tabs value={selectedStream} onValueChange={setSelectedStream} className="w-full">
          <TabsList className="bg-slate-100 p-1">
            {streams.map((s) => (
              <TabsTrigger key={s.id} value={s.id} className="text-xs">
                {s.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pathways.map((pathway) => (
            <PathwayCard key={pathway.id} pathway={pathway} />
          ))}
        </div>
      )}
    </div>
  )
}
