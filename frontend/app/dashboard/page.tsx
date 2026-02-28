'use client'
import { useEffect, useState } from 'react'
import { apiAuth, API_URL } from '../../lib/api'
import { getToken } from '../../lib/auth'

type Blog = { id: string; title: string; slug: string; isPublished: boolean }

export default function DashboardPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const token = getToken()

  async function load() {
    const res = await fetch(`${API_URL}/api/me/blogs`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const data = await res.json()
      setBlogs(data.items)
    }
  }

  useEffect(() => {
    if (token) load()
  }, [])

  async function create() {
    const res = await apiAuth('/blogs', 'POST', { title, content, isPublished }, token)
    setTitle('')
    setContent('')
    setIsPublished(false)
    await load()
  }

  async function remove(id: string) {
    await apiAuth(`/blogs/${id}`, 'DELETE', undefined, token)
    await load()
  }

  return (
    <div>
      {!token ? (
        <div className="card">Please login to access dashboard</div>
      ) : (
        <>
          <h2>Create Blog</h2>
          <div className="grid">
            <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className="textarea" placeholder="Content" value={content} onChange={e => setContent(e.target.value)} rows={8} />
            <label className="muted" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} /> Publish
            </label>
            <button className="btn btn-primary" onClick={create}>Create</button>
          </div>
          <h2 style={{ marginTop: 24 }}>Your Blogs</h2>
          {blogs.length === 0 ? (
            <div className="muted">Empty</div>
          ) : (
            <div className="grid">
              {blogs.map(b => (
                <div key={b.id} className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{b.title}</div>
                    <div className={`pill ${b.isPublished ? 'pill-success' : 'pill-muted'}`}>{b.isPublished ? 'Published' : 'Draft'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a className="btn" href={`/public/${b.slug}`} style={{ alignSelf: 'center' }}>View</a>
                    <button className="btn btn-danger" onClick={() => remove(b.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
