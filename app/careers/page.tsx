'use client'

import { useState, useEffect } from 'react'
import { CareerCard } from '@/components/career/career-card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Compass } from 'lucide-react'

export default function CareersPage() {
  const [careers, setCareers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Fields' },
    { id: 'technology', name: 'Technology' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'business', name: 'Business' },
    { id: 'finance', name: 'Finance' },
    { id: 'law', name: 'Law' },
    { id: 'design', name: 'Design' },
    { id: 'media', name: 'Media' },
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
          setCareers(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadCareers()
  }, [search, selectedCategory])

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Compass className="h-3.5 w-3.5" />
          <span>Career Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Explore Post-10th Careers</h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Discover careers in technology, healthcare, finance, design, law, and public service.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search careers by name or keyword (e.g., Software, Doctor, Accountant)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-white shadow-xs"
          />
        </div>

        {/* Category Tabs */}
        <div className="overflow-x-auto pb-2">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="bg-slate-100 p-1">
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
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
          <p className="text-xs text-slate-500">Loading career database...</p>
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
            Try adjusting your search query or selected category filter.
          </p>
        </div>
      )}
    </div>
  )
}
