'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { GraduationCap, Menu, X, User, Sparkles, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-500',
        scrolled
          ? 'glass-nav shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 gap-3">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 animate-gradient-shift bg-[size:200%]" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: '0 0 20px rgba(99,102,241,0.8)' }} />
            <GraduationCap className="relative h-5 w-5 text-white z-10" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-indigo-200 transition-colors duration-200">
              Smart<span className="gradient-text-static">Career</span>
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
                  ? 'text-indigo-300 bg-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              )}
            >
              {link.name}
              {/* Animated underline */}
              <span
                className={cn(
                  'absolute bottom-0.5 left-3 right-3 h-px rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 transition-all duration-300',
                  pathname === link.href ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200">
                  <User className="h-3.5 w-3.5" />
                  Dashboard
                </button>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-slate-500 hover:text-slate-300 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/signin">
                <button className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all duration-200">
                  Sign In
                </button>
              </Link>
              <Link href="/assessment">
                <button className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-bold text-white overflow-hidden group transition-all duration-300 btn-gradient">
                  <Sparkles className="h-3.5 w-3.5 relative z-10" />
                  <span className="relative z-10">Start Assessment</span>
                  <ChevronRight className="h-3.5 w-3.5 relative z-10 -translate-x-1 group-hover:translate-x-0 transition-transform duration-200" />
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={cn('absolute inset-0 flex items-center justify-center transition-all duration-200',
            isOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
          )}>
            <X className="h-5 w-5" />
          </span>
          <span className={cn('flex items-center justify-center transition-all duration-200',
            isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
          )}>
            <Menu className="h-5 w-5" />
          </span>
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="md:hidden border-t border-white/[0.06] glass-nav px-4 pt-3 pb-6 space-y-4 animate-slide-down">
          {/* Search */}
          <div className="pt-1 pb-1">
            <GlobalSearch />
          </div>

          {/* Nav Links */}
          <div className="space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center justify-between py-2.5 px-3 text-[14px] font-semibold rounded-xl transition-all duration-200',
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
          <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2">
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-200">
                    Dashboard
                  </button>
                </Link>
                <button
                  className="w-full py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }) }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/5 transition-all duration-200">
                    Sign In
                  </button>
                </Link>
                <Link href="/assessment" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl text-sm font-bold text-white btn-gradient">
                    Start Assessment
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
