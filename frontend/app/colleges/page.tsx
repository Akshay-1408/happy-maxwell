'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, Building2, MapPin, Search } from 'lucide-react'

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
      {/* Prominent Sample Data Notice Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 sm:p-6 flex items-start gap-4">
        <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
        <div className="space-y-1">
          <h3 className="font-bold text-amber-900 text-sm sm:text-base">
            ⚠️ Demonstration Data Notice
          </h3>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            The colleges and courses listed below are <strong>sample / demonstration data</strong> provided for career exploration layout purposes. Official admission requirements, cut-offs, and seat matrix must always be verified directly from official university / government admission portals.
          </p>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">College & Course Explorer</h1>
        <p className="text-slate-600 text-sm">
          Sample institution directory showing higher education routes available after 10th & 12th.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search college name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="bg-white"><SelectValue placeholder="Filter by State" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All States</SelectItem>
            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
            <SelectItem value="Karnataka">Karnataka</SelectItem>
            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="bg-white"><SelectValue placeholder="Institution Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="IIT">IIT (Institute of Tech)</SelectItem>
            <SelectItem value="NIT">NIT (National Inst of Tech)</SelectItem>
            <SelectItem value="AIIMS">AIIMS (Medical)</SelectItem>
            <SelectItem value="GOVERNMENT">Government College</SelectItem>
            <SelectItem value="PRIVATE">Private University</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* College Cards */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <Card key={college.id} className="border-slate-200 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Badge variant="secondary" className="text-[10px]">
                    {college.type}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] text-amber-700 border-amber-300 bg-amber-50">
                    Sample Data
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900">{college.name}</CardTitle>
                <CardDescription className="text-xs flex items-center gap-1 mt-1 text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {college.city}, {college.state}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs pt-0">
                <span className="font-semibold text-slate-700 block">Courses Offered (Sample):</span>
                <div className="space-y-1">
                  {college.courses?.map((course: any) => (
                    <div key={course.id} className="p-2 bg-slate-50 rounded border text-[11px] flex justify-between items-center">
                      <span className="font-medium text-slate-800">{course.name}</span>
                      <span className="text-slate-500">{course.duration}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
