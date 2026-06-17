import { defineStore } from 'pinia'
import { useSessionStorage } from '@vueuse/core'
import router from '@/router'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'instructor' | 'student'
  avatarUrl?: string
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
}

export const useAuthStore = defineStore('auth_store', () => {
  const stored = useSessionStorage<string | null>('UA_AUTH', null)

  function _getState(): AuthState {
    try {
      return stored.value ? JSON.parse(stored.value) : { user: null, accessToken: null }
    } catch {
      return { user: null, accessToken: null }
    }
  }

  function _setState(state: AuthState) {
    stored.value = JSON.stringify(state)
  }

  const getUser = (): AuthUser | null => _getState().user
  const getToken = (): string | null => _getState().accessToken
  const isAuthenticated = (): boolean => !!_getState().accessToken
  const userRole = (): string | null => _getState().user?.role ?? null

  async function register(payload: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: 'student' | 'instructor'
  }) {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Registration failed')
    return data
  }

  async function login(email: string, password: string) {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')

    _setState({ user: data.user, accessToken: data.accessToken })
    // Store refresh token separately (longer-lived)
    sessionStorage.setItem('UA_REFRESH', data.refreshToken)
    return data.user
  }

  async function refreshToken() {
    const rt = sessionStorage.getItem('UA_REFRESH')
    if (!rt) throw new Error('No refresh token')

    const res = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt })
    })
    const data = await res.json()
    if (!res.ok) {
      logout()
      throw new Error('Session expired')
    }

    const state = _getState()
    _setState({ ...state, accessToken: data.accessToken })
    return data.accessToken
  }

  async function fetchMe() {
    const token = getToken()
    if (!token) return null

    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) return null

    const data = await res.json()
    const state = _getState()
    _setState({ ...state, user: data.user })
    return data.user
  }

  async function logout() {
    const token = getToken()
    if (token) {
      fetch(`${API}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {})
    }
    stored.value = null
    sessionStorage.removeItem('UA_REFRESH')
    router.push({ name: 'auth.sign-in' })
  }

  // Returns a valid access token, refreshing if needed
  async function getValidToken(): Promise<string | null> {
    const token = getToken()
    if (!token) return null
    try {
      // Check expiry by decoding (without verifying — server verifies)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiresSoon = payload.exp * 1000 - Date.now() < 60_000 // refresh if < 1 min left
      if (expiresSoon) return await refreshToken()
      return token
    } catch {
      return token
    }
  }

  return {
    getUser,
    getToken,
    getValidToken,
    isAuthenticated,
    userRole,
    register,
    login,
    logout,
    refreshToken,
    fetchMe,
    // Legacy compat for template components that use saveSession/removeSession
    saveSession: (u: AuthUser, token: string) => _setState({ user: u, accessToken: token }),
    removeSession: logout
  }
})
