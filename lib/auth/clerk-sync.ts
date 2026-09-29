import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/db/prisma'

export interface AuthenticatedUser {
  id: string
  clerkId: string
  email: string
  name: string
  role?: string
}

/**
 * Retrieves the currently authenticated Clerk user and ensures
 * a matching Prisma User record exists in the database.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const { userId: clerkId } = auth()
    if (!clerkId) {
      return null
    }

    const clerkUser = await currentUser()
    const email =
      clerkUser?.emailAddresses?.[0]?.emailAddress ||
      `${clerkId}@clerk.user`
    const name =
      clerkUser?.fullName ||
      clerkUser?.firstName ||
      (clerkUser?.username ? `@${clerkUser.username}` : 'Student User')

    // Find or create user in Prisma DB
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: clerkId },
          { email: email },
        ],
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: clerkId,
          email,
          name,
          image: clerkUser?.imageUrl || null,
        },
      })
    }

    return {
      id: user.id,
      clerkId,
      email: user.email || email,
      name: user.name || name,
      role: user.role,
    }
  } catch (error) {
    console.error('Error resolving authenticated Clerk user:', error)
    return null
  }
}
