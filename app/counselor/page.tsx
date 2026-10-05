'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  MessageSquare,
  Send,
  Bot,
  User,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const STARTER_PROMPTS = [
  "I'm confused between Science (PCM) and Commerce with Math.",
  "What are the entrance exams and eligibility for Design (NID/UCEED)?",
  "Should I take a 3-Year Polytechnic Diploma or 11th/12th PCM?",
  "What are the differences in career outcomes between MBBS and B.Pharm?",
  "How should I start preparing for CLAT and 5-Year Integrated Law?",
]

export default function CounselorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your SmartCareer AI Counselor.

I can help you think through Science (PCM/PCB), Commerce, Arts, and Polytechnic options after 10th. Ask me anything about streams, entrance exams, or career choices.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input
    if (!textToSend.trim() || loading) return

    const userMessage: ChatMessage = { role: 'user', content: textToSend.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/counselor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'I am here to assist with your career questions. Please feel free to ask about any specific stream or entrance exam!',
          },
        ])
      }
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I experienced a brief connection hiccup. Please try asking your question again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl space-y-6">

        {/* Header */}
        <div className="card-surface rounded-xl p-5 sm:p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-0.5">AI Guidance</p>
            <h1 className="text-xl font-bold text-slate-900">AI Career Counselor</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Ask about streams, entrance exams, colleges, or career tradeoffs after 10th.
            </p>
          </div>
          <Link href="/dashboard">
            <button className="btn-secondary text-xs px-4 py-2 shrink-0">
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </button>
          </Link>
        </div>

        {/* Chat Box */}
        <div className="card-surface rounded-xl bg-white overflow-hidden flex flex-col" style={{ height: '65vh' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 whitespace-pre-wrap'
                  }`}
                >
                  {m.content}
                </div>

                {m.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Starter suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 w-full mb-0.5">Try asking:</span>
              {STARTER_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="text-[11px] bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700 px-2.5 py-1 rounded-full transition-colors truncate max-w-full"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend() }}
              className="flex gap-2"
            >
              <Input
                placeholder="Ask about streams, exams, colleges, or careers..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="bg-slate-50 border-slate-200 text-sm h-10 flex-1"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="btn-primary px-4 h-10 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Notice */}
        <div className="notice-amber">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            AI responses are for educational guidance. Discuss important decisions with your parents, teachers, and school counselors.
          </span>
        </div>
      </div>
    </div>
  )
}
