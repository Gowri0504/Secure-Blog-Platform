export default function CommentItem({ comment }: { comment: any }) {
  return (
    <div style={{ borderTop: '1px solid #eee', paddingTop: 8, paddingBottom: 8 }}>
      <div style={{ fontSize: 13, color: '#444' }}>{comment.author.email}</div>
      <div>{comment.content}</div>
    </div>
  )
}
