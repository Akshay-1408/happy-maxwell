'use client'

import { Progress } from '@/components/ui/progress'

interface ProgressIndicatorProps {
  current: number
  total: number
  categoryLabel?: string
}

export function ProgressIndicator({ current, total, categoryLabel }: ProgressIndicatorProps) {
  const percentage = Math.round((current / total) * 100)
  const remaining = Math.max(0, total - current)
  const estMinutesLeft = Math.ceil(remaining * 0.4)

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2 mb-6">
      <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
        <span>{categoryLabel || 'Assessment Progress'}</span>
        <span>
          {current} of {total} answered ({percentage}%)
        </span>
      </div>
      <Progress value={percentage} className="h-2.5" />
      <div className="flex justify-between text-xs text-slate-400 pt-0.5">
        <span>Take your time — answer honestly</span>
        <span>~{estMinutesLeft} min remaining</span>
      </div>
    </div>
  )
}
