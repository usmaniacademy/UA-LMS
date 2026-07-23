import { useAuthStore } from '@/stores/auth'

const BASE = import.meta.env.VITE_API_URL || '/api'

async function request(method: string, path: string, body?: unknown) {
  const auth = useAuthStore()
  const token = await auth.getValidToken()

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`)
  return data
}

export const api = {
  get: (path: string) => request('GET', path),
  post: (path: string, body: unknown) => request('POST', path, body),
  put: (path: string, body: unknown) => request('PUT', path, body),
  patch: (path: string, body: unknown) => request('PATCH', path, body),
  delete: (path: string) => request('DELETE', path)
}
