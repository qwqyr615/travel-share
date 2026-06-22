import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getPosts, getDestinations, getTags } from '../services/api.js'
import { getPostCover } from '../utils/postMedia.js'

export default function PostListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [destinations, setDestinations] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  const keyword = searchParams.get('keyword') || ''
  const destId = searchParams.get('destId') || ''
  const tagId = searchParams.get('tagId') || ''
  const page = parseInt(searchParams.get('page') || '1')

  const pageSize = 9

  useEffect(() => {
    getDestinations().then(res => setDestinations(res.data.data || res.data || [])).catch(() => {})
    getTags().then(res => setTags(res.data.data || res.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    loadPosts()
  }, [keyword, destId, tagId, page])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const params = { page, size: pageSize }
      if (keyword) params.keyword = keyword
      if (destId) params.destination_id = destId
      if (tagId) params.tag_id = tagId
      const res = await getPosts(params)
      const data = res.data.data || res.data
      setPosts(data?.list || data || [])
      setTotal(data?.total || 0)
    } catch {}
    setLoading(false)
  }

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    if (updates.keyword !== undefined || updates.destId !== undefined || updates.tagId !== undefined) {
      params.delete('page')
    }
    setSearchParams(params)
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="page-section container">
      {/* Search & Filter */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 style={{ fontSize: 'var(--fs-headline-1)' }}>探索游记</h2>
        <p style={{ color: 'var(--color-stone-gray)', fontSize: 'var(--fs-small)', marginTop: 4 }}>
          发现来自世界各地的旅行故事
        </p>
      </div>

      <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: '2 1 240px', marginBottom: 0 }}>
            <label>搜索</label>
            <input
              className="input"
              placeholder="搜索游记标题..."
              value={keyword}
              onChange={e => updateParams({ keyword: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: 150, marginBottom: 0 }}>
            <label>目的地</label>
            <select className="input" value={destId} onChange={e => updateParams({ destId: e.target.value })}>
              <option value="">全部目的地</option>
              {destinations.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: 150, marginBottom: 0 }}>
            <label>标签</label>
            <select className="input" value={tagId} onChange={e => updateParams({ tagId: e.target.value })}>
              <option value="">全部标签</option>
              {tags.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          {(keyword || destId || tagId) && (
            <button className="btn btn-ghost btn-sm" onClick={() => setSearchParams({})} style={{ marginBottom: 0 }}>
              清除筛选
            </button>
          )}
        </div>
      </div>

      {/* Post Grid */}
      {loading ? (
        <div className="loading"><div className="spinner" /> 加载中...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state" style={{ background: 'var(--color-ivory)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2xl)' }}>
          <h3 style={{ fontSize: '1.5rem' }}>没有找到游记</h3>
          <p>尝试调整搜索条件，或写一篇新的游记</p>
          <Link to="/posts/new" className="btn btn-primary" style={{ marginTop: 16 }}>✏️ 写游记</Link>
        </div>
      ) : (
        <>
          <div className="grid-3">
            {posts.map(post => {
              const coverImage = getPostCover(post)
              return (
              <Link to={`/posts/${post.id}`} key={post.id} className="card" style={{ textDecoration: 'none' }}>
                {coverImage ? (
                  <img src={coverImage} alt={post.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }} />
                ) : (
                  <div style={{ width: '100%', height: 200, background: 'var(--color-warm-sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
                    🏔️
                  </div>
                )}
                <div style={{ padding: 'var(--space-md)' }}>
                  <h3 style={{ fontSize: 'var(--fs-headline-3)', marginBottom: 6 }}>{post.title}</h3>
                  {post.summary && (
                    <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-olive-gray)', lineHeight: 'var(--lh-body)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.summary}
                    </p>
                  )}
                  <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', fontSize: 'var(--fs-tiny)', color: 'var(--color-stone-gray)' }}>
                    <span>👤 {post.author_name || post.author_nickname || '匿名'}</span>
                    <span>👁️ {post.viewCount || 0}</span>
                    <span>❤️ {post.favorite_count || 0}</span>
                    {post.destination_name && <span className="tag">📍 {post.destination_name}</span>}
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {post.tags.map((t, i) => (
                        <span key={i} className="tag tag-primary">{t.name || t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            )})}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 'var(--space-xl)' }}>
              <button
                className="btn btn-sm btn-ghost"
                disabled={page <= 1}
                onClick={() => updateParams({ page: String(page - 1) })}
              >
                ← 上一页
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => updateParams({ page: String(p) })}
                >
                  {p}
                </button>
              ))}
              <button
                className="btn btn-sm btn-ghost"
                disabled={page >= totalPages}
                onClick={() => updateParams({ page: String(page + 1) })}
              >
                下一页 →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
