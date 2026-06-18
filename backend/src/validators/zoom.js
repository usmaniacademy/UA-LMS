import { z } from 'zod'

export const createMeetingSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  startTime: z.string().datetime({ offset: true }).or(z.string().min(1)),
  duration: z.number().int().min(15).max(480),
  timezone: z.string().min(1, 'Timezone is required'),
  password: z.string().optional(),
  waitingRoom: z.boolean().default(true),
  autoRecording: z.boolean().default(false),
  agenda: z.string().optional()
})

export const updateMeetingSchema = createMeetingSchema.omit({ courseId: true }).partial()
