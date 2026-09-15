'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionCard } from '@/components/assessment/question-card'
import { ProgressIndicator } from '@/components/assessment/progress-indicator'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react'

export default function AssessmentPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<any[]>([])
  const [assessmentId, setAssessmentId] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function initAssessment() {
      try {
        const res = await fetch('/api/assessment/start', { method: 'POST' })
        const data = await res.json()
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions)
          setAssessmentId(data.assessmentId)

          // Load local answers if any
          const saved = localStorage.getItem(`assessment_answers_${data.assessmentId}`)
          if (saved) {
            try { setAnswers(JSON.parse(saved)) } catch (e) {}
          }
        } else {
          setError('Failed to load assessment questions. Please refresh.')
        }
      } catch (err) {
        console.error(err)
        setError('Connection error. Please check your network.')
      } finally {
        setLoading(false)
      }
    }
    initAssessment()
  }, [])

  const handleAnswer = (questionId: string, answerValue: string) => {
    const updated = { ...answers, [questionId]: answerValue }
    setAnswers(updated)
    if (assessmentId) {
      localStorage.setItem(`assessment_answers_${assessmentId}`, JSON.stringify(updated))
    }

    // Auto-advance if not on last question
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, 300)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const responseList = Object.entries(answers).map(([questionId, answerValue]) => ({
        questionId,
        answerValue,
      }))

      const res = await fetch('/api/assessment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          guestResponses: responseList,
        }),
      })

      const data = await res.json()
      if (data && data.recommendedCareers) {
        // Store result in sessionStorage for guest view or redirection
        sessionStorage.setItem('latest_assessment_result', JSON.stringify(data))
        router.push('/results')
      } else {
        setError('Failed to process assessment results.')
        setSubmitting(false)
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred while submitting your assessment.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm text-slate-600 font-medium">Preparing your career assessment...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-600 text-sm mb-6">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
          Try Again
        </Button>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const answeredCount = Object.keys(answers).length
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
      {/* Assessment Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>SmartCareer Assessment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Career & Stream Alignment Test</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Answer questions honestly. There are no right or wrong answers.
        </p>
      </div>

      {/* Progress Bar */}
      {questions.length > 0 && (
        <ProgressIndicator
          current={answeredCount}
          total={questions.length}
          categoryLabel={currentQuestion?.category?.replace('_', ' ')}
        />
      )}

      {/* Question Card */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          currentAnswer={currentAnswer}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between max-w-2xl mx-auto pt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0 || submitting}
          className="gap-2 text-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting || answeredCount < 5}
            className="bg-blue-600 hover:bg-blue-700 gap-2 font-semibold text-xs sm:text-sm"
          >
            {submitting ? 'Calculating Guidance...' : 'Submit & View Guidance'}
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            disabled={!currentAnswer || submitting}
            className="bg-blue-600 hover:bg-blue-700 gap-2 text-xs"
          >
            Next Question
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
