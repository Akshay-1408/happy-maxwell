'use client'

import Link from 'next/link'
import { ArrowRight, Scale, TrendingUp, Clock } from 'lucide-react'
import { SaveButton } from '@/components/career/save-career-button'

interface CareerCardProps {
  career: {
    id: string
    name: string
    slug: string
    shortDescription: string
    salaryRangeLabel?: string | null
    durationToQualify?: string | null
    growthOutlook?: string | null
    category?: { name: string } | null
    relevantStreams: string[]
    requiredEducation: string[]
    skills: string[]
  }
  onCompare?: (career: any) => void
  isSaved?: boolean
}

const growthColors: Record<string, { bg: string; border: string; text: string }> = {
  HIGH_GROWTH: { bg: 'bg-emerald-50',  border: 'border-emerald-200', text: 'text-emerald-700' },
  MODERATE:    { bg: 'bg-amber-50',    border: 'border-amber-200',   text: 'text-amber-700' },
  STABLE:      { bg: 'bg-blue-50',     border: 'border-blue-200',    text: 'text-blue-700' },
  DECLINING:   { bg: 'bg-rose-50',     border: 'border-rose-200',    text: 'text-rose-700' },
}

export function CareerCard({ career, onCompare, isSaved = false }: CareerCardProps) {
  const streams    = Array.isArray(career.relevantStreams) ? career.relevantStreams : []
  const skills     = Array.isArray(career.skills) ? career.skills : []
  const growthStyle = career.growthOutlook
    ? (growthColors[career.growthOutlook] ?? growthColors.STABLE)
    : null

  return (
    <div className="card-surface rounded-xl flex flex-col bg-white overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Top accent line */}
      <div className="h-0.5 w-full bg-blue-600" />

      {/* Header */}
      <div className="p-5 pb-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {career.category && (
              <span className="badge-blue text-[11px]">
                {career.category.name}
              </span>
            )}
            {growthStyle && career.growthOutlook && (
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 border ${growthStyle.bg} ${growthStyle.border} ${growthStyle.text}`}>
                <TrendingUp className="h-3 w-3" />
                {career.growthOutlook.replace('_', ' ')}
              </span>
            )}
          </div>
          <SaveButton itemId={career.id} itemType="career" initialSaved={isSaved} />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {career.name}
          </h3>
          <p className="line-clamp-2 mt-1.5 text-sm text-slate-500 leading-relaxed">
            {career.shortDescription}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 pb-4 space-y-3 flex-1">
        {career.salaryRangeLabel && (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-slate-500 font-medium">Estimated CTC</span>
            <span className="text-sm font-bold text-emerald-700">{career.salaryRangeLabel}</span>
          </div>
        )}

        {career.durationToQualify && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{career.durationToQualify} to qualify</span>
          </div>
        )}

        {streams.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Recommended Stream</span>
            <div className="flex flex-wrap gap-1">
              {streams.slice(0, 2).map((stream, idx) => (
                <span
                  key={idx}
                  className="badge-slate text-[11px] px-2 py-0.5"
                >
                  {stream.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Top Skills</span>
            <p className="text-xs text-slate-500 line-clamp-1">{skills.slice(0, 3).join(' · ')}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 p-4 flex gap-2">
        <Link href={`/careers/${career.slug}`} className="flex-1">
          <button className="w-full btn-secondary justify-between text-xs py-2">
            <span>View Career Guide</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Link>
        <Link href={`/compare?career1=${career.slug}`}>
          <button
            title="Compare career"
            className="btn-ghost p-2 text-slate-400 hover:text-blue-600"
          >
            <Scale className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </div>
  )
}
