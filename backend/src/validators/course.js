import { z } from 'zod'

export const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  fullDescription: z.string().optional(),
  category: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  isFree: z.boolean().default(false),
  price: z.number().int().positive().optional(),
  originalPrice: z.number().int().positive().optional(),
  discountEndsAt: z.coerce.date().optional(),
  promoVideoUrl: z.string().optional(),
  learningPoints: z.array(z.string()).optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  stripePriceId: z.string().optional(),
  // Admins may assign a course to a specific instructor
  instructorId: z.string().uuid().optional()
})

export const updateCourseSchema = createCourseSchema.partial()

export const createSectionSchema = z.object({
  title: z.string().min(1, 'Section title is required'),
  orderIndex: z.number().int().min(0).default(0)
})

export const createLessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required'),
  contentType: z.enum(['video', 'text', 'zoom']).default('video'),
  contentUrl: z.string().optional(),
  duration: z.number().int().min(0).optional(),
  orderIndex: z.number().int().min(0).default(0),
  isFree: z.boolean().default(false),
  zoomMeetingId: z.string().uuid().optional()
})

export const updateLessonSchema = createLessonSchema.partial()
export const updateSectionSchema = createSectionSchema.partial()
