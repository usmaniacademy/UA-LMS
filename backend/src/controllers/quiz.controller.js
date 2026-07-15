import * as QuizService from '../services/quiz.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// ─── Instructor / Admin ─────────────────────────────────────────────────────

export const listQuizzesForManage = asyncHandler(async (req, res) => {
  const quizzes = await QuizService.listQuizzesForManage(req.params.courseId, req.user.id, req.user.role === 'admin')
  res.json({ quizzes })
})

export const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await QuizService.createQuiz(req.params.courseId, req.user.id, req.body, req.user.role === 'admin')
  res.status(201).json({ message: 'Quiz created', quiz })
})

export const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await QuizService.updateQuiz(req.params.quizId, req.user.id, req.body, req.user.role === 'admin')
  res.json({ message: 'Quiz updated', quiz })
})

export const deleteQuiz = asyncHandler(async (req, res) => {
  await QuizService.deleteQuiz(req.params.quizId, req.user.id, req.user.role === 'admin')
  res.json({ message: 'Quiz deleted' })
})

export const addQuestion = asyncHandler(async (req, res) => {
  const question = await QuizService.addQuestion(req.params.quizId, req.user.id, req.body, req.user.role === 'admin')
  res.status(201).json({ message: 'Question added', question })
})

export const updateQuestion = asyncHandler(async (req, res) => {
  const question = await QuizService.updateQuestion(req.params.questionId, req.user.id, req.body, req.user.role === 'admin')
  res.json({ message: 'Question updated', question })
})

export const deleteQuestion = asyncHandler(async (req, res) => {
  await QuizService.deleteQuestion(req.params.questionId, req.user.id, req.user.role === 'admin')
  res.json({ message: 'Question deleted' })
})

export const listInstructorQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await QuizService.listInstructorQuizzes(req.user.id)
  res.json({ quizzes })
})

// ─── Student ──────────────────────────────────────────────────────────────────

export const listMyQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await QuizService.listMyQuizzes(req.user.id)
  res.json({ quizzes })
})

export const submitAttempt = asyncHandler(async (req, res) => {
  const result = await QuizService.submitAttempt(req.params.quizId, req.user.id, req.body.answers || {})
  res.status(201).json(result)
})
