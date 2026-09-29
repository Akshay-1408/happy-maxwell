'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Compass, Building2, BookOpen, X, Loader2 } from 'lucide-react'

export function GlobalSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ careers: any[]; colleges: any[]; pathways: any[]; totalCount?: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults(null)
      setLoading(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
          setIsOpen(true)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (url: string) => {
    setIsOpen(false)
    setQuery('')
    router.push(url)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-xs">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <Input
          placeholder="Search careers, colleges..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="h-8 pl-8 pr-7 text-xs bg-slate-100 border-slate-200 focus:bg-white transition-all rounded-lg"
        />
        {loading ? (
          <Loader2 className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 animate-spin" />
        ) : query ? (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {/* Results Dropdown */}
      {isOpen && results && (
        <div className="absolute top-10 left-0 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden text-xs max-h-96 overflow-y-auto animate-in fade-in duration-150">
          {/* Careers */}
          {results.careers?.length > 0 && (
            <div className="p-2 border-b">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                Careers ({results.careers.length})
              </span>
              {results.careers.map((car: any) => (
                <div
                  key={car.id}
                  onClick={() => handleSelect(`/careers/${car.slug}`)}
                  className="p-2 hover:bg-blue-50/60 rounded-lg cursor-pointer flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-2">
                    <Compass className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">{car.name}</span>
                      <span className="text-[10px] text-slate-500">{car.category?.name}</span>
                    </div>
                  </div>
                  {car.salaryRangeLabel && (
                    <Badge variant="outline" className="text-[9px] text-blue-700 bg-blue-50 border-blue-200 shrink-0">
                      {car.salaryRangeLabel}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Colleges */}
          {results.colleges?.length > 0 && (
            <div className="p-2 border-b">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                Colleges ({results.colleges.length})
              </span>
              {results.colleges.map((col: any) => (
                <div
                  key={col.id}
                  onClick={() => handleSelect(`/colleges/${col.id}`)}
                  className="p-2 hover:bg-blue-50/60 rounded-lg cursor-pointer flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">{col.name}</span>
                      <span className="text-[10px] text-slate-500">{col.city}, {col.state}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[9px] shrink-0">
                    {col.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Pathways */}
          {results.pathways?.length > 0 && (
            <div className="p-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                Education Pathways
              </span>
              {results.pathways.map((pat: any) => (
                <div
                  key={pat.id}
                  onClick={() => handleSelect(`/pathways/${pat.slug}`)}
                  className="p-2 hover:bg-blue-50/60 rounded-lg cursor-pointer flex items-center gap-2 transition"
                >
                  <BookOpen className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">{pat.name}</span>
                    <span className="text-[10px] text-slate-500">{pat.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.careers.length === 0 && results.colleges.length === 0 && results.pathways.length === 0 && (
            <div className="p-6 text-center text-slate-500 text-xs">
              No matching results found for "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  )
}
