import { apiGet } from '../../../lib/api'
import CommentItem from '../../../components/CommentItem'
import CommentsSection from './section'

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const p = await params
    const blog = await apiGet(`/public/blogs/${p.slug}`)
    return (
      <div>
        <h1 style={{ marginTop: 0 }}>{blog.title}</h1>
        <div style={{ fontSize: 14, color: '#555' }}>By {blog.author.email}</div>
        <article style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{blog.content}</article>
        <h3>Comments</h3>
        <CommentsSection blogId={blog.id} />
      </div>
    )
  } catch {
    return <div>Blog not found</div>
  }
}
