import LikeButton from './LikeButton'

export default function BlogCard({ blog }: { blog: any }) {
  return (
    <div className="card">
      <a href={`/public/${blog.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h2>{blog.title}</h2>
      </a>
      <div className="muted">By {blog.author.email}</div>
      <p style={{ marginTop: 8 }}>{blog.summary || 'No summary yet'}</p>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <LikeButton blogId={blog.id} initialCount={blog.likeCount} />
        <div>{blog.commentCount} comments</div>
      </div>
    </div>
  )
}
