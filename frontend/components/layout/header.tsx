'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { GraduationCap, Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Careers', href: '/careers' },
    { name: 'Pathways', href: '/pathways' },
    { name: 'Colleges', href: '/colleges' },
    { name: 'Compare', href: '/compare' },
    { name: 'Parents', href: '/parents' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="tracking-tight text-slate-900">Smart<span className="text-blue-600">Career</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-blue-600',
                pathname === link.href ? 'text-blue-600 font-semibold' : 'text-slate-600'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={() => signOut({ callbackUrl: '/' })}>
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/assessment">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Start Assessment
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="md:hidden border-b bg-white px-4 pt-2 pb-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'block py-2 text-base font-medium transition-colors',
                pathname === link.href ? 'text-blue-600 font-semibold' : 'text-slate-600'
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t flex flex-col gap-2">
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full" onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }) }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/assessment" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Assessment
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
