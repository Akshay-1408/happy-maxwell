import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HeartHandshake, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react'

export default function ParentsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <HeartHandshake className="h-4 w-4" />
          <span>Parent & Family Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Supporting Your Child After 10th Standard
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          How SmartCareer helps Indian families navigate post-10th stream selection with objective information, clarity, and open communication.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-blue-600">1. Guidance, Not Force</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 leading-relaxed">
            SmartCareer presents matching streams based on your child's interest and aptitude responses. It provides a shared starting point for healthy discussions.
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-blue-600">2. Transparent Criteria</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 leading-relaxed">
            Every stream suggestion includes transparent explanations of relevant subjects, difficulty levels, entrance exams, and career outcomes.
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-blue-600">3. Financial Realism</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 leading-relaxed">
            Explore options considering government vs private institution fee structures and realistic timelines to enter each profession.
          </CardContent>
        </Card>
      </div>

      {/* Recommended Discussion Checklist */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            Post-10th Discussion Checklist for Parents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs sm:text-sm text-slate-800">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <p><strong>Review Assessment Together:</strong> Go over the top interest categories and stream recommendations without dismissing unexpected fits.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <p><strong>Discuss Subject Comfort:</strong> Ask your child which subjects they enjoy studying vs which subjects cause anxiety.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <p><strong>Explore Entrance Exam Realities:</strong> Understand competitive examination requirements (JEE, NEET, CUET, CLAT) early to avoid burn-out.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <p><strong>Consult School Counsellors:</strong> Use SmartCareer results as a reference document during school PTMs and counseling sessions.</p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link href="/assessment">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-semibold gap-2">
            Start Free Assessment With Your Child
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
