'use client'
import { useState } from 'react'
import { apiAuth } from '../../lib/api'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    setLoading(true)
    setSuccess(false)
    setError('')
    try {
      await apiAuth('/auth/register', 'POST', { email, password })
      setSuccess(true)
    } catch {
      setError('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <h2>Register</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password (min 8 chars)" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={submit} disabled={loading}>Register</button>
        {success && <div style={{ color: 'green' }}>Registered! You can log in now.</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  )
}
