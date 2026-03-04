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

    // Get user's question stats
    const questionStats = await db.questionStat.findMany({
      where: { userId }
    })

    // Get user's quiz sessions
    const quizSessions = await db.quizSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Calculate overall stats
    const totalCorrect = questionStats.reduce((sum, s) => sum + s.correctCount, 0)
    const totalWrong = questionStats.reduce((sum, s) => sum + s.wrongCount, 0)
    const totalAnswers = totalCorrect + totalWrong
    const percentage = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0

    // Get stats by category
    const categoryStats: Record<string, { correct: number; wrong: number; total: number }> = {}
    
    for (const stat of questionStats) {
      // Extract category from questionId (first letter)
      const categoryPrefix = stat.questionId.charAt(0)
      let category = 'Sonstige'
      
      switch (categoryPrefix) {
        case 'K': category = stat.questionId.startsWith('KO') ? 'Kommunikation' : 'Konflikt'; break
        case 'F': category = 'Führung'; break
        case 'M': category = 'Motivation'; break
        case 'P': category = 'Personal'; break
        case 'B': category = 'BGM'; break
      }
      
      if (!categoryStats[category]) {
        categoryStats[category] = { correct: 0, wrong: 0, total: 0 }
      }
      categoryStats[category].correct += stat.correctCount
      categoryStats[category].wrong += stat.wrongCount
      categoryStats[category].total += stat.correctCount + stat.wrongCount
    }

    return NextResponse.json({
      totalCorrect,
      totalWrong,
      totalAnswers,
      percentage,
      categoryStats,
      recentSessions: quizSessions,
      questionCount: questionStats.length
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json({ error: 'Fehler beim Laden der Statistik' }, { status: 500 })
  }
}
