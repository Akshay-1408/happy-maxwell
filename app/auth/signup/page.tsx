'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { GraduationCap, UserPlus } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed.')
        setLoading(false)
        return
      }

      // Auto sign-in after successful registration
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      setLoading(false)

      if (signInRes?.ok) {
        router.push('/onboarding')
        router.refresh()
      } else {
        router.push('/auth/signin')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-md border-slate-200">
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-blue-600 mx-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span>SmartCareer</span>
          </Link>
          <CardTitle className="text-2xl font-bold">Create Student Account</CardTitle>
          <CardDescription className="text-xs">
            Save your assessment profile and track post-10th recommendations.
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Rohan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="rohan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password (min 8 characters)</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
              <UserPlus className="h-4 w-4" />
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or sign up with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 text-xs font-semibold"
            onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
          >
            Sign up with Google
          </Button>
        </CardContent>

        <CardFooter className="justify-center border-t py-4 text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-blue-600 font-semibold hover:underline ml-1">
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
