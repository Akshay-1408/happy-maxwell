'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionCard } from '@/components/assessment/question-card'
import { ProgressIndicator } from '@/components/assessment/progress-indicator'
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, LayoutGrid, Check } from 'lucide-react'

export default function AssessmentPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<any[]>([])
  const [assessmentId, setAssessmentId] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showOverview, setShowOverview] = useState(false)

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

    // Auto-advance with smooth slight delay
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, 350)
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
      if (data && data.topPathways) {
        sessionStorage.setItem('latest_assessment_result', JSON.stringify(data))
        router.push('/results')
      } else {
        setError('Failed to process assessment recommendations.')
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600" />
        <p className="text-sm text-slate-500">Loading questions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const answeredCount = Object.keys(answers).length
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="badge-blue">
          Post-10th Stream Assessment
        </span>
        <h1 className="text-display text-2xl sm:text-3xl text-slate-900">Stream & Career Assessment</h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Answer 30 questions about your interests, aptitude, and goals. Takes about 10 minutes.
        </p>
      </div>

      {/* Progress Bar & Jump Button */}
      {questions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Section: <strong>{currentQuestion?.category?.replace('_', ' ')}</strong></span>
            <button
              type="button"
              onClick={() => setShowOverview(!showOverview)}
              className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>{showOverview ? 'Hide Grid' : 'Question Grid'} ({answeredCount}/{questions.length})</span>
            </button>
          </div>

          <ProgressIndicator
            current={answeredCount}
            total={questions.length}
            categoryLabel={currentQuestion?.category?.replace('_', ' ')}
          />

          {/* Collapsible Question Quick Jump Grid */}
          {showOverview && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-slate-700 block">Jump to Question:</span>
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
                {questions.map((q, idx) => {
                  const isAns = !!answers[q.id]
                  const isCurrent = idx === currentIndex
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx)
                        setShowOverview(false)
                      }}
                      className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-1'
                          : isAns
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isAns ? <Check className="h-3 w-3" /> : idx + 1}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
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

      {/* Navigation */}
      <div className="flex items-center justify-between max-w-2xl mx-auto pt-2">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0 || submitting}
          className="btn-secondary text-xs px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {answeredCount >= 10 && !isLastQuestion && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-ghost text-xs text-slate-500 hover:text-blue-600"
            >
              Submit early ({answeredCount}/{questions.length})
            </button>
          )}

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || answeredCount < 5}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Generating results...' : 'Submit & View Results'}
              <CheckCircle2 className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={submitting}
              className="btn-primary"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
