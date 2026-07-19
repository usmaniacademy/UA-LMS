import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.js'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { sendPasswordResetEmail } from './email.service.js'

const SALT_ROUNDS = 12

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiresIn }
  )
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id },
    env.jwt.refreshSecret,
    { expiresIn: env.jwt.refreshExpiresIn }
  )
}

export async function register({ email, password, firstName, lastName, role }) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw ApiError.conflict('An account with this email already exists')

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName, role },
    select: { id: true, email: true, firstName: true, lastName: true, role: true }
  })

  return user
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.isActive) throw ApiError.unauthorized('Invalid email or password')

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw ApiError.unauthorized('Invalid email or password')

  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)

  // Store hashed refresh token in DB
  const tokenHash = await bcrypt.hash(refreshToken, 8)
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash: tokenHash }
  })

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl
    }
  }
}

export async function refreshAccessToken(refreshToken) {
  let payload
  try {
    payload = jwt.verify(refreshToken, env.jwt.refreshSecret)
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token')
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } })
  if (!user || !user.isActive || !user.refreshTokenHash) {
    throw ApiError.unauthorized('Session expired, please log in again')
  }

  const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash)
  if (!valid) throw ApiError.unauthorized('Invalid refresh token')

  const newAccessToken = signAccessToken(user)
  return { accessToken: newAccessToken }
}

export async function logout(userId) {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshTokenHash: null }
  })
}

export async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, avatarUrl: true, bio: true, emailVerified: true, createdAt: true }
  })
  if (!user) throw ApiError.notFound('User not found')
  return user
}

export async function requestPasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } })
  // Don't reveal whether the email exists
  if (!user) return

  // Invalidate any existing unused tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
    data: { expiresAt: new Date(0) }
  })

  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = await bcrypt.hash(rawToken, 8)

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    }
  })

  const resetLink = `${env.frontendUrl}/auth/reset-password?token=${rawToken}`
  await sendPasswordResetEmail(email, resetLink)
}

export async function resetPassword(token, newPassword) {
  const tokens = await prisma.passwordResetToken.findMany({
    where: { usedAt: null, expiresAt: { gt: new Date() } },
    include: { user: true }
  })

  let matched = null
  for (const t of tokens) {
    const valid = await bcrypt.compare(token, t.tokenHash)
    if (valid) {
      matched = t
      break
    }
  }

  if (!matched) throw ApiError.badRequest('Invalid or expired reset token')

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: matched.userId },
      data: { passwordHash }
    }),
    prisma.passwordResetToken.update({
      where: { id: matched.id },
      data: { usedAt: new Date() }
    })
  ])
}

export async function updateProfile(userId, data) {
  const allowed = {}
  if (data.firstName !== undefined) allowed.firstName = data.firstName
  if (data.lastName !== undefined) allowed.lastName = data.lastName
  if (data.bio !== undefined) allowed.bio = data.bio
  if (data.avatarUrl !== undefined) allowed.avatarUrl = data.avatarUrl || null
  return prisma.user.update({
    where: { id: userId },
    data: allowed,
    select: { id: true, email: true, firstName: true, lastName: true, role: true, avatarUrl: true, bio: true, emailVerified: true, createdAt: true }
  })
}
