import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/db/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SaveButton } from '@/components/career/save-career-button'
import {
  ArrowLeft,
  BookOpen,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Scale,
  TrendingUp,
  DollarSign,
  Briefcase,
  FileCheck,
} from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const career = await prisma.career.findUnique({ where: { slug: params.slug } })
  if (!career) return { title: 'Career Not Found' }
  return {
    title: `${career.name} - Post-10th Guide & Salary | SmartCareer`,
    description: career.shortDescription,
  }
}

export default async function CareerDetailPage({ params }: { params: { slug: string } }) {
  const career = await prisma.career.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  })

  if (!career) {
    notFound()
  }

  // Fetch 3 related careers in the same category
  const relatedCareers = await prisma.career.findMany({
    where: {
      categoryId: career.categoryId,
      id: { not: career.id },
    },
    take: 3,
  })

  const streams = Array.isArray(career.relevantStreams) ? career.relevantStreams : []
  const education = Array.isArray(career.requiredEducation) ? career.requiredEducation : []
  const degrees = Array.isArray(career.degreesOrDiplomas) ? career.degreesOrDiplomas : []
  const exams = Array.isArray(career.entranceExams) ? career.entranceExams : []
  const recommendedSubjects = Array.isArray(career.recommendedSubjects) ? career.recommendedSubjects : []
  const skills = Array.isArray(career.skills) ? career.skills : []
  const tools = Array.isArray(career.toolsUsed) ? career.toolsUsed : []
  const pros = Array.isArray(career.pros) ? career.pros : []
  const challenges = Array.isArray(career.challenges) ? career.challenges : []
  const altRoutes = Array.isArray(career.alternativeRoutes) ? career.alternativeRoutes : []

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
      {/* Back Link & Top Actions */}
      <div className="flex items-center justify-between">
        <Link href="/careers" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Careers Directory
        </Link>
        <div className="flex items-center gap-2">
          <SaveButton itemId={career.id} itemType="career" />
          <Link href={`/compare?career1=${career.slug}`}>
            <Button variant="outline" size="sm" className="text-xs font-semibold gap-1 text-slate-700">
              <Scale className="h-3.5 w-3.5" />
              Compare
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Card */}
      <Card className="border-slate-200 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 sm:p-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {career.category && (
              <Badge className="bg-blue-600 text-white font-bold text-xs">
                {career.category.name}
              </Badge>
            )}
            {career.growthOutlook && (
              <Badge variant="outline" className="text-xs text-emerald-300 border-emerald-400/40 bg-emerald-500/10">
                Growth: {career.growthOutlook.replace('_', ' ')}
              </Badge>
            )}
            {streams.map((s: string, idx: number) => (
              <Badge key={idx} variant="outline" className="text-xs text-slate-200 border-white/20">
                {s.replace('_', ' ')}
              </Badge>
            ))}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold">{career.name}</h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-3xl">{career.shortDescription}</p>
        </div>

        {/* Quick Fact Matrix */}
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 border-t text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Salary Range</span>
            <span className="font-extrabold text-blue-600 text-sm block">{career.salaryRangeLabel || '₹4.5 - 18.0 LPA'}</span>
          </div>

          <div className="space-y-0.5">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Time to Qualify</span>
            <span className="font-bold text-slate-800 text-xs block">{career.durationToQualify || '3 - 5 Years after 12th'}</span>
          </div>

          <div className="space-y-0.5">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Work Environment</span>
            <span className="font-bold text-slate-800 text-xs block truncate">{career.workEnvironment || 'Office / Tech'}</span>
          </div>

          <div className="space-y-0.5">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Key Stream</span>
            <span className="font-bold text-slate-800 text-xs block">{streams[0]?.replace('_', ' ') || 'Science / Commerce'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Detail Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="pathway" className="text-xs sm:text-sm font-semibold">Education & Exams</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs sm:text-sm font-semibold">Skills & Tools</TabsTrigger>
          <TabsTrigger value="pros" className="text-xs sm:text-sm font-semibold">Pros & Cons</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-lg font-bold">What This Professional Does</CardTitle></CardHeader>
            <CardContent className="text-sm text-slate-700 leading-relaxed space-y-4">
              <p className="leading-relaxed">{career.fullDescription || career.shortDescription}</p>

              {career.whoMightEnjoy && (
                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200/60 text-xs space-y-1">
                  <span className="font-bold text-blue-950 block text-sm">Who Might Enjoy This Career:</span>
                  <p className="text-blue-900 leading-relaxed">{career.whoMightEnjoy}</p>
                </div>
              )}

              {recommendedSubjects.length > 0 && (
                <div>
                  <span className="font-bold text-slate-900 text-xs block mb-1.5">Recommended Class 10th & 11th Subjects:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {recommendedSubjects.map((sub: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{sub}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education & Exams Tab */}
        <TabsContent value="pathway" className="mt-4 space-y-4">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Step-by-Step Educational Route After 10th
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs sm:text-sm">
              {education.map((step: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
                    {idx + 1}
                  </span>
                  <p className="text-slate-800 font-medium text-xs sm:text-sm leading-relaxed">{step}</p>
                </div>
              ))}

              {degrees.length > 0 && (
                <div className="pt-2">
                  <span className="font-bold text-slate-900 text-xs block mb-1.5 flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-blue-600" /> Popular Degrees & Diplomas in India:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {degrees.map((deg: string, dIdx: number) => (
                      <Badge key={dIdx} variant="outline" className="text-xs bg-slate-50">{deg}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {exams.length > 0 && (
                <div className="pt-2">
                  <span className="font-bold text-slate-900 text-xs block mb-1.5">Important Entrance Examinations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {exams.map((exam: string, eIdx: number) => (
                      <Badge key={eIdx} variant="secondary" className="text-xs font-semibold bg-blue-50 text-blue-800">{exam}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {altRoutes.length > 0 && (
                <div className="pt-2">
                  <span className="font-bold text-slate-900 text-xs block mb-1">Alternative Entry Routes:</span>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {altRoutes.map((alt: string, i: number) => (
                      <li key={i}>{alt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills & Tools Tab */}
        <TabsContent value="skills" className="mt-4 space-y-4">
          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-lg font-bold">Skills, Tools & Technologies</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <BookOpen className="h-4 w-4 text-blue-600" /> Core Professional Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1 text-xs">{s}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <Wrench className="h-4 w-4 text-blue-600" /> Industry Software & Tools:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tools.map((t: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="px-3 py-1 text-xs">{t}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pros & Cons Tab */}
        <TabsContent value="pros" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-emerald-200 bg-emerald-50/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Key Advantages & Pros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-700">
                {pros.map((p: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Challenges & Trade-offs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-700">
                {challenges.map((c: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Careers */}
      {relatedCareers.length > 0 && (
        <section className="space-y-3 pt-4">
          <h3 className="text-lg font-bold text-slate-900">Related Careers in {career.category?.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedCareers.map((rc) => (
              <Link key={rc.id} href={`/careers/${rc.slug}`}>
                <Card className="p-3 border-slate-200 hover:border-blue-300 hover:shadow-xs transition flex flex-col justify-between h-full">
                  <span className="font-bold text-xs text-slate-900">{rc.name}</span>
                  <span className="text-[11px] text-blue-600 font-semibold mt-2">View Guide →</span>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
