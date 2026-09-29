'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  ArrowLeft,
  ShieldAlert,
  GraduationCap,
  Scale,
  Compass,
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
      content: `Hello! I am your **SmartCareer AI Counselor**. 

I can help you evaluate **Science (PCM/PCB)**, **Commerce**, **Arts & Humanities**, and **Polytechnic Diplomas** after 10th standard.

How can I assist your stream and education decisions today?`,
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
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Context-Aware AI Guidance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">AI Career Counselor</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Trained on Indian post-10th educational pathways, entrance exams, and college choices.
          </p>
        </div>

        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="text-xs gap-1.5 font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </Button>
        </Link>
      </div>

      {/* Main Chat Box */}
      <Card className="border-slate-200 shadow-md flex flex-col h-[65vh] bg-white overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-xs space-y-2 whitespace-pre-wrap'
                }`}
              >
                {m.content}
              </div>

              {m.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.2s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.4s]" />
                <span>Analyzing streams and options...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t bg-slate-50/50 flex flex-wrap gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 block w-full mb-0.5">Suggested Questions:</span>
            {STARTER_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                className="text-[11px] bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 px-2.5 py-1 rounded-full transition truncate max-w-full"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input Bar */}
        <CardFooter className="p-3 sm:p-4 border-t bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex w-full gap-2"
          >
            <Input
              placeholder="Ask a question about streams, marks, colleges, or careers..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="bg-slate-50 border-slate-200 text-xs sm:text-sm h-11"
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-11 shrink-0 gap-1.5 text-xs font-semibold shadow-xs"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </CardFooter>
      </Card>

      {/* Guidance Notice */}
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
        <span>
          AI responses provide structured educational information and should be used to support discussions with parents and school counselors.
        </span>
      </div>
    </div>
  )
}
