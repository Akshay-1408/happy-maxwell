import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/db/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ArrowLeft, BookOpen, Wrench, CheckCircle2, AlertTriangle, GraduationCap } from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const career = await prisma.career.findUnique({ where: { slug: params.slug } })
  if (!career) return { title: 'Career Not Found' }
  return {
    title: `${career.name} - Post-10th Career Guide | SmartCareer`,
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

  const streams = typeof career.relevantStreams === 'string' ? JSON.parse(career.relevantStreams) : career.relevantStreams
  const education = typeof career.requiredEducation === 'string' ? JSON.parse(career.requiredEducation) : career.requiredEducation
  const skills = typeof career.skills === 'string' ? JSON.parse(career.skills) : career.skills
  const tools = typeof career.toolsUsed === 'string' ? JSON.parse(career.toolsUsed) : career.toolsUsed
  const pros = typeof career.pros === 'string' ? JSON.parse(career.pros) : career.pros
  const challenges = typeof career.challenges === 'string' ? JSON.parse(career.challenges) : career.challenges
  const altRoutes = typeof career.alternativeRoutes === 'string' ? JSON.parse(career.alternativeRoutes) : career.alternativeRoutes

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
      {/* Back Link */}
      <Link href="/careers" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Careers Directory
      </Link>

      {/* Hero Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {career.category && (
              <Badge className="bg-blue-600 text-white font-semibold">
                {career.category.name}
              </Badge>
            )}
            {streams.map((s: string, idx: number) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {s.replace('_', ' ')}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{career.name}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{career.shortDescription}</p>
        </CardHeader>
        <CardContent className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
          <div>
            <span className="font-bold text-slate-900 block mb-1">Duration to Qualify:</span>
            <span>{career.durationToQualify || '3 - 5 Years after 10th'}</span>
          </div>
          <div>
            <span className="font-bold text-slate-900 block mb-1">Work Environment:</span>
            <span>{career.workEnvironment || 'Office / Digital / On-site'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Detail Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="pathway" className="text-xs sm:text-sm">Pathway</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs sm:text-sm">Skills & Tools</TabsTrigger>
          <TabsTrigger value="pros" className="text-xs sm:text-sm">Pros & Cons</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-lg">Detailed Career Summary</CardTitle></CardHeader>
            <CardContent className="text-sm text-slate-700 leading-relaxed space-y-3">
              <p>{career.fullDescription || career.shortDescription}</p>
              {career.whoMightEnjoy && (
                <div className="p-4 bg-blue-50/60 rounded-lg border border-blue-100 text-xs space-y-1">
                  <span className="font-bold text-blue-900 block">Who Might Enjoy This Career:</span>
                  <p className="text-blue-800">{career.whoMightEnjoy}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pathway" className="mt-4 space-y-4">
          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Education Steps After 10th
            </CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              {education.map((step: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <p className="text-slate-800 font-medium text-xs sm:text-sm">{step}</p>
                </div>
              ))}
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

        <TabsContent value="skills" className="mt-4 space-y-4">
          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-lg">Required Skills & Tools</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <BookOpen className="h-4 w-4 text-blue-600" /> Core Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1 text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <Wrench className="h-4 w-4 text-blue-600" /> Industry Tools:
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

        <TabsContent value="pros" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-emerald-200 bg-emerald-50/40">
              <CardHeader><CardTitle className="text-base font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Key Benefits & Opportunities
              </CardTitle></CardHeader>
              <CardContent className="space-y-2 text-xs text-emerald-950">
                {pros.map((p: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <span>•</span>
                    <p>{p}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/40">
              <CardHeader><CardTitle className="text-base font-bold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" /> Challenges & Realities
              </CardTitle></CardHeader>
              <CardContent className="space-y-2 text-xs text-amber-950">
                {challenges.map((c: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <span>•</span>
                    <p>{c}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
