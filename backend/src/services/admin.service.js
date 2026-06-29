import prisma from '../config/prisma.js'
import bcrypt from 'bcryptjs'

export async function createInstructor({ email, password, firstName, lastName }) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw Object.assign(new Error('An account with this email already exists'), { status: 409 })
  const passwordHash = await bcrypt.hash(password, 12)
  return prisma.user.create({
    data: { email, passwordHash, firstName, lastName, role: 'instructor' },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      role: true, isActive: true, avatarUrl: true, createdAt: true,
      _count: { select: { enrollments: true } }
    }
  })
}

export async function getStats() {
  const [totalStudents, totalInstructors, totalCourses, publishedCourses, draftCourses, activeSubs] = await Promise.all([
    prisma.user.count({ where: { role: 'student' } }),
    prisma.user.count({ where: { role: 'instructor' } }),
    prisma.course.count(),
    prisma.course.count({ where: { status: 'published' } }),
    prisma.course.count({ where: { status: 'draft' } }),
    prisma.subscription.count({ where: { status: 'active' } })
  ])

  const mrr = activeSubs * 26

  return { totalStudents, totalInstructors, totalCourses, publishedCourses, draftCourses, activeSubs, mrr }
}

export async function listUsers({ role, search, page = 1, limit = 20 }) {
  const where = {}
  if (role) where.role = role
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, firstName: true, lastName: true, email: true,
        role: true, isActive: true, avatarUrl: true, createdAt: true,
        _count: { select: { enrollments: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.user.count({ where })
  ])

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function toggleUserActive(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
    select: { id: true, isActive: true }
  })
}

export async function changeUserRole(userId, role) {
  const validRoles = ['student', 'instructor', 'admin']
  if (!validRoles.includes(role)) throw Object.assign(new Error('Invalid role'), { status: 400 })
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, role: true }
  })
}

export async function listCourses({ status, search, page = 1, limit = 20 }) {
  const where = {}
  // Default view hides archived (deleted) courses; admins can still pick "Archived" in the filter.
  if (status) where.status = status
  else where.status = { not: 'archived' }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } }
    ]
  }

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        instructor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        _count: { select: { enrollments: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.course.count({ where })
  ])

  return { courses, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function approveCourse(courseId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw Object.assign(new Error('Course not found'), { status: 404 })
  return prisma.course.update({
    where: { id: courseId },
    data: { status: 'published' },
    select: { id: true, status: true }
  })
}

export async function rejectCourse(courseId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw Object.assign(new Error('Course not found'), { status: 404 })
  return prisma.course.update({
    where: { id: courseId },
    data: { status: 'draft' },
    select: { id: true, status: true }
  })
}

export async function getRevenue() {
  const subs = await prisma.subscription.findMany({
    where: { status: { in: ['active', 'cancelled'] } },
    include: { course: { select: { id: true, title: true, slug: true } } },
    orderBy: { createdAt: 'desc' }
  })

  const activeSubs = subs.filter(s => s.status === 'active')
  const mrr = activeSubs.length * 26
  const totalRevenue = subs.length * 26

  // Revenue by course
  const byCourse = {}
  for (const s of subs) {
    const key = s.course.id
    if (!byCourse[key]) byCourse[key] = { course: s.course, count: 0, revenue: 0 }
    byCourse[key].count++
    byCourse[key].revenue += 26
  }

  // Monthly revenue last 6 months
  const now = new Date()
  const monthly = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const count = subs.filter(s => new Date(s.createdAt) >= d && new Date(s.createdAt) < end).length
    monthly.push({
      month: d.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      revenue: count * 26,
      subscriptions: count
    })
  }

  return { mrr, totalRevenue, byCourse: Object.values(byCourse), monthly }
}
