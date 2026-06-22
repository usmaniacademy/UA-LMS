import prisma from '../config/prisma.js'
import { ApiError } from '../utils/ApiError.js'

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function uniqueSlug(title, excludeId = null) {
  const base = slugify(title)
  let slug = base
  let counter = 1
  while (true) {
    const existing = await prisma.course.findUnique({ where: { slug } })
    if (!existing || existing.id === excludeId) break
    slug = `${base}-${counter++}`
  }
  return slug
}

// ─── Public ───────────────────────────────────────────────────────────────────

export async function listPublishedCourses({ category, level, search, page = 1, limit = 12 } = {}) {
  const where = {
    status: 'published',
    isPublished: true,
    ...(category && { category }),
    ...(level && { level }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    })
  }

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, slug: true, description: true,
        thumbnailUrl: true, category: true, level: true,
        isFree: true, totalStudents: true, ratingAvg: true,
        instructor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }
      }
    }),
    prisma.course.count({ where })
  ])

  return { courses, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getCourseBySlug(slug, userId = null) {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, bio: true } },
      sections: {
        orderBy: { orderIndex: 'asc' },
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' },
            select: { id: true, title: true, contentType: true, duration: true, orderIndex: true, isFree: true, contentUrl: true }
          }
        }
      },
      reviews: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { student: { select: { firstName: true, lastName: true, avatarUrl: true } } }
      },
      _count: { select: { enrollments: true } }
    }
  })

  if (!course || !course.isPublished) throw ApiError.notFound('Course not found')

  // Check enrollment for authenticated user
  let isEnrolled = false
  if (userId) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: userId, courseId: course.id } }
    })
    isEnrolled = !!enrollment
  }

  // Hide lesson content URLs for locked lessons
  const sectionsWithAccess = course.sections.map((section) => ({
    ...section,
    lessons: section.lessons.map((lesson) => ({
      ...lesson,
      contentUrl: lesson.isFree || isEnrolled ? lesson.contentUrl : null
    }))
  }))

  return { ...course, sections: sectionsWithAccess, isEnrolled }
}

// ─── Instructor ───────────────────────────────────────────────────────────────

export async function getInstructorCourses(instructorId, { search, status } = {}) {
  return prisma.course.findMany({
    where: {
      instructorId,
      ...(status && { status }),
      ...(search && { title: { contains: search, mode: 'insensitive' } })
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, title: true, slug: true, thumbnailUrl: true,
      category: true, level: true, status: true, isPublished: true,
      isFree: true, totalStudents: true, ratingAvg: true, createdAt: true,
      _count: { select: { enrollments: true } }
    }
  })
}

export async function createCourse(instructorId, data) {
  const slug = await uniqueSlug(data.title)
  return prisma.course.create({
    data: { ...data, instructorId, slug },
    select: { id: true, title: true, slug: true, status: true, createdAt: true }
  })
}

export async function updateCourse(courseId, instructorId, data, isAdmin = false) {
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw ApiError.notFound('Course not found')
  if (!isAdmin && course.instructorId !== instructorId) throw ApiError.forbidden()

  const updateData = { ...data }
  if (data.title && data.title !== course.title) {
    updateData.slug = await uniqueSlug(data.title, courseId)
  }

  return prisma.course.update({ where: { id: courseId }, data: updateData })
}

export async function publishCourse(courseId, instructorId, isAdmin = false) {
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw ApiError.notFound('Course not found')
  if (!isAdmin && course.instructorId !== instructorId) throw ApiError.forbidden()
  if (course.status === 'archived') throw ApiError.badRequest('Cannot publish an archived course')

  return prisma.course.update({
    where: { id: courseId },
    data: { status: 'published', isPublished: true }
  })
}

export async function archiveCourse(courseId, instructorId, isAdmin = false) {
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw ApiError.notFound('Course not found')
  if (!isAdmin && course.instructorId !== instructorId) throw ApiError.forbidden()

  return prisma.course.update({
    where: { id: courseId },
    data: { status: 'archived', isPublished: false }
  })
}

// ─── Sections ─────────────────────────────────────────────────────────────────

async function assertCourseOwner(courseId, instructorId, isAdmin = false) {
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw ApiError.notFound('Course not found')
  if (!isAdmin && course.instructorId !== instructorId) throw ApiError.forbidden()
  return course
}

export async function createSection(courseId, instructorId, data, isAdmin = false) {
  await assertCourseOwner(courseId, instructorId, isAdmin)
  return prisma.courseSection.create({ data: { courseId, ...data } })
}

export async function updateSection(sectionId, instructorId, data, isAdmin = false) {
  const section = await prisma.courseSection.findUnique({ where: { id: sectionId }, include: { course: true } })
  if (!section) throw ApiError.notFound('Section not found')
  if (!isAdmin && section.course.instructorId !== instructorId) throw ApiError.forbidden()
  return prisma.courseSection.update({ where: { id: sectionId }, data })
}

export async function deleteSection(sectionId, instructorId, isAdmin = false) {
  const section = await prisma.courseSection.findUnique({ where: { id: sectionId }, include: { course: true } })
  if (!section) throw ApiError.notFound('Section not found')
  if (!isAdmin && section.course.instructorId !== instructorId) throw ApiError.forbidden()
  return prisma.courseSection.delete({ where: { id: sectionId } })
}

// ─── Lessons ──────────────────────────────────────────────────────────────────

export async function createLesson(sectionId, instructorId, data, isAdmin = false) {
  const section = await prisma.courseSection.findUnique({ where: { id: sectionId }, include: { course: true } })
  if (!section) throw ApiError.notFound('Section not found')
  if (!isAdmin && section.course.instructorId !== instructorId) throw ApiError.forbidden()
  return prisma.lesson.create({ data: { sectionId, ...data } })
}

export async function updateLesson(lessonId, instructorId, data, isAdmin = false) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { section: { include: { course: true } } }
  })
  if (!lesson) throw ApiError.notFound('Lesson not found')
  if (!isAdmin && lesson.section.course.instructorId !== instructorId) throw ApiError.forbidden()
  return prisma.lesson.update({ where: { id: lessonId }, data })
}

export async function deleteLesson(lessonId, instructorId, isAdmin = false) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { section: { include: { course: true } } }
  })
  if (!lesson) throw ApiError.notFound('Lesson not found')
  if (!isAdmin && lesson.section.course.instructorId !== instructorId) throw ApiError.forbidden()
  return prisma.lesson.delete({ where: { id: lessonId } })
}

// ─── Instructor students ────────────────────────────────────────────────────────

export async function getInstructorStudents(instructorId) {
  const courses = await prisma.course.findMany({ where: { instructorId }, select: { id: true } })
  const courseIds = courses.map((c) => c.id)
  if (!courseIds.length) return []

  const enrollments = await prisma.enrollment.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      student: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
      course: { select: { id: true, title: true } }
    },
    orderBy: { enrolledAt: 'desc' }
  })

  const byStudent = {}
  for (const e of enrollments) {
    const sid = e.student.id
    if (!byStudent[sid]) {
      byStudent[sid] = { ...e.student, courses: [], enrolledAt: e.enrolledAt }
    }
    byStudent[sid].courses.push(e.course.title)
  }
  return Object.values(byStudent)
}

// ─── Manage (edit) — owner or admin, any status ─────────────────────────────────

export async function getCourseForEdit(courseId, userId, isAdmin = false) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: { select: { id: true, firstName: true, lastName: true } },
      sections: {
        orderBy: { orderIndex: 'asc' },
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' },
            select: { id: true, title: true, contentType: true, duration: true, orderIndex: true, isFree: true, contentUrl: true, zoomMeetingId: true }
          }
        }
      }
    }
  })
  if (!course) throw ApiError.notFound('Course not found')
  if (!isAdmin && course.instructorId !== userId) throw ApiError.forbidden()

  // Attach each Zoom meeting's scheduling details to its lesson so the editor
  // can pre-fill date/time/topic/timezone instead of losing them.
  const meetings = await prisma.zoomMeeting.findMany({
    where: { courseId },
    select: { id: true, topic: true, startTime: true, duration: true, timezone: true, agenda: true, joinUrl: true, status: true }
  })
  const meetingById = {}
  for (const m of meetings) meetingById[m.id] = m
  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      if (lesson.zoomMeetingId && meetingById[lesson.zoomMeetingId]) {
        lesson.zoomMeeting = meetingById[lesson.zoomMeetingId]
      }
    }
  }

  return course
}

// ─── Student enrollment ───────────────────────────────────────────────────────

export async function enrollFree(courseId, studentId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw ApiError.notFound('Course not found')
  if (!course.isFree) throw ApiError.badRequest('This course requires a subscription')

  const existing = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } }
  })
  if (existing) return existing

  return prisma.enrollment.create({ data: { studentId, courseId } })
}

export async function getStudentCourses(studentId) {
  return prisma.enrollment.findMany({
    where: { studentId },
    include: {
      course: {
        select: {
          id: true, title: true, slug: true, thumbnailUrl: true,
          category: true, level: true,
          instructor: { select: { firstName: true, lastName: true, avatarUrl: true } },
          _count: { select: { sections: true } }
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  })
}

// ─── Instructor dashboard stats ─────────────────────────────────────────────
const SUB_PRICE = 26 // monthly price per subscription (matches admin revenue convention)

export async function getInstructorStats(instructorId) {
  const courses = await prisma.course.findMany({
    where: { instructorId },
    select: {
      id: true, title: true, thumbnailUrl: true, status: true,
      _count: { select: { enrollments: true, subscriptions: true } }
    }
  })
  const courseIds = courses.map(c => c.id)
  const totalCourses = courses.length

  const [totalStudents, activeSubs, subs] = courseIds.length
    ? await Promise.all([
        prisma.enrollment.count({ where: { courseId: { in: courseIds } } }),
        prisma.subscription.count({ where: { courseId: { in: courseIds }, status: 'active' } }),
        prisma.subscription.findMany({
          where: { courseId: { in: courseIds }, status: { in: ['active', 'cancelled'] } },
          select: { createdAt: true }
        })
      ])
    : [0, 0, []]

  const mrr = activeSubs * SUB_PRICE
  const totalEarnings = subs.length * SUB_PRICE

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const inRange = (d, start, end) => {
    const t = new Date(d)
    return t >= start && (!end || t < end)
  }
  const currentMonthEarnings = subs.filter(s => inRange(s.createdAt, thisMonthStart)).length * SUB_PRICE
  const lastMonthEarnings = subs.filter(s => inRange(s.createdAt, lastMonthStart, thisMonthStart)).length * SUB_PRICE

  // Last 12 months earnings series for the chart
  const monthly = []
  for (let i = 11; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    monthly.push({
      label: start.toLocaleString('en-US', { month: 'short' }),
      earnings: subs.filter(s => inRange(s.createdAt, start, end)).length * SUB_PRICE
    })
  }

  const topCourses = courses
    .map(c => ({
      id: c.id,
      title: c.title,
      thumbnailUrl: c.thumbnailUrl,
      status: c.status,
      students: c._count.enrollments,
      subscriptions: c._count.subscriptions,
      revenue: c._count.subscriptions * SUB_PRICE
    }))
    .sort((a, b) => b.students - a.students)
    .slice(0, 8)

  return {
    totalCourses, totalStudents, activeSubs, mrr, totalEarnings,
    currentMonthEarnings, lastMonthEarnings, monthly, topCourses
  }
}
