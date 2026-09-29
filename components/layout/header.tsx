'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import { GraduationCap, Menu, X, Sparkles, ChevronRight, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { GlobalSearch } from '@/components/search/global-search-modal'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Careers', href: '/careers' },
  { name: 'Pathways', href: '/pathways' },
  { name: 'Colleges', href: '/colleges' },
  { name: 'Compare', href: '/compare' },
  { name: 'AI Counselor', href: '/counselor' },
  { name: 'Parents', href: '/parents' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-[#090a0f]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 gap-3">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden border border-indigo-500/30 bg-indigo-950/60 shadow-inner group-hover:border-indigo-400/60 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-violet-600/30 to-cyan-500/20 group-hover:opacity-100 transition-opacity" />
            <GraduationCap className="relative h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition-colors z-10" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-indigo-200 transition-colors duration-200">
              Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">Career</span>
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="hidden lg:block flex-1 max-w-xs mx-4">
          <GlobalSearch />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200 group',
                pathname === link.href
                  ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              )}
            >
              {link.name}
              <span
                className={cn(
                  'absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 transition-all duration-300',
                  pathname === link.href ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Auth Actions (Clerk) */}
        <div className="hidden md:flex items-center gap-2.5">
          <SignedIn>
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-200">
                  <LayoutDashboard className="h-3.5 w-3.5 text-indigo-400" />
                  Dashboard
                </button>
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'h-8 w-8 ring-2 ring-indigo-500/40 hover:ring-indigo-400 transition-all',
                  },
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <button className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200">
                  Sign In
                </button>
              </Link>
              <Link href="/assessment">
                <button className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-bold text-white overflow-hidden group transition-all duration-300 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-md shadow-indigo-500/20 border border-indigo-400/30">
                  <Sparkles className="h-3.5 w-3.5 relative z-10 text-indigo-200" />
                  <span className="relative z-10">Start Assessment</span>
                  <ChevronRight className="h-3.5 w-3.5 relative z-10 -translate-x-1 group-hover:translate-x-0 transition-transform duration-200" />
                </button>
              </Link>
            </div>
          </SignedOut>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0c0e17]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 shadow-2xl">
          {/* Search */}
          <div className="pt-1 pb-1">
            <GlobalSearch />
          </div>

          {/* Nav Links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center justify-between py-2 px-3 text-[14px] font-medium rounded-xl transition-all duration-200',
                  pathname === link.href
                    ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                {link.name}
                {pathname === link.href && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
            <SignedIn>
              <div className="flex items-center justify-between px-2 py-1">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <LayoutDashboard className="h-4 w-4 text-indigo-400" />
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/5 transition-all duration-200">
                  Sign In
                </button>
              </Link>
              <Link href="/assessment" onClick={() => setIsOpen(false)}>
                <button className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
                  Start Assessment
                </button>
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  )
}
