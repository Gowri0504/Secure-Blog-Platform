import { apiGet } from '../../lib/api'
import BlogCard from '../../components/BlogCard'
import Pagination from '../../components/Pagination'

export default async function FeedPage({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const sp = await searchParams
  const page = Number(sp?.page || '1')
  try {
    const data = await apiGet(`/public/feed?page=${page}&limit=10`)
    return (
      <div>
        {data.items.length === 0 ? (
          <div>Nothing published yet</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {data.items.map((b: any) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        )}
        <div style={{ marginTop: 16 }}>
          <Pagination page={data.page} totalPages={data.totalPages} />
        </div>
      </div>
    )
  } catch (e) {
    return <div>Error loading feed</div>
  }
}
