import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPostDetail, deletePost, getComments, publishComment, deleteComment, getFavoriteStatus, doFavorite, unFavorite } from '../services/api.js'
import { getPostCover } from '../utils/postMedia.js'

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [favorited, setFavorited] = useState(false)
  const [favCount, setFavCount] = useState(0)

  // Comments
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    load()
  }, [id])

  const load = async () => {
    setLoading(true)
    try {
      const res = await getPostDetail(id)
      const data = res.data.data || res.data
      setPost(data)
      setFavCount(data.favoriteCount || data.view_count || 0)
      // Check favorite status
      try {
        const favRes = await getFavoriteStatus(id)
        const favData = favRes.data.data ?? favRes.data
        setFavorited(favData === true)
      } catch {}
    } catch {}
    try {
      const res = await getComments(id)
      setComments(res.data.data || res.data || [])
    } catch {}
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇游记吗？')) return
    try {
      await deletePost(id)
      navigate('/posts')
    } catch {}
  }

  const handleFavorite = async () => {
    if (!user) { navigate('/login'); return }
    try {
      if (favorited) {
        await unFavorite(id)
      } else {
        await doFavorite(id)
      }
      setFavorited(!favorited)
      setFavCount(c => favorited ? c - 1 : c + 1)
    } catch {}
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!commentText.trim()) return
    try {
      await publishComment(id, commentText, replyTo?.id || null)
      setCommentText('')
      setReplyTo(null)
      const res = await getComments(id)
      setComments(res.data.data || res.data || [])
    } catch {}
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('确定要删除这条评论吗？')) return
    try { await deleteComment(commentId); const res = await getComments(id); setComments(res.data.data || res.data || []) } catch {}
  }

  const renderComment = (comment, level = 0) => (
    <div key={comment.id} style={{
      marginLeft: level > 0 ? 32 : 0,
      padding: 'var(--space-md)',
      borderLeft: level > 0 ? '2px solid var(--color-border-cream)' : 'none',
      marginTop: level === 0 ? 'var(--space-md)' : 0,
      background: level === 0 ? 'transparent' : 'rgba(245, 244, 237, 0.5)',
      borderRadius: 'var(--radius-sm)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: comment.user?.avatar ? `url(${comment.user.avatar}) center/cover` : 'var(--color-warm-sand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: 'var(--color-stone-gray)',
            flexShrink: 0, overflow: 'hidden',
          }}>
            {!comment.user?.avatar && '👤'}
          </div>
          <strong style={{ fontSize: 'var(--fs-small)', color: 'var(--color-near-black)' }}>
            {comment.user?.nickname || comment.user?.username || '匿名'}
          </strong>
          <span style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-stone-gray)' }}>
            {comment.createTime ? new Date(comment.createTime).toLocaleString() : ''}
          </span>
        </div>
        {user && (user.id === comment.userId || user.type === 1) && (
          <button className="btn btn-sm btn-ghost" style={{ fontSize: 'var(--fs-tiny)', padding: '2px 8px' }}
            onClick={() => handleDeleteComment(comment.id)}>
            删除
          </button>
        )}
      </div>
      <p style={{ fontSize: 'var(--fs-body)', color: 'var(--color-charcoal-warm)', lineHeight: 'var(--lh-body)' }}>
        {comment.content}
      </p>
      {user && level === 0 && (
        <button className="btn btn-sm btn-ghost" style={{ marginTop: 8, fontSize: 'var(--fs-tiny)', padding: '2px 10px' }}
          onClick={() => setReplyTo(replyTo?.id === comment.id ? null : comment)}>
          {replyTo?.id === comment.id ? '取消回复' : '回复'}
        </button>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {comment.replies.map(reply => renderComment(reply, level + 1))}
        </div>
      )}
    </div>
  )

  if (loading) return <div className="loading page-section"><div className="spinner" /> 加载中...</div>
  if (!post) return <div className="empty-state page-section"><h3>游记不存在</h3></div>

  const coverImage = getPostCover(post)

  return (
    <div className="page-section" style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-xl) var(--space-md)' }}>
      <Link to="/posts" className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--space-lg)' }}>
        ← 返回游记列表
      </Link>

      {coverImage && (
        <img src={coverImage} alt={post.title}
          style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-lg)' }} />
      )}

      <h1 style={{ fontSize: 'var(--fs-headline-1)', fontFamily: 'var(--font-serif)', marginBottom: 'var(--space-md)' }}>
        {post.title}
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 'var(--space-lg)', fontSize: 'var(--fs-small)', color: 'var(--color-olive-gray)' }}>
        <span>👤 {post.authorName || post.authorNickname || '匿名'}</span>
        <span>📅 {post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}</span>
        <span>👁️ {post.view_count || 0} 次浏览</span>
        <span>❤️ {favCount} 收藏</span>
        {post.destinationName && <span className="tag">📍 {post.destinationName}</span>}
      </div>

      {post.summary && (
        <div style={{
          padding: 'var(--space-md) var(--space-lg)',
          background: 'var(--color-ivory)',
          borderLeft: '3px solid var(--color-terracotta)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--space-lg)',
          fontStyle: 'italic',
          color: 'var(--color-olive-gray)',
          lineHeight: 'var(--lh-body)',
        }}>
          {post.summary}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <button className={`btn ${favorited ? 'btn-secondary' : 'btn-primary'}`} onClick={handleFavorite}>
          {favorited ? '❤️ 已收藏' : '🤍 收藏'}
        </button>
        {user && (user.id === post.user_id || user.type === 1) && (
          <>
            <Link to={`/posts/${post.id}/edit`} className="btn btn-secondary">编辑</Link>
            <button className="btn btn-danger" onClick={handleDelete}>删除</button>
          </>
        )}
      </div>

      <div className="card" style={{ padding: 'var(--space-lg) var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
        <div style={{ lineHeight: '1.8', color: 'var(--color-charcoal-warm)' }}
          dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ fontSize: 'var(--fs-headline-2)', marginBottom: 'var(--space-lg)' }}>
          💬 评论 ({comments.length})
        </h3>

        {user ? (
          <form onSubmit={handleComment} style={{ marginBottom: 'var(--space-lg)' }}>
            {replyTo && (
              <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-terracotta)', marginBottom: 8 }}>
                回复 @{replyTo.user?.nickname || replyTo.user?.username || '匿名'}：
                <button type="button" className="btn btn-sm btn-ghost" style={{ marginLeft: 8, padding: '2px 8px' }} onClick={() => setReplyTo(null)}>取消</button>
              </p>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <textarea
                className="textarea"
                style={{ flex: 1, minHeight: 60 }}
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={replyTo ? '写下你的回复...' : '写下你的评论...'}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
                发布
              </button>
            </div>
          </form>
        ) : (
          <div className="alert alert-info" style={{ marginBottom: 'var(--space-lg)' }}>
            <Link to="/login">登录</Link> 后即可发表评论
          </div>
        )}

        {comments.length === 0 ? (
          <p style={{ color: 'var(--color-stone-gray)', textAlign: 'center', padding: 'var(--space-xl)' }}>
            暂无评论，快来抢沙发吧！
          </p>
        ) : (
          <div>
            {comments.map(comment => renderComment(comment))}
          </div>
        )}
      </div>
    </div>
  )
}
