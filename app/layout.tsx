import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ToastProvider } from '@/components/ui/toaster'
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SmartCareer — AI Career Guidance for 10th Standard Students',
  description:
    'Find the right stream and career path after 10th standard. Data-backed guidance based on your marks, interests, and goals.',
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
          colorPrimary: '#2563eb',
          colorBackground: '#ffffff',
          colorText: '#0f172a',
          colorInputBackground: '#f8fafc',
          colorInputText: '#0f172a',
          borderRadius: '0.625rem',
        },
      }}
    >
      <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
        <body
          className={`${inter.className} antialiased bg-[#f8fafc] text-slate-900 selection:bg-blue-100 selection:text-blue-900`}
        >
          <SmoothScrollProvider>
            <div className="flex min-h-screen flex-col bg-[#f8fafc]">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <ToastProvider />
          </SmoothScrollProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
