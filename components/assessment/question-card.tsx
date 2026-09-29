'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface QuestionCardProps {
  question: {
    id: string
    questionText: string
    questionType: string
    category: string
    options?: any
  }
  onAnswer: (questionId: string, answerValue: string) => void
  currentAnswer?: string
  currentIndex: number
  totalQuestions: number
}

export function QuestionCard({
  question,
  onAnswer,
  currentAnswer,
  currentIndex,
  totalQuestions,
}: QuestionCardProps) {
  const isLikert = question.questionType === 'LIKERT'

  let rawOptions: any[] = []
  if (question.options) {
    rawOptions = typeof question.options === 'string' ? JSON.parse(question.options) : question.options
  }

  const parsedOptions = rawOptions.map((opt: any) => {
    if (typeof opt === 'string') {
      const match = opt.match(/^([A-F0-9])[\.\:\-]\s*(.*)$/i)
      if (match) {
        return { value: match[1].toUpperCase(), label: opt }
      }
      return { value: opt, label: opt }
    }
    return { value: opt.value || opt, label: opt.label || opt }
  })

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md border-slate-200">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-700">
              {question.category.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="text-[11px] text-slate-500">
              {question.questionType.replace('_', ' ')}
            </Badge>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
        <CardTitle className="text-lg sm:text-xl font-bold leading-snug text-slate-900">
          {question.questionText}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-2">
        {isLikert ? (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center text-[11px] sm:text-xs text-slate-500 font-medium">
              <span className="text-red-600 font-semibold">1 · Low</span>
              <span>2 · Slight</span>
              <span>3 · Neutral</span>
              <span>4 · High</span>
              <span className="text-emerald-600 font-semibold">5 · Passion</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => {
                const strVal = val.toString()
                const isSelected = currentAnswer === strVal
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onAnswer(question.id, strVal)}
                    className={`h-14 rounded-xl border-2 font-extrabold text-lg sm:text-xl transition-all duration-150 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md scale-102'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    {val}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {parsedOptions.map((opt, idx) => {
              const isSelected = currentAnswer === opt.value
              return (
                <div
                  key={idx}
                  onClick={() => onAnswer(question.id, opt.value)}
                  className={`flex items-start space-x-3 rounded-xl border p-4 transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600 text-blue-950 font-medium'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 text-slate-800'
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                  <Label className="flex-1 cursor-pointer font-normal text-xs sm:text-sm leading-relaxed">
                    {opt.label}
                  </Label>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
