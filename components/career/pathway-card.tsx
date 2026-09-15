import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, BookOpen } from 'lucide-react'

interface PathwayCardProps {
  pathway: {
    id: string
    name: string
    slug: string
    stream: string
    shortDescription: string
    difficultyLevel: string
    duration: string
    keySubjects: string[]
  }
}

export function PathwayCard({ pathway }: PathwayCardProps) {
  const getDifficultyColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'HIGH':
      case 'CHALLENGING':
        return 'destructive'
      case 'MODERATE':
      case 'MEDIUM':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge className="bg-blue-600 text-white">{pathway.stream.replace('_', ' ')}</Badge>
          <Badge variant={getDifficultyColor(pathway.difficultyLevel)}>
            {pathway.difficultyLevel} Difficulty
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold">{pathway.name}</CardTitle>
        <CardDescription className="line-clamp-2 mt-1">{pathway.shortDescription}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 text-sm pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Clock className="h-4 w-4 text-blue-600" />
          <span><strong>Duration:</strong> {pathway.duration}</span>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span>Key Subjects:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {pathway.keySubjects.map((sub, i) => (
              <Badge key={i} variant="outline" className="text-xs font-normal">
                {sub}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/pathways/${pathway.slug}`} className="w-full">
          <Button className="w-full justify-between gap-1 text-xs bg-blue-600 hover:bg-blue-700">
            Explore Pathway
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
