'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SaveButton } from '@/components/career/save-career-button'
import {
  Building2,
  MapPin,
  Search,
  GraduationCap,
  Scale,
  ArrowRight,
  ExternalLink,
  Award,
  DollarSign,
} from 'lucide-react'

export default function CollegesPage() {
  const [colleges, setColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('ALL')
  const [selectedType, setSelectedType] = useState('ALL')

  useEffect(() => {
    async function loadColleges() {
      setLoading(true)
      try {
        const query = new URLSearchParams()
        if (search) query.append('search', search)
        if (selectedState !== 'ALL') query.append('state', selectedState)
        if (selectedType !== 'ALL') query.append('type', selectedType)

        const res = await fetch(`/api/colleges?${query.toString()}`)
        const data = await res.json()
        if (data.data) {
          setColleges(data.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadColleges()
  }, [search, selectedState, selectedType])

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Building2 className="h-3.5 w-3.5" />
          <span>Indian Higher Education Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">College & Course Explorer</h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Discover top government, national institutes of importance, polytechnics, and premier universities across India.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search college name, city, or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-white shadow-xs text-xs sm:text-sm"
          />
        </div>

        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="bg-white h-10 text-xs">
            <SelectValue placeholder="Filter by State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All States</SelectItem>
            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
            <SelectItem value="Karnataka">Karnataka</SelectItem>
            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
            <SelectItem value="Gujarat">Gujarat</SelectItem>
            <SelectItem value="Rajasthan">Rajasthan</SelectItem>
            <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
            <SelectItem value="Puducherry">Puducherry</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="bg-white h-10 text-xs">
            <SelectValue placeholder="Institution Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="IIT">IIT (Indian Institute of Tech)</SelectItem>
            <SelectItem value="NIT">NIT (National Inst of Tech)</SelectItem>
            <SelectItem value="AIIMS">AIIMS / Medical National</SelectItem>
            <SelectItem value="GOVERNMENT">Central / National Government</SelectItem>
            <SelectItem value="STATE_GOVT">State Government / Polytechnic</SelectItem>
            <SelectItem value="PRIVATE">Premier Private University</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* College Cards Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs text-slate-500">Loading institutions...</p>
        </div>
      ) : colleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <Card key={college.id} className="border-slate-200 flex flex-col justify-between hover:shadow-md transition bg-white">
              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-[11px] font-semibold bg-blue-50 text-blue-700">
                      {college.type}
                    </Badge>
                    {college.ranking && (
                      <Badge variant="outline" className="text-[10px] font-bold text-amber-800 border-amber-300 bg-amber-50">
                        Rank #{college.ranking}
                      </Badge>
                    )}
                  </div>
                  <SaveButton itemId={college.id} itemType="college" />
                </div>

                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{college.name}</CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1 mt-1 text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {college.city}, {college.state}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-xs pt-0">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Annual Tuition:</span>
                  <span className="font-extrabold text-slate-800">{college.feesRange || 'Subsidized'}</span>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Key Courses:</span>
                  <div className="space-y-1.5">
                    {college.courses?.slice(0, 2).map((course: any) => (
                      <div key={course.id} className="p-2 bg-slate-50/80 rounded border border-slate-100 text-[11px] flex justify-between items-center">
                        <span className="font-medium text-slate-800 line-clamp-1">{course.name}</span>
                        <span className="text-slate-500 shrink-0 ml-2">{course.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {college.entranceExams && college.entranceExams.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">Entrance Exams:</span>
                    <div className="flex flex-wrap gap-1">
                      {college.entranceExams.map((ex: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-[10px] bg-slate-50">{ex}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-0 flex gap-2 border-t p-4 bg-slate-50/40">
                <Link href={`/colleges/${college.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full justify-between gap-1 text-xs font-semibold bg-white">
                    View College Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href={`/compare?college1=${college.id}`}>
                  <Button variant="ghost" size="sm" className="text-xs text-slate-600 hover:text-blue-600 gap-1" title="Compare college">
                    <Scale className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <Building2 className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-slate-800">No Colleges Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search keyword or selected state/type filters.
          </p>
        </div>
      )}
    </div>
  )
}
