import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ToastProvider } from '@/components/ui/toaster'
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SmartCareer — AI-Assisted Career Counseling After 10th Standard',
  description:
    'Discover the right education stream and career path after 10th standard based on academic performance, subject interests, aptitude, and goals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#6366f1',
          colorBackground: '#0e111a',
          colorText: '#f1f5f9',
          colorInputBackground: '#08090d',
          colorInputText: '#ffffff',
          borderRadius: '0.75rem',
        },
      }}
    >
      <html lang="en" className={`${plusJakartaSans.variable} ${dmSans.variable} dark`}>
        <body className={`${plusJakartaSans.className} antialiased bg-[#090a0f] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200`}>
          <SmoothScrollProvider>
            <div className="flex min-h-screen flex-col bg-[#090a0f] text-slate-100 relative">
              <Header />
              <main className="flex-1 relative z-10">{children}</main>
              <Footer />
            </div>
            <ToastProvider />
          </SmoothScrollProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
