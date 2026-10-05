import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg text-white">SmartCareer</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Career guidance for students after 10th standard. Understand your options, not just your ranks.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/careers"   className="hover:text-white transition-colors">Career Directory</Link></li>
              <li><Link href="/pathways"  className="hover:text-white transition-colors">Education Pathways</Link></li>
              <li><Link href="/colleges"  className="hover:text-white transition-colors">College Explorer</Link></li>
              <li><Link href="/compare"   className="hover:text-white transition-colors">Compare Careers</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Tools</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/assessment" className="hover:text-white transition-colors">Career Assessment</Link></li>
              <li><Link href="/counselor"  className="hover:text-white transition-colors">AI Counselor</Link></li>
              <li><Link href="/dashboard"  className="hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><Link href="/parents"    className="hover:text-white transition-colors">Parent Guide</Link></li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Notice</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              SmartCareer is a decision-support tool, not a replacement for professional career counseling. Always discuss major decisions with qualified counselors and family.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} SmartCareer. Built for Indian post-10th students and families.
        </div>
      </div>
    </footer>
  )
}
