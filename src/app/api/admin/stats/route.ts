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

    // Get all users with their stats
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            quizSessions: true,
            questionStats: true,
            usageLogs: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get total quiz sessions
    const totalSessions = await db.quizSession.count()

    // Get total questions answered
    const totalQuestionsAnswered = await db.questionStat.aggregate({
      _sum: {
        correctCount: true,
        wrongCount: true
      }
    })

    // Get recent activity
    const recentActivity = await db.usageLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    // Get daily active users (last 24h)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const dailyActiveUsers = await db.usageLog.groupBy({
      by: ['userId'],
      where: {
        createdAt: { gte: yesterday }
      }
    })

    // Get weekly stats
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weeklySessions = await db.quizSession.count({
      where: {
        createdAt: { gte: weekAgo }
      }
    })

    return NextResponse.json({
      totalUsers: users.length,
      totalSessions,
      totalCorrect: totalQuestionsAnswered._sum.correctCount || 0,
      totalWrong: totalQuestionsAnswered._sum.wrongCount || 0,
      dailyActiveUsers: dailyActiveUsers.length,
      weeklySessions,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: u.createdAt,
        sessionCount: u._count.quizSessions,
        questionCount: u._count.questionStats,
        activityCount: u._count.usageLogs
      })),
      recentActivity: recentActivity.map(a => ({
        userId: a.userId,
        userName: a.user?.name || a.user?.email,
        action: a.action,
        metadata: a.metadata,
        createdAt: a.createdAt
      }))
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Fehler beim Laden der Admin-Statistik' }, { status: 500 })
  }
}
