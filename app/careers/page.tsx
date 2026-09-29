'use client'

import { useState, useEffect } from 'react'
import { CareerCard } from '@/components/career/career-card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Compass, Filter } from 'lucide-react'

export default function CareersPage() {
  const [careers, setCareers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStream, setSelectedStream] = useState('ALL')

  const categories = [
    { id: 'all', name: 'All Domains' },
    { id: 'technology', name: 'Technology' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'finance', name: 'Finance' },
    { id: 'business', name: 'Business' },
    { id: 'law', name: 'Law' },
    { id: 'design', name: 'Design' },
    { id: 'government', name: 'Government/Defence' },
    { id: 'science', name: 'Pure Science' },
    { id: 'vocational', name: 'Vocational/Trade' },
  ]

  useEffect(() => {
    async function loadCareers() {
      setLoading(true)
      try {
        const query = new URLSearchParams()
        if (search) query.append('search', search)
        if (selectedCategory && selectedCategory !== 'all') query.append('category', selectedCategory)

        const res = await fetch(`/api/careers?${query.toString()}`)
        const data = await res.json()
        if (Array.isArray(data)) {
          let filtered = data
          if (selectedStream !== 'ALL') {
            filtered = filtered.filter((c: any) => {
              const streams = Array.isArray(c.relevantStreams) ? c.relevantStreams : []
              return streams.includes(selectedStream)
            })
          }
          setCareers(filtered)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadCareers()
  }, [search, selectedCategory, selectedStream])

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Compass className="h-3.5 w-3.5" />
          <span>30+ Indian Career Profiles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Explore Post-10th Careers</h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Discover salaries, education routes, entrance exams, and required skills for top Indian career pathways.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search careers (e.g. Software, Doctor, Pilot, CA, Lawyer)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-white shadow-xs text-xs sm:text-sm"
            />
          </div>

          <Select value={selectedStream} onValueChange={setSelectedStream}>
            <SelectTrigger className="bg-white h-10 text-xs">
              <SelectValue placeholder="Filter by Stream" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Streams</SelectItem>
              <SelectItem value="SCIENCE_PCM">Science (PCM)</SelectItem>
              <SelectItem value="SCIENCE_PCB">Science (PCB)</SelectItem>
              <SelectItem value="COMMERCE_WITH_MATH">Commerce with Math</SelectItem>
              <SelectItem value="COMMERCE_NO_MATH">Commerce (General)</SelectItem>
              <SelectItem value="ARTS_HUMANITIES">Arts & Humanities</SelectItem>
              <SelectItem value="DIPLOMA_ENGINEERING">Polytechnic Diploma</SelectItem>
              <SelectItem value="VOCATIONAL_ITI">Vocational & ITI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Tabs */}
        <div className="overflow-x-auto pb-1">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="bg-slate-100 p-1">
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="text-[11px] sm:text-xs">
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Career Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs text-slate-500">Loading career directory...</p>
        </div>
      ) : careers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <Compass className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-slate-800">No Careers Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try resetting your search query or selecting "All Domains" / "All Streams".
          </p>
        </div>
      )}
    </div>
  )
}
