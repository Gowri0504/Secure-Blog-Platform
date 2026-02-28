export default function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const prev = page > 1 ? page - 1 : 1
  const next = page < totalPages ? page + 1 : totalPages
  return (
    <div className="pagination">
      <a href={`/feed?page=${prev}`}>
        Prev
      </a>
      <div>
        {page} / {totalPages}
      </div>
      <a href={`/feed?page=${next}`}>
        Next
      </a>
    </div>
  )
}
