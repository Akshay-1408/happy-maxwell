'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle2, Calendar } from 'lucide-react'

interface Task {
  week: number
  title: string
  description: string
  done: boolean
}

export function ActionPlanWidget() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      week: 1,
      title: 'Explore Top Recommended Stream',
      description: 'Read the detailed pathway guide for your #1 matched stream after 10th.',
      done: true,
    },
    {
      week: 2,
      title: 'Research Top 2 Careers',
      description: 'Check required subjects, entrance exams, and work environments for two top career choices.',
      done: false,
    },
    {
      week: 3,
      title: 'Discuss with Parents & Counsellor',
      description: 'Review your interest profile together and note questions or concerns.',
      done: false,
    },
    {
      week: 4,
      title: 'Finalize Stream & Subjects',
      description: 'Make an informed choice on subject combinations for 11th standard admissions.',
      done: false,
    },
  ])

  const toggleTask = (index: number) => {
    setTasks((prev) =>
      prev.map((task, idx) => (idx === index ? { ...task, done: !task.done } : task))
    )
  }

  const completedCount = tasks.filter((t) => t.done).length

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Post-10th Action Plan
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">
            {completedCount} of {tasks.length} steps completed
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Month 1</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 p-3 rounded-lg border transition ${
              task.done ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 hover:border-blue-200'
            }`}
          >
            <Checkbox
              id={`task-${idx}`}
              checked={task.done}
              onCheckedChange={() => toggleTask(idx)}
              className="mt-0.5"
            />
            <div className="flex-1 space-y-0.5">
              <label
                htmlFor={`task-${idx}`}
                className={`text-sm font-semibold cursor-pointer block ${
                  task.done ? 'line-through text-slate-400' : 'text-slate-800'
                }`}
              >
                Week {task.week}: {task.title}
              </label>
              <p className={`text-xs ${task.done ? 'text-slate-400' : 'text-slate-600'}`}>
                {task.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
