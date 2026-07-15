import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import * as ctrl from '../controllers/quiz.controller.js'
import {
  createQuizSchema, updateQuizSchema,
  createQuestionSchema, updateQuestionSchema,
  submitAttemptSchema
} from '../validators/quiz.js'

const router = Router()

// ─── Student ──────────────────────────────────────────────────────────────────
router.get('/student/my-quizzes', authenticate, authorize('student'), ctrl.listMyQuizzes)
router.post('/:quizId/attempt', authenticate, authorize('student'), validate(submitAttemptSchema), ctrl.submitAttempt)

// ─── Instructor / Admin authoring ──────────────────────────────────────────────
router.get('/instructor/my-quizzes', authenticate, authorize('instructor'), ctrl.listInstructorQuizzes)
router.get('/courses/:courseId/manage', authenticate, authorize('instructor', 'admin'), ctrl.listQuizzesForManage)
router.post('/courses/:courseId', authenticate, authorize('instructor', 'admin'), validate(createQuizSchema), ctrl.createQuiz)
router.put('/:quizId', authenticate, authorize('instructor', 'admin'), validate(updateQuizSchema), ctrl.updateQuiz)
router.delete('/:quizId', authenticate, authorize('instructor', 'admin'), ctrl.deleteQuiz)

router.post('/:quizId/questions', authenticate, authorize('instructor', 'admin'), validate(createQuestionSchema), ctrl.addQuestion)
router.put('/questions/:questionId', authenticate, authorize('instructor', 'admin'), validate(updateQuestionSchema), ctrl.updateQuestion)
router.delete('/questions/:questionId', authenticate, authorize('instructor', 'admin'), ctrl.deleteQuestion)

export default router
