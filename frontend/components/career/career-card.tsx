'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, ArrowRight } from 'lucide-react'

interface CareerCardProps {
  career: {
    id: string
    name: string
    slug: string
    shortDescription: string
    category?: { name: string } | null
    relevantStreams: string[]
    requiredEducation: string[]
    skills: string[]
  }
  onSave?: (id: string) => void
  onCompare?: (career: any) => void
  isSaved?: boolean
}

export function CareerCard({ career, onSave, onCompare, isSaved = false }: CareerCardProps) {
  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          {career.category && (
            <Badge variant="secondary" className="mb-2">
              {career.category.name}
            </Badge>
          )}
          {onSave && (
            <button
              onClick={() => onSave(career.id)}
              className="text-slate-400 hover:text-red-500 transition"
              aria-label="Save career"
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          )}
        </div>
        <CardTitle className="text-xl font-bold">{career.name}</CardTitle>
        <CardDescription className="line-clamp-2 mt-1">{career.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm pb-4">
        <div>
          <span className="font-semibold text-slate-700">Relevant Streams:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {career.relevantStreams.map((stream, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {stream.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>

        {career.skills && career.skills.length > 0 && (
          <div>
            <span className="font-semibold text-slate-700">Key Skills:</span>
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
              {career.skills.slice(0, 3).join(', ')}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Link href={`/careers/${career.slug}`} className="flex-1">
          <Button variant="outline" className="w-full justify-between gap-1 text-xs">
            View Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
        {onCompare && (
          <Button variant="ghost" size="sm" onClick={() => onCompare(career)} className="text-xs">
            Compare
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
