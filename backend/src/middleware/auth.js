import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

// Verifies the Bearer access token and attaches { id, role, email } to req.user.
export function authenticate(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return next(ApiError.unauthorized('Missing access token'))
  }

  try {
    const payload = jwt.verify(token, env.jwt.accessSecret)
    req.user = { id: payload.sub, role: payload.role, email: payload.email }
    next()
  } catch {
    next(ApiError.unauthorized('Invalid or expired access token'))
  }
}

// Restricts a route to one or more roles. Use after authenticate().
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return next(ApiError.unauthorized())
  if (!roles.includes(req.user.role)) {
    return next(ApiError.forbidden('You do not have permission to access this resource'))
  }
  next()
}
