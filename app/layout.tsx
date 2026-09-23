import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ToastProvider } from '@/components/ui/toaster'
import { SessionProviderWrapper } from '@/components/auth/session-provider'

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
  description: 'Discover the right education stream and career path after 10th standard based on academic performance, subject interests, aptitude, and goals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${dmSans.variable}`}>
      <body className={`${plusJakartaSans.className} antialiased`}>
        <SessionProviderWrapper>
          <div className="flex min-h-screen flex-col bg-[#0f0e17] text-slate-100">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ToastProvider />
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
