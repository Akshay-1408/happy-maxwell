import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/db/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowLeft, BookOpen, GraduationCap, ArrowRight } from 'lucide-react'

export default async function PathwayDetailPage({ params }: { params: { slug: string } }) {
  const pathway = await prisma.pathway.findUnique({
    where: { slug: params.slug },
  })

  if (!pathway) {
    notFound()
  }

  const subjects = typeof pathway.keySubjects === 'string' ? JSON.parse(pathway.keySubjects) : pathway.keySubjects
  const exams = typeof pathway.entranceExams === 'string' ? JSON.parse(pathway.entranceExams) : pathway.entranceExams
  const higherEd = typeof pathway.higherEducationOptions === 'string' ? JSON.parse(pathway.higherEducationOptions) : pathway.higherEducationOptions
  const commonCareers = typeof pathway.commonCareers === 'string' ? JSON.parse(pathway.commonCareers) : pathway.commonCareers
  const steps = typeof pathway.steps === 'string' ? JSON.parse(pathway.steps) : pathway.steps

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
      <Link href="/pathways" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Pathways
      </Link>

      <Card className="border-slate-200">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-600 text-white">{pathway.stream.replace('_', ' ')}</Badge>
            <Badge variant="outline">{pathway.difficultyLevel} Difficulty</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">{pathway.name}</h1>
          <p className="text-slate-600 text-sm leading-relaxed">{pathway.shortDescription}</p>
        </CardHeader>
        <CardContent className="border-t pt-4 space-y-4">
          <div>
            <span className="font-bold text-slate-900 text-sm block mb-1">Key Subjects Involved:</span>
            <div className="flex flex-wrap gap-1.5">
              {subjects.map((s: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Step-by-Step Flow */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Pathway Flow After 10th
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps && steps.length > 0 ? (
            steps.map((st: any, idx: number) => (
              <div key={idx} className="relative pl-8 pb-4 border-l-2 border-blue-200 last:border-l-0 last:pb-0">
                <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                <h4 className="font-bold text-slate-900 text-sm">{st.title || `Step ${idx + 1}`}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{st.description || st}</p>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-600 space-y-2">
              <p>1. Complete 10th Standard Board Exams</p>
              <p>2. Enroll in {pathway.name} Stream for 11th & 12th</p>
              <p>3. Prepare for relevant Entrance Examinations ({exams.join(', ')})</p>
              <p>4. Pursue Degree / Diploma Programs ({higherEd.join(', ')})</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Target Careers & CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader><CardTitle className="text-base font-bold">Key Target Careers</CardTitle></CardHeader>
          <CardContent className="space-y-1.5 text-xs text-slate-700">
            {commonCareers.map((c: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span>{c}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold text-blue-900">Check Your Fit</CardTitle>
            <p className="text-xs text-blue-800">
              Take the SmartCareer assessment to see how well your profile aligns with this pathway.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/assessment">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-xs gap-1 font-semibold">
                Start Assessment <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
