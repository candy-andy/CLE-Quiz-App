import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('session')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
    }

    const body = await request.json()
    const { mode, category, totalQuestions, correctAnswers, duration, questionResults } = body

    // Create quiz session
    const quizSession = await db.quizSession.create({
      data: {
        userId,
        mode: mode || 'lern',
        category: category || null,
        totalQuestions: totalQuestions || 0,
        correctAnswers: correctAnswers || 0,
        percentage: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
        duration: duration || 0
      }
    })

    // Save individual question stats
    if (questionResults && Array.isArray(questionResults)) {
      for (const result of questionResults) {
        const existing = await db.questionStat.findUnique({
          where: {
            userId_questionId: {
              userId,
              questionId: result.questionId
            }
          }
        })

        if (existing) {
          await db.questionStat.update({
            where: { id: existing.id },
            data: {
              correctCount: existing.correctCount + (result.correct ? 1 : 0),
              wrongCount: existing.wrongCount + (result.correct ? 0 : 1),
              lastAnswered: new Date(),
              updatedAt: new Date()
            }
          })
        } else {
          await db.questionStat.create({
            data: {
              userId,
              questionId: result.questionId,
              correctCount: result.correct ? 1 : 0,
              wrongCount: result.correct ? 0 : 1,
              lastAnswered: new Date(),
              quizSessionId: quizSession.id
            }
          })
        }
      }
    }

    // Log usage
    await db.usageLog.create({
      data: {
        userId,
        action: 'quiz_complete',
        metadata: JSON.stringify({
          mode,
          category,
          percentage: quizSession.percentage
        })
      }
    })

    return NextResponse.json({ success: true, sessionId: quizSession.id })
  } catch (error) {
    console.error('Save quiz error:', error)
    return NextResponse.json({ error: 'Fehler beim Speichern' }, { status: 500 })
  }
}
