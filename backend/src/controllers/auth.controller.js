import * as AuthService from '../services/auth.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const register = asyncHandler(async (req, res) => {
  const user = await AuthService.register(req.body)
  res.status(201).json({ message: 'Account created successfully', user })
})

export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await AuthService.login(req.body)
  res.json({ accessToken, refreshToken, user })
})

export const refresh = asyncHandler(async (req, res) => {
  const { accessToken } = await AuthService.refreshAccessToken(req.body.refreshToken)
  res.json({ accessToken })
})

export const logout = asyncHandler(async (req, res) => {
  await AuthService.logout(req.user.id)
  res.json({ message: 'Logged out successfully' })
})

export const me = asyncHandler(async (req, res) => {
  const user = await AuthService.getMe(req.user.id)
  res.json({ user })
})

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await AuthService.updateProfile(req.user.id, req.body)
  res.json({ user })
})

export const forgotPassword = asyncHandler(async (req, res) => {
  await AuthService.requestPasswordReset(req.body.email)
  res.json({ message: 'If an account with that email exists, a reset link has been sent.' })
})

export const resetPassword = asyncHandler(async (req, res) => {
  await AuthService.resetPassword(req.body.token, req.body.password)
  res.json({ message: 'Password has been reset successfully.' })
})
