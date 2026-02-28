'use client'
import { useState } from 'react'
import { apiAuth } from '../lib/api'
import { getToken } from '../lib/auth'

export default function LikeButton({ blogId, initialCount }: { blogId: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (loading) return
    setLoading(true)
    const prev = count
    setCount(c => c + (liked ? -1 : 1))
    setLiked(!liked)
    try {
      const token = getToken()
      const res = await apiAuth(`/blogs/${blogId}/like`, liked ? 'DELETE' : 'POST', undefined, token)
      setCount(res.likeCount)
    } catch {
      setCount(prev)
      setLiked(!liked)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={toggle} disabled={loading} className={`btn ${liked ? '' : 'btn-primary'}`}>
      {liked ? 'Unlike' : 'Like'} • <span aria-live="polite">{count}</span>
    </button>
  )
}
