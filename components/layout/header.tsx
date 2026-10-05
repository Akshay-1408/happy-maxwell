'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { GraduationCap, Menu, X, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { GlobalSearch } from '@/components/search/global-search-modal'

const navLinks = [
  { name: 'Careers',    href: '/careers' },
  { name: 'Pathways',   href: '/pathways' },
  { name: 'Colleges',   href: '/colleges' },
  { name: 'Compare',    href: '/compare' },
  { name: 'AI Counselor', href: '/counselor' },
  { name: 'For Parents', href: '/parents' },
]

export function Header() {
  const [isOpen, setIsOpen]   = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
          : 'bg-white border-b border-slate-200'
      )}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 gap-4">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm group-hover:bg-blue-700 transition-colors">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          <span className="font-bold text-[17px] tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
            Smart<span className="text-blue-600">Career</span>
          </span>
        </Link>

        {/* Search — desktop */}
        <div className="hidden lg:block flex-1 max-w-xs">
          <GlobalSearch />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors duration-150',
                pathname === link.href
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth — desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <SignedIn>
            <Link href="/dashboard">
              <button className="btn-ghost flex items-center gap-1.5 text-[13px]">
                <LayoutDashboard className="h-3.5 w-3.5 text-blue-600" />
                Dashboard
              </button>
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: 'h-7 w-7 ring-2 ring-blue-200',
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in">
              <button className="btn-ghost text-[13px]">Sign In</button>
            </Link>
            <Link href="/assessment">
              <button className="btn-primary text-[13px] px-4 py-1.5">
                Get Started
              </button>
            </Link>
          </SignedOut>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-5 pt-3 space-y-4 shadow-lg">
          <GlobalSearch />

          <div className="space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center py-2 px-3 text-sm font-medium rounded-md transition-colors',
                  pathname === link.href
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <SignedIn>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                <button className="w-full flex items-center gap-2 py-2 px-3 text-sm font-semibold text-slate-700 rounded-md hover:bg-slate-50">
                  <LayoutDashboard className="h-4 w-4 text-blue-600" />
                  Dashboard
                </button>
              </Link>
              <div className="px-3">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                <button className="btn-secondary w-full justify-center">Sign In</button>
              </Link>
              <Link href="/assessment" onClick={() => setIsOpen(false)}>
                <button className="btn-primary w-full justify-center">Get Started</button>
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  )
}
