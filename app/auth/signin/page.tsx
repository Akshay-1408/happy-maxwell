'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { GraduationCap, LogIn } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Invalid email or password.')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-md border-slate-200">
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-blue-600 mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span>SmartCareer</span>
          </Link>
          <CardTitle className="text-2xl font-bold">Sign In to Your Account</CardTitle>
          <CardDescription className="text-xs">
            Access your saved assessment results, profile, and career action plan.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
              <LogIn className="h-4 w-4" />
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 text-xs font-semibold"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          >
            Sign in with Google
          </Button>
        </CardContent>

        <CardFooter className="justify-center border-t py-4 text-xs text-slate-500">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-600 font-semibold hover:underline ml-1">
            Sign Up
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
