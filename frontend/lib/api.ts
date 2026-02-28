export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export async function apiGet(path: string, init?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, { ...init, cache: 'no-store' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiAuth(path: string, method: string, body?: unknown, token?: string) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
