import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPosts } from '../services/api.js'
import { getPostCover } from '../utils/postMedia.js'

const heroStyle = {
  textAlign: 'center',
  padding: 'var(--space-2xl) var(--space-md)',
  background: 'var(--color-ivory)',
  borderBottom: '1px solid var(--color-border-cream)',
}

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const res = await getPosts({ page: 1, size: 6 })
      setPosts(res.data.data?.list || res.data?.list || res.data?.data || [])
    } catch {}
    setLoading(false)
  }

  return (
    <div>
      {/* Hero */}
      <section style={heroStyle}>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--fs-display)',
          fontWeight: 500,
          lineHeight: 'var(--lh-display)',
          color: 'var(--color-near-black)',
          maxWidth: 720,
          margin: '0 auto',
        }}>
          记录旅途的每一刻精彩
        </h1>
        <p style={{
          marginTop: 'var(--space-md)',
          fontSize: '1.15rem',
          color: 'var(--color-olive-gray)',
          lineHeight: 'var(--lh-body)',
          maxWidth: 520,
          margin: 'var(--space-md) auto 0',
        }}>
          分享你的旅行故事，探索世界的无限可能
        </p>
        <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/posts" className="btn btn-primary btn-lg">
            浏览游记
          </Link>
          {user && (
            <Link to="/posts/new" className="btn btn-secondary btn-lg">
              写游记
            </Link>
          )}
        </div>
      </section>

      {/* Featured Posts */}
      <section className="page-section container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: 'var(--fs-headline-2)' }}>最新游记</h2>
          <Link to="/posts" className="btn btn-ghost btn-sm">查看全部 →</Link>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /> 加载中...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <h3>暂无游记</h3>
            <p>还没有人分享游记，快来写下第一篇吧！</p>
            {user && (
              <Link to="/posts/new" className="btn btn-primary" style={{ marginTop: 16 }}>
                写第一篇游记
              </Link>
            )}
          </div>
        ) : (
          <div className="grid-3">
            {posts.map(post => {
              const coverImage = getPostCover(post)
              return (
              <Link to={`/posts/${post.id}`} key={post.id} className="card" style={{ textDecoration: 'none' }}>
                {coverImage ? (
                  <img src={coverImage} alt={post.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }} />
                ) : null}
                <div style={{ padding: 'var(--space-md)' }}>
                  <h3 style={{ fontSize: 'var(--fs-headline-3)', marginBottom: 6 }}>{post.title}</h3>
                  {post.summary && (
                    <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-olive-gray)', lineHeight: 'var(--lh-body)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.summary}
                    </p>
                  )}
                  <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', fontSize: 'var(--fs-tiny)', color: 'var(--color-stone-gray)' }}>
                    <span>👤 {post.author_name || post.author_nickname || '匿名'}</span>
                    <span>👁️ {post.view_count || 0}</span>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        )}
      </section>

      {/* CTA */}
      {!user && (
        <section style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-md)', background: 'var(--color-ivory)', marginTop: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: 'var(--fs-headline-2)' }}>加入我们，分享你的故事</h2>
          <p style={{ color: 'var(--color-olive-gray)', marginTop: 'var(--space-sm)' }}>
            注册账号，开始记录你的旅途点滴
          </p>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-md)' }}>
            免费注册
          </Link>
        </section>
      )}
    </div>
  )
}
