import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('session')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    // Get all users with detailed stats
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        quizSessions: {
          select: {
            percentage: true,
            mode: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            quizSessions: true,
            questionStats: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get question stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const stats = await db.questionStat.aggregate({
          where: { userId: u.id },
          _sum: {
            correctCount: true,
            wrongCount: true
          }
        })

        const totalCorrect = stats._sum.correctCount || 0
        const totalWrong = stats._sum.wrongCount || 0
        const total = totalCorrect + totalWrong
        const percentage = total > 0 ? Math.round((totalCorrect / total) * 100) : 0

        return {
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          createdAt: u.createdAt,
          sessionCount: u._count.quizSessions,
          questionCount: u._count.questionStats,
          totalCorrect,
          totalWrong,
          percentage,
          recentSessions: u.quizSessions
        }
      })
    )

    return NextResponse.json({ users: usersWithStats })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'Fehler beim Laden der Benutzer' }, { status: 500 })
  }
}

// Update user role
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('session')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const body = await request.json()
    const { targetUserId, role } = body

    if (!targetUserId || !role) {
      return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 })
    }

    const updatedUser = await db.user.update({
      where: { id: targetUserId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren' }, { status: 500 })
  }
}
