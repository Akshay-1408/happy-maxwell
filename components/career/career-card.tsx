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
  HIGH_GROWTH:    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  MODERATE:       { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400' },
  STABLE:         { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400' },
  DECLINING:      { bg: 'bg-rose-500/10',    border: 'border-rose-500/30',    text: 'text-rose-400' },
}

export function CareerCard({ career, onCompare, isSaved = false }: CareerCardProps) {
  const streams = Array.isArray(career.relevantStreams) ? career.relevantStreams : []
  const skills = Array.isArray(career.skills) ? career.skills : []
  const growthStyle = career.growthOutlook
    ? (growthColors[career.growthOutlook] ?? growthColors.STABLE)
    : null

  return (
    <div className="glass-card rounded-2xl flex flex-col group border border-white/[0.06] hover:border-indigo-500/30 transition-all duration-300 overflow-hidden">
      {/* Top colored strip */}
      <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header */}
      <div className="p-5 pb-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {career.category && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold">
                {career.category.name}
              </span>
            )}
            {growthStyle && career.growthOutlook && (
              <span className={`px-2 py-0.5 rounded-md ${growthStyle.bg} border ${growthStyle.border} ${growthStyle.text} text-[11px] font-semibold flex items-center gap-1`}>
                <TrendingUp className="h-3 w-3" />
                {career.growthOutlook.replace('_', ' ')}
              </span>
            )}
          </div>
          <SaveButton itemId={career.id} itemType="career" initialSaved={isSaved} />
        </div>

        <div>
          <h3 className="text-[16px] font-bold text-white leading-snug group-hover:text-indigo-100 transition-colors duration-200">
            {career.name}
          </h3>
          <p className="line-clamp-2 mt-1.5 text-[13px] text-slate-400 leading-relaxed">
            {career.shortDescription}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 pb-4 space-y-3 flex-1">
        {career.salaryRangeLabel && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
            <span className="text-[12px] text-slate-500 font-medium">Estimated CTC</span>
            <span className="text-[13px] font-extrabold text-emerald-400">{career.salaryRangeLabel}</span>
          </div>
        )}

        {career.durationToQualify && (
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <Clock className="h-3.5 w-3.5 text-slate-600 shrink-0" />
            <span>{career.durationToQualify} to qualify</span>
          </div>
        )}

        {streams.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Recommended Stream</span>
            <div className="flex flex-wrap gap-1">
              {streams.slice(0, 2).map((stream, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06]"
                >
                  {stream.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Top Skills</span>
            <p className="text-[12px] text-slate-500 line-clamp-1">
              {skills.slice(0, 3).join(' · ')}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.05] p-4 flex gap-2 bg-white/[0.01]">
        <Link href={`/careers/${career.slug}`} className="flex-1">
          <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-semibold text-slate-300 border border-white/[0.08] hover:border-indigo-500/30 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all duration-200 group/btn">
            <span>View Career Guide</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </button>
        </Link>
        <Link href={`/compare?career1=${career.slug}`}>
          <button
            title="Compare career"
            className="p-2.5 rounded-xl text-slate-500 border border-white/[0.08] hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all duration-200"
          >
            <Scale className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </div>
  )
}
