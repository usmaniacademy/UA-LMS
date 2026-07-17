import { z } from 'zod'

export const createBlogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens').optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  authorName: z.string().optional()
})

export const updateBlogPostSchema = createBlogPostSchema.partial()

export const uploadImageSchema = z.object({
  // data URL, e.g. "data:image/jpeg;base64,...."
  dataUrl: z.string().regex(/^data:image\/(jpeg|png|webp|gif);base64,/, 'Must be a base64 image data URL'),
  filename: z.string().optional()
})
