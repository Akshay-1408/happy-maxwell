import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span>SmartCareer</span>
            </Link>
            <p className="text-sm text-slate-400">
              AI-assisted career counseling and stream selection guidance for Indian students completing 10th standard.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/careers" className="hover:text-white transition">Career Directory</Link></li>
              <li><Link href="/pathways" className="hover:text-white transition">Education Pathways</Link></li>
              <li><Link href="/colleges" className="hover:text-white transition">College Explorer</Link></li>
              <li><Link href="/compare" className="hover:text-white transition">Compare Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Tools & Guidance</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/assessment" className="hover:text-white transition">Career Assessment</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Student Dashboard</Link></li>
              <li><Link href="/parents" className="hover:text-white transition">Parent Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Important Notice</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              SmartCareer provides career guidance information for educational exploration purposes only. It is not a replacement for professional career counseling.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SmartCareer Platform. Built for Indian post-10th students and families.</p>
        </div>
      </div>
    </footer>
  )
}
