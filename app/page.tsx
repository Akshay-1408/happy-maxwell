import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { GraduationCap, ArrowRight, CheckCircle2, Compass, ShieldCheck, HeartHandshake, HelpCircle } from 'lucide-react'

export default function LandingPage() {
  const streams = [
    {
      name: 'Science (PCM)',
      desc: 'Physics, Chemistry, Mathematics. Ideal for engineering, computer science, physical sciences, and architecture.',
      careers: ['Software Engineer', 'Data Analyst', 'Mechanical Engineer', 'Architect'],
      link: '/pathways/science-pcm',
    },
    {
      name: 'Science (PCB)',
      desc: 'Physics, Chemistry, Biology. Ideal for medicine, nursing, pharmacy, biotechnology, and life sciences.',
      careers: ['Doctor (MBBS)', 'Nurse', 'Pharmacist', 'Biotechnology Specialist'],
      link: '/pathways/science-pcb',
    },
    {
      name: 'Commerce',
      desc: 'Accountancy, Business Studies, Economics. Ideal for finance, CA, management, law, and entrepreneurship.',
      careers: ['Chartered Accountant', 'Financial Analyst', 'Entrepreneur', 'Company Secretary'],
      link: '/pathways/commerce-with-math',
    },
    {
      name: 'Arts & Humanities',
      desc: 'History, Political Science, Sociology, Psychology. Ideal for law, civil services, media, design, and teaching.',
      careers: ['Lawyer / Advocate', 'Civil Services Officer', 'Psychologist', 'Journalist'],
      link: '/pathways/arts-humanities',
    },
    {
      name: 'Diploma (Polytechnic)',
      desc: 'Practical technical education after 10th. Allows direct entry into technical jobs or lateral degree admission.',
      careers: ['Diploma Engineer', 'Lab Technician', 'CAD Specialist'],
      link: '/pathways/diploma-engineering',
    },
    {
      name: 'Vocational / ITI',
      desc: 'Skill-focused trade certificates after 10th for hands-on technical trades and immediate job readiness.',
      careers: ['Electrician', 'Mechanic', 'Graphic Technician'],
      link: '/pathways/vocational-iti',
    },
  ]

  const faqs = [
    {
      q: 'Is this a guaranteed prediction of the right career?',
      a: 'No. SmartCareer provides guidance based on your responses, academic interests, and aptitude. It is designed to broaden your options and help you make informed decisions, not dictate your choices.',
    },
    {
      q: 'Which students should use SmartCareer?',
      a: 'Students currently in 10th standard, those about to complete 10th, or students who recently finished 10th and are deciding on higher secondary stream selection (11th & 12th).',
    },
    {
      q: 'Is SmartCareer free to use?',
      a: 'Yes! The core career assessment, pathway explorer, and career directory are completely free to use.',
    },
    {
      q: 'Can I retake the assessment if my interests change?',
      a: 'Absolutely. You can retake the assessment at any time from your student dashboard as your preferences or academic goals evolve.',
    },
    {
      q: 'How are recommendations calculated?',
      a: 'Recommendations use a multidimensional scoring engine that combines your responses across interests, self-reported aptitudes, subject preferences, and work style preferences.',
    },
  ]

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24 border-b">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <Compass className="h-3.5 w-3.5" />
                <span>Guidance for Indian Students After 10th</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Your Career Starts <span className="text-blue-600">After 10th.</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                Explore education streams, career pathways, and options suited to your academic performance, subject interests, and long-term goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/assessment">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 gap-2 font-semibold">
                    Start Career Assessment
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/careers">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Explore Careers
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-slate-500">
                Takes ~10 minutes · Free · No sign-up required to start
              </p>
            </div>

            {/* Illustrative Flow Graphic */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-center text-sm uppercase tracking-wider">
                The 10th Standard Journey
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium">
                <div className="p-3 bg-white rounded-lg border shadow-xs">
                  <div className="text-blue-600 font-bold mb-1">10th Class</div>
                  <span className="text-slate-500 text-[11px]">Academic Baseline</span>
                </div>
                <div className="flex items-center justify-center font-bold text-slate-400">
                  →
                </div>
                <div className="p-3 bg-blue-600 text-white rounded-lg shadow-xs">
                  <div className="font-bold mb-1">Stream / Pathway</div>
                  <span className="text-blue-100 text-[11px]">PCM, PCB, Commerce, Arts</span>
                </div>
              </div>
              <div className="text-center font-bold text-slate-400">↓</div>
              <div className="p-4 bg-white rounded-lg border text-center shadow-xs">
                <div className="font-bold text-slate-900 mb-1">20+ Career Options</div>
                <p className="text-slate-500 text-xs">
                  Software, Medicine, CA, Design, Public Services & more
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900">How SmartCareer Works</h2>
          <p className="text-slate-600 mt-2">
            A simple 4-step process designed to help you make confident education choices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Share Profile', desc: 'Input your 10th board, marks, and subject preferences.' },
            { step: '02', title: 'Take Assessment', desc: 'Answer questions on interests, aptitudes, and work style.' },
            { step: '03', title: 'View Recommendations', desc: 'See personalized matching streams and careers explained.' },
            { step: '04', title: 'Compare & Plan', desc: 'Explore career details, compare options, and build an action plan.' },
          ].map((item, idx) => (
            <Card key={idx} className="relative overflow-hidden border-slate-200">
              <CardHeader>
                <span className="text-3xl font-black text-blue-100 mb-1 block">{item.step}</span>
                <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                <CardDescription className="text-xs mt-1">{item.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Streams Overview Section */}
      <section className="bg-slate-100 py-16 border-y">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Explore Education Streams</h2>
            <p className="text-slate-600 mt-2">
              Understand the core options available after 10th standard in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {streams.map((stream, idx) => (
              <Card key={idx} className="flex flex-col justify-between bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-blue-600">{stream.name}</CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">{stream.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">Leads to careers like:</span>
                  <div className="flex flex-wrap gap-1">
                    {stream.careers.map((c, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/pathways">
              <Button variant="outline" className="gap-2 font-semibold">
                Explore All Pathways
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Parent Friendly Section */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="bg-blue-900 text-white rounded-2xl p-8 sm:p-12 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-800 px-3 py-1 text-xs font-medium text-blue-200">
              <HeartHandshake className="h-4 w-4" />
              <span>For Parents & Guardians</span>
            </div>
            <h2 className="text-3xl font-bold">Informed Conversations, Not Pressure</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              SmartCareer provides clear explanations for WHY certain streams match your child's interest profile. Review options together with objective information on subjects, entrance exams, and career pathways.
            </p>
            <div className="pt-2">
              <Link href="/parents">
                <Button className="bg-white text-blue-900 hover:bg-blue-50 font-semibold gap-2">
                  Read Parent Guide
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="space-y-3 bg-blue-800/60 p-6 rounded-xl border border-blue-700 text-xs leading-relaxed text-blue-100">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-300 shrink-0 mt-0.5" />
              <p>Transparent match explanations based on student input</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-300 shrink-0 mt-0.5" />
              <p>Details on financial commitment and college options</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-300 shrink-0 mt-0.5" />
              <p>Encourages healthy parent-child alignment</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-sm mb-1">
            <HelpCircle className="h-4 w-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger className="text-left font-semibold text-slate-800">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-10 space-y-4 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900">Ready to Explore Your Future?</h3>
          <p className="text-slate-600 text-sm">
            Take the 10-minute assessment to discover streams and careers tailored to your profile.
          </p>
          <Link href="/assessment" className="inline-block">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-semibold gap-2">
              Start Free Assessment Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
