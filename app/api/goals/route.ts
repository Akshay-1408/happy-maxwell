import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/clerk-sync'
import prisma from '@/lib/db/prisma'
import { StudentGoalSchema } from '@/lib/validation/schemas'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user?.id) {
      return NextResponse.json([])
    }

    const goals = await prisma.studentGoal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Fetch goals error:', error)
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = StudentGoalSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0]?.message || 'Invalid input' }, { status: 400 })
    }

    const data = validated.data
    const goal = await prisma.studentGoal.create({
      data: {
        userId: user.id,
        title: data.title,
        timeframe: data.timeframe,
        category: data.category,
        completed: data.completed,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Create goal error:', error)
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { goalId, completed } = await req.json()
    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID required' }, { status: 400 })
    }

    const updated = await prisma.studentGoal.updateMany({
      where: {
        id: goalId,
        userId: user.id,
      },
      data: {
        completed: !!completed,
        completedAt: completed ? new Date() : null,
      },
    })

    return NextResponse.json({ success: true, updated })
  } catch (error) {
    console.error('Update goal error:', error)
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const goalId = searchParams.get('id')
    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID required' }, { status: 400 })
    }

    await prisma.studentGoal.deleteMany({
      where: {
        id: goalId,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete goal error:', error)
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 })
  }
}
