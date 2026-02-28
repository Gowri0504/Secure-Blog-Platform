'use client'
import { useState } from 'react'
import { apiAuth } from '../../lib/api'
import { setToken } from '../../lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    setLoading(true)
    setError('')
    try {
      const res = await apiAuth('/auth/login', 'POST', { email, password })
      setToken(res.accessToken)
      location.href = '/dashboard'
    } catch {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <h2>Login</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={submit} disabled={loading}>Login</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  )
}
