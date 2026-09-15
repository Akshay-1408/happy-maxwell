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
  
  const options = question.options
    ? typeof question.options === 'string'
      ? JSON.parse(question.options)
      : question.options
    : [
        { value: '1', label: '1 - Strongly Disagree / Not Interested' },
        { value: '2', label: '2 - Slightly Disagree' },
        { value: '3', label: '3 - Neutral / Undecided' },
        { value: '4', label: '4 - Agree / Interested' },
        { value: '5', label: '5 - Strongly Agree / Highly Interested' },
      ]

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {question.category.replace('_', ' ')}
          </Badge>
          <span className="text-xs font-medium text-slate-500">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>
        <CardTitle className="text-lg sm:text-xl font-semibold leading-snug text-slate-900">
          {question.questionText}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-2">
        {isLikert ? (
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2 text-center text-xs text-slate-500 font-medium mb-1">
              <span>Not at all</span>
              <span>Slightly</span>
              <span>Neutral</span>
              <span>Interested</span>
              <span>Strongly</span>
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
                    className={`h-12 rounded-lg border-2 font-bold text-base transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {val}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <RadioGroup
            value={currentAnswer}
            onValueChange={(val) => onAnswer(question.id, val)}
            className="space-y-3"
          >
            {options.map((opt: any, idx: number) => {
              const val = typeof opt === 'object' ? opt.value : opt
              const label = typeof opt === 'object' ? opt.label : opt
              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 rounded-lg border p-4 transition-all cursor-pointer ${
                    currentAnswer === val
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => onAnswer(question.id, val)}
                >
                  <RadioGroupItem value={val} id={`q-${question.id}-opt-${idx}`} />
                  <Label htmlFor={`q-${question.id}-opt-${idx}`} className="flex-1 cursor-pointer font-normal text-sm sm:text-base">
                    {label}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  )
}
