import prisma from '../config/prisma.js'
import { ApiError } from '../utils/ApiError.js'

async function assertCourseOwner(courseId, userId, isAdmin) {
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw ApiError.notFound('Course not found')
  if (!isAdmin && course.instructorId !== userId) throw ApiError.forbidden()
  return course
}

async function assertQuizOwner(quizId, userId, isAdmin) {
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { course: true } })
  if (!quiz) throw ApiError.notFound('Quiz not found')
  if (!isAdmin && quiz.course.instructorId !== userId) throw ApiError.forbidden()
  return quiz
}

async function assertQuestionOwner(questionId, userId, isAdmin) {
  const question = await prisma.quizQuestion.findUnique({
    where: { id: questionId },
    include: { quiz: { include: { course: true } } }
  })
  if (!question) throw ApiError.notFound('Question not found')
  if (!isAdmin && question.quiz.course.instructorId !== userId) throw ApiError.forbidden()
  return question
}

// ─── Instructor / Admin authoring ──────────────────────────────────────────────

export async function listQuizzesForManage(courseId, userId, isAdmin) {
  await assertCourseOwner(courseId, userId, isAdmin)
  return prisma.quiz.findMany({
    where: { courseId },
    orderBy: { createdAt: 'asc' },
    include: { questions: { orderBy: { createdAt: 'asc' } } }
  })
}

export async function createQuiz(courseId, userId, data, isAdmin) {
  await assertCourseOwner(courseId, userId, isAdmin)
  return prisma.quiz.create({
    data: { courseId, title: data.title, passPercentage: data.passPercentage ?? 70 },
    include: { questions: true }
  })
}

export async function updateQuiz(quizId, userId, data, isAdmin) {
  await assertQuizOwner(quizId, userId, isAdmin)
  return prisma.quiz.update({ where: { id: quizId }, data })
}

export async function deleteQuiz(quizId, userId, isAdmin) {
  await assertQuizOwner(quizId, userId, isAdmin)
  return prisma.quiz.delete({ where: { id: quizId } })
}

export async function addQuestion(quizId, userId, data, isAdmin) {
  await assertQuizOwner(quizId, userId, isAdmin)
  if (!data.options.includes(data.correctAnswer)) {
    throw ApiError.badRequest('Correct answer must be one of the options')
  }
  return prisma.quizQuestion.create({
    data: { quizId, questionText: data.questionText, options: data.options, correctAnswer: data.correctAnswer }
  })
}

export async function updateQuestion(questionId, userId, data, isAdmin) {
  const question = await assertQuestionOwner(questionId, userId, isAdmin)
  const options = data.options || question.options
  const correctAnswer = data.correctAnswer || question.correctAnswer
  if (!options.includes(correctAnswer)) {
    throw ApiError.badRequest('Correct answer must be one of the options')
  }
  return prisma.quizQuestion.update({ where: { id: questionId }, data })
}

export async function deleteQuestion(questionId, userId, isAdmin) {
  await assertQuestionOwner(questionId, userId, isAdmin)
  return prisma.quizQuestion.delete({ where: { id: questionId } })
}

export async function listInstructorQuizzes(instructorId) {
  return prisma.quiz.findMany({
    where: { course: { instructorId } },
    orderBy: { createdAt: 'desc' },
    include: {
      course: { select: { id: true, title: true } },
      questions: { select: { id: true } },
      attempts: { select: { id: true, score: true, passed: true } }
    }
  })
}

// ─── Student ────────────────────────────────────────────────────────────────────

async function assertEnrolled(studentId, courseId) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } }
  })
  if (!enrollment) throw ApiError.forbidden('You must be enrolled in this course to access its quizzes')
  return enrollment
}

export async function listMyQuizzes(studentId) {
  const enrollments = await prisma.enrollment.findMany({ where: { studentId }, select: { courseId: true } })
  const courseIds = enrollments.map((e) => e.courseId)
  if (!courseIds.length) return []

  return prisma.quiz.findMany({
    where: { courseId: { in: courseIds } },
    orderBy: { createdAt: 'asc' },
    include: {
      course: { select: { id: true, title: true, slug: true } },
      // Never expose correctAnswer to students
      questions: { select: { id: true, questionText: true, options: true } },
      attempts: { where: { studentId }, orderBy: { takenAt: 'desc' } }
    }
  })
}

export async function submitAttempt(quizId, studentId, answers) {
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { questions: true } })
  if (!quiz) throw ApiError.notFound('Quiz not found')
  await assertEnrolled(studentId, quiz.courseId)
  if (!quiz.questions.length) throw ApiError.badRequest('This quiz has no questions yet')

  let correctCount = 0
  for (const q of quiz.questions) {
    if (answers[q.id] === q.correctAnswer) correctCount++
  }
  const score = Math.round((correctCount / quiz.questions.length) * 100)
  const passed = score >= quiz.passPercentage

  const attempt = await prisma.quizAttempt.create({ data: { studentId, quizId, score, passed } })

  return { attempt, score, passed, correctCount, total: quiz.questions.length }
}
