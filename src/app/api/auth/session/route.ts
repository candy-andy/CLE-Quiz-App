import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) {
      return NextResponse.json({ user: null })
    }

    const user = await db.user.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isPremium: true,
        premiumSince: true,
        createdAt: true,
        _count: {
          select: { questionStats: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ user: null })
    }

    // Count total questions answered
    const totalAnswered = await db.questionStat.aggregate({
      where: { userId: user.id },
      _sum: {
        correctCount: true,
        wrongCount: true
      }
    })

    const questionsAnswered = (totalAnswered._sum.correctCount || 0) + (totalAnswered._sum.wrongCount || 0)

    return NextResponse.json({ 
      user: {
        ...user,
        questionsAnswered
      }
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ user: null })
  }
}
