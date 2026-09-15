import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ToastProvider } from '@/components/ui/toaster'
import { SessionProviderWrapper } from '@/components/auth/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SmartCareer - AI-Assisted Career Counseling After 10th Standard',
  description: 'Discover the right education stream and career path after 10th standard based on academic performance, subject interests, aptitude, and goals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
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
