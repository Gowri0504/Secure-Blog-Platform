'use client'
import { useEffect, useState } from 'react'
import CommentItem from '../../../components/CommentItem'
import { apiGet, apiAuth } from '../../../lib/api'
import { getToken } from '../../../lib/auth'

export default function CommentsSection({ blogId }: { blogId: string }) {
  const [items, setItems] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await apiGet(`/blogs/${blogId}/comments`)
    setItems(res)
  }

  useEffect(() => {
    load()
  }, [blogId])

  async function submit() {
    if (!content.trim() || loading) return
    setLoading(true)
    const token = getToken()
    try {
      await apiAuth(`/blogs/${blogId}/comments`, 'POST', { content }, token)
      setContent('')
      await load()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input value={content} onChange={e => setContent(e.target.value)} placeholder="Write a comment" style={{ flex: 1, padding: 8 }} />
        <button onClick={submit} disabled={loading}>Send</button>
      </div>
      <div style={{ marginTop: 12 }}>
        {items.length === 0 ? <div>No comments yet</div> : items.map(c => <CommentItem key={c.id} comment={c} />)}
      </div>
    </div>
  )
}
