import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

// Get premium status for all users
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

    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isPremium: true,
        premiumSince: true,
        createdAt: true,
        _count: { select: { questionStats: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get question counts
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const stats = await db.questionStat.aggregate({
          where: { userId: u.id },
          _sum: { correctCount: true, wrongCount: true }
        })
        const total = (stats._sum.correctCount || 0) + (stats._sum.wrongCount || 0)
        return { ...u, questionsAnswered: total }
      })
    )

    return NextResponse.json({ users: usersWithStats })
  } catch (error) {
    console.error('Premium list error:', error)
    return NextResponse.json({ error: 'Fehler beim Laden' }, { status: 500 })
  }
}

// Toggle premium status
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const adminId = cookieStore.get('session')?.value

    if (!adminId) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
    }

    // Check if user is admin
    const admin = await db.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    })

    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const body = await request.json()
    const { targetUserId, isPremium } = body

    if (!targetUserId) {
      return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 })
    }

    const updatedUser = await db.user.update({
      where: { id: targetUserId },
      data: {
        isPremium: isPremium,
        premiumSince: isPremium ? new Date() : null
      },
      select: {
        id: true,
        email: true,
        name: true,
        isPremium: true,
        premiumSince: true
      }
    })

    // Log usage
    await db.usageLog.create({
      data: {
        userId: adminId,
        action: isPremium ? 'premium_activated' : 'premium_deactivated',
        metadata: JSON.stringify({ targetUserId, targetEmail: updatedUser.email })
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Premium toggle error:', error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren' }, { status: 500 })
  }
}
