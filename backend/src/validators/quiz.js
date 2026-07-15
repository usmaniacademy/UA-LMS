import { z } from 'zod'

export const createQuizSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  passPercentage: z.number().int().min(1).max(100).default(70)
})

export const updateQuizSchema = createQuizSchema.partial()

export const createQuestionSchema = z.object({
  questionText: z.string().min(2, 'Question text is required'),
  options: z.array(z.string().min(1)).min(2, 'At least 2 options required').max(6, 'At most 6 options'),
  correctAnswer: z.string().min(1)
})

export const updateQuestionSchema = createQuestionSchema.partial()

export const submitAttemptSchema = z.object({
  answers: z.record(z.string(), z.string()).default({})
})
