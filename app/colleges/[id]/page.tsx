import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/db/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SaveButton } from '@/components/career/save-career-button'
import {
  ArrowLeft,
  Building2,
  MapPin,
  GraduationCap,
  Scale,
  ExternalLink,
  Award,
  CheckCircle2,
  BookOpen,
  DollarSign,
  FileCheck,
} from 'lucide-react'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const college = await prisma.college.findUnique({ where: { id: params.id } })
  if (!college) return { title: 'College Not Found' }
  return {
    title: `${college.name} - Admissions, Courses & Fees | SmartCareer`,
    description: `Detailed guide to admissions, eligibility, courses, and fees at ${college.name}, ${college.city}.`,
  }
}

export default async function CollegeDetailPage({ params }: { params: { id: string } }) {
  const college = await prisma.college.findUnique({
    where: { id: params.id },
    include: { courses: true },
  })

  if (!college) {
    notFound()
  }

  const facilities = Array.isArray(college.facilities) ? college.facilities : []
  const entranceExams = Array.isArray(college.entranceExams) ? college.entranceExams : []

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
      {/* Back Link & Top Actions */}
      <div className="flex items-center justify-between">
        <Link href="/colleges" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Colleges Directory
        </Link>
        <div className="flex items-center gap-2">
          <SaveButton itemId={college.id} itemType="college" />
          <Link href={`/compare?college1=${college.id}`}>
            <Button variant="outline" size="sm" className="text-xs font-semibold gap-1 text-slate-700">
              <Scale className="h-3.5 w-3.5" />
              Compare
            </Button>
          </Link>
          {college.website && (
            <a href={college.website} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="ghost" className="text-xs gap-1 text-blue-600">
                Official Website <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Hero Card */}
      <Card className="border-slate-200 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 sm:p-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-blue-600 text-white font-bold text-xs">
              {college.type}
            </Badge>
            {college.ranking && (
              <Badge variant="outline" className="text-xs text-amber-300 border-amber-400/40 bg-amber-500/10 font-bold">
                NIRF Ranking #{college.ranking}
              </Badge>
            )}
            {college.estYear && (
              <Badge variant="outline" className="text-xs text-slate-300 border-white/20">
                Est. {college.estYear}
              </Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold">{college.name}</h1>
          <p className="text-slate-200 text-xs sm:text-sm flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
            {college.city}, {college.state} · {college.affiliation}
          </p>
        </div>

        {/* Quick Fact Matrix */}
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-slate-50 border-t text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Annual Tuition</span>
            <span className="font-extrabold text-blue-600 text-sm block">{college.feesRange || 'Government Subsidized'}</span>
          </div>

          <div className="space-y-0.5">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Institution Type</span>
            <span className="font-bold text-slate-800 text-xs block">{college.type}</span>
          </div>

          <div className="space-y-0.5">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Total Courses Listed</span>
            <span className="font-bold text-slate-800 text-xs block">{college.courses.length} Programs</span>
          </div>
        </CardContent>
      </Card>

      {/* Student Suitability Note */}
      {college.studentSuitability && (
        <Card className="border-blue-200 bg-blue-50/60 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              Student Suitability Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs sm:text-sm text-blue-900 leading-relaxed">
            {college.studentSuitability}
          </CardContent>
        </Card>
      )}

      {/* Courses & Eligibility Section */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Undergraduate & Diploma Courses Offered
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {college.courses.map((course) => (
            <div key={course.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-bold text-slate-900 text-sm">{course.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[11px] bg-white">{course.duration}</Badge>
                  {course.feePerYear && (
                    <Badge variant="secondary" className="text-[11px] font-bold text-blue-700">{course.feePerYear}/yr</Badge>
                  )}
                </div>
              </div>
              {course.eligibility && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Eligibility & Entrance:</strong> {course.eligibility}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Admission Process & Entrance Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-blue-600" />
              Admission Process
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-700 leading-relaxed">
            <p>{college.admissionProcess || 'Admission based on standard national/state entrance scores and centralized counseling.'}</p>
            {entranceExams.length > 0 && (
              <div className="mt-3">
                <span className="font-semibold text-slate-800 block mb-1">Required Entrance Exams:</span>
                <div className="flex flex-wrap gap-1">
                  {entranceExams.map((ex, i) => (
                    <Badge key={i} variant="secondary" className="text-[11px] bg-blue-50 text-blue-800">{ex}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Facilities */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Campus Facilities & Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-slate-700">
            {facilities.length > 0 ? (
              facilities.map((fac, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{fac}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500">Hostels, Library, Computer Labs, Sports Complex.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
