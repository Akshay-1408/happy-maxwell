import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { GraduationCap, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Sign In | SmartCareer',
  description: 'Sign in to access your personalized career assessment results, saved colleges, and stream roadmap.',
}

export default function SignInPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden bg-[#090a0f]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Secure Student Access</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/10">
            <GraduationCap className="h-7 w-7 text-indigo-300" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Welcome Back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">SmartCareer</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Log in to view your career assessment results, saved colleges, and personalized roadmaps.
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-[#121624]/90 border border-white/[0.08] shadow-2xl shadow-black/80 backdrop-blur-xl rounded-2xl p-6 text-slate-100',
                headerTitle: 'text-white font-bold text-lg',
                headerSubtitle: 'text-slate-400 text-xs',
                socialButtonsBlockButton: 'bg-[#1a2035] hover:bg-[#222b45] border border-white/10 text-white font-medium text-xs rounded-xl py-2.5 transition-all duration-200',
                socialButtonsBlockButtonText: 'text-slate-200 font-medium text-xs',
                dividerLine: 'bg-white/10',
                dividerText: 'text-slate-500 text-xs uppercase font-semibold',
                formFieldLabel: 'text-slate-300 text-xs font-semibold',
                formFieldInput: 'bg-[#0b0e18] border-white/10 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm py-2.5',
                formButtonPrimary: 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200',
                footerActionLink: 'text-indigo-400 hover:text-indigo-300 font-semibold text-xs',
                footerActionText: 'text-slate-400 text-xs',
                identityPreviewText: 'text-slate-200',
                identityPreviewEditButtonIcon: 'text-indigo-400',
              },
            }}
          />
        </div>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Encrypted authentication & zero spam</span>
        </div>
      </div>
    </div>
  )
}
