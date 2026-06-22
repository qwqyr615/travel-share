import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getUserInfo, updateUserInfo, updatePassword, getMyPosts, getMyFavorites, uploadAvatar } from '../services/api.js'

const tabStyle = (active) => ({
  padding: '10px 20px',
  background: active ? 'var(--color-terracotta)' : 'transparent',
  color: active ? '#fff' : 'var(--color-olive-gray)',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  fontSize: 'var(--fs-small)',
  fontWeight: 500,
  transition: 'all 0.2s',
})

export default function ProfilePage() {
  const avatarInputRef = useRef(null)
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('info')
  const [loading, setLoading] = useState(true)
  const [nickname, setNickname] = useState('')
  const [intro, setIntro] = useState('')
  const [msg, setMsg] = useState('')
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')
  const [myPosts, setMyPosts] = useState([])
  const [myFavorites, setMyFavorites] = useState([])

  const syncSessionUser = (nextUser) => {
    const stored = JSON.parse(sessionStorage.getItem('user') || '{}')
    sessionStorage.setItem('user', JSON.stringify({
      ...stored,
      nickname: nextUser.nickname || stored.nickname,
      avatar: nextUser.avatar || stored.avatar,
    }))
  }

  const loadUser = async () => {
    try {
      const res = await getUserInfo()
      const u = res.data.data || res.data
      setUser(u)
      setNickname(u.nickname || '')
      setIntro(u.intro || '')
      syncSessionUser(u)
      return u
    } catch {
      window.location.href = '/login'
      return null
    }
  }

  useEffect(() => {
    setLoading(true)
    loadUser().finally(() => setLoading(false))
  }, [])

  const loadMyPosts = async () => {
    try {
      const res = await getMyPosts()
      const data = res.data?.data || res.data || []
      setMyPosts(Array.isArray(data) ? data : (data.list || []))
    } catch {}
  }

  const loadFavorites = async () => {
    try {
      const res = await getMyFavorites()
      const result = res.data?.data || res.data || {}
      setMyFavorites(result.list || [])
    } catch {}
  }

  useEffect(() => { if (tab === 'posts') loadMyPosts() }, [tab])
  useEffect(() => { if (tab === 'favorites') loadFavorites() }, [tab])

  const handleUpdateInfo = async (e) => {
    e.preventDefault()
    try {
      await updateUserInfo({ nickname, intro })
      setMsg('更新成功')
      await loadUser()
    } catch {
      setMsg('更新失败')
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMsg('仅支持上传图片文件')
      e.target.value = ''
      return
    }
    let avatarUrl = ''
    try {
      const res = await uploadAvatar(file)
      avatarUrl = res.data?.data || ''
      if (!avatarUrl) {
        throw new Error('上传成功但未返回头像地址')
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || '上传失败'
      setMsg(errMsg)
      e.target.value = ''
      return
    }
    try {
      await updateUserInfo({ avatar: avatarUrl })
      const refreshedUser = await loadUser()
      if (refreshedUser) {
        setUser(refreshedUser)
        syncSessionUser(refreshedUser)
      } else {
        setUser((prev) => prev ? { ...prev, avatar: avatarUrl } : prev)
      }
      setMsg('头像更新成功')
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || '保存头像失败'
      setMsg(errMsg)
    }
  }

  const handleUpdatePwd = async (e) => {
    e.preventDefault()
    setPwdMsg('')
    if (newPwd.length < 6) { setPwdMsg('新密码至少需要 6 位'); return }
    try {
      await updatePassword(oldPwd, newPwd)
      setPwdMsg('密码修改成功')
      setOldPwd(''); setNewPwd('')
    } catch (err) {
      setPwdMsg(err.response?.data?.message || '旧密码错误')
    }
  }

  if (loading) return <div className="loading page-section"><div className="spinner" /> 加载中...</div>
  if (!user) return null

  const avatarSrc = user.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : user.avatar)
    : ''

  return (
    <div className="page-section container" style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
        <div>
          <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-stone-gray)' }}>个人空间</p>
          <h1 style={{ fontSize: 'var(--fs-headline-2)' }}>个人主页</h1>
        </div>
        {tab === 'favorites' && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setTab('info')}>
            ← 返回个人主页
          </button>
        )}
      </div>

      {/* 头像 + 基本信息 */}
      <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ position: 'relative', width: 88, height: 88, flexShrink: 0 }}>
          {avatarSrc ? (
            <img src={avatarSrc} alt="头像"
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border-cream)' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%',
              background: 'var(--color-warm-sand)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 32, color: 'var(--color-stone-gray)',
              border: '2px solid var(--color-border-cream)'
            }}>👤</div>
          )}
          <button
            onClick={() => avatarInputRef.current?.click()}
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--color-terracotta)', color: '#fff',
              border: 'none', cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
            title="更换头像"
          >📷</button>
          <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 'var(--fs-headline-2)', marginBottom: 4 }}>{user.nickname || user.username || '用户'}</h2>
          {user.intro && <p style={{ color: 'var(--color-olive-gray)', fontSize: 'var(--fs-small)' }}>{user.intro}</p>}
          <p style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-stone-gray)', marginTop: 4 }}>
            用户名：{user.username} · 注册时间：{user.creat_time ? new Date(user.creat_time).toLocaleDateString() : ''}
          </p>
        </div>
      </div>

      {/* 功能标签页 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-lg)' }}>
        <button style={tabStyle(tab === 'info')} onClick={() => setTab('info')}>📋 个人信息</button>
        <button style={tabStyle(tab === 'password')} onClick={() => setTab('password')}>🔑 修改密码</button>
        <button style={tabStyle(tab === 'posts')} onClick={() => setTab('posts')}>📝 我的游记</button>
        <button style={tabStyle(tab === 'favorites')} onClick={() => setTab('favorites')}>❤️ 我的收藏</button>
      </div>

      {msg && (
        <div className={"alert " + (msg.includes('成功') ? 'alert-success' : 'alert-error')} style={{ marginBottom: 'var(--space-md)' }}>
          {msg}
          <button type="button" className="btn btn-sm btn-ghost" style={{ marginLeft: 12, padding: '2px 8px' }} onClick={() => setMsg('')}>✕</button>
        </div>
      )}

      {tab === 'info' && (
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--fs-headline-3)', marginBottom: 'var(--space-md)' }}>个人信息</h3>
          <form onSubmit={handleUpdateInfo}>
            <div className="form-group">
              <label>用户名</label>
              <input className="input" value={user.username || ''} disabled />
            </div>
            <div className="form-group">
              <label>昵称</label>
              <input className="input" value={nickname} onChange={e => setNickname(e.target.value)} maxLength={30} placeholder="给自己取个昵称" />
            </div>
            <div className="form-group">
              <label>个人简介</label>
              <textarea className="textarea" value={intro} onChange={e => setIntro(e.target.value)} maxLength={200} placeholder="简单介绍一下自己" />
            </div>
            <button type="submit" className="btn btn-primary">保存修改</button>
          </form>
        </div>
      )}

      {tab === 'password' && (
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--fs-headline-3)', marginBottom: 'var(--space-md)' }}>修改密码</h3>
          {pwdMsg && <div className={"alert " + (pwdMsg.includes('成功') ? 'alert-success' : 'alert-error')}>{pwdMsg}</div>}
          <form onSubmit={handleUpdatePwd}>
            <div className="form-group">
              <label>旧密码</label>
              <input className="input" type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} required placeholder="输入当前密码" />
            </div>
            <div className="form-group">
              <label>新密码</label>
              <input className="input" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} required placeholder="至少 6 位" />
            </div>
            <button type="submit" className="btn btn-primary">修改密码</button>
          </form>
        </div>
      )}

      {tab === 'posts' && (
        <div>
          {myPosts.length === 0 ? (
            <div className="empty-state">
              <h3>还没有发布游记</h3>
              <p>开始你的第一篇游记吧！</p>
              <Link to="/posts/new" className="btn btn-primary" style={{ marginTop: 16 }}>写游记</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {myPosts.map(post => (
                <Link to={`/posts/${post.id}`} key={post.id} className="card" style={{ display: 'flex', gap: 16, padding: 'var(--space-md)', textDecoration: 'none' }}>
                  {post.cover_image && <img src={post.cover_image} alt={post.title} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 'var(--fs-body)', fontWeight: 600, marginBottom: 4, color: 'var(--color-near-black)' }}>{post.title}</h4>
                    {post.summary && <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-olive-gray)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.summary}</p>}
                    <div style={{ marginTop: 8, fontSize: 'var(--fs-tiny)', color: 'var(--color-stone-gray)', display: 'flex', gap: 12 }}>
                      <span>浏览 {post.view_count || 0}</span>
                      <Link to={`/posts/${post.id}/edit`} style={{ color: 'var(--color-terracotta)' }} onClick={e => e.stopPropagation()}>编辑</Link>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'favorites' && (
        <div>
          {myFavorites.length === 0 ? (
            <div className="empty-state">
              <h3>还没有收藏的游记</h3>
              <p>浏览游记时点击收藏按钮即可收藏</p>
              <Link to="/posts" className="btn btn-primary" style={{ marginTop: 16 }}>浏览游记</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {myFavorites.map(fav => (
                <Link to={`/posts/${fav.postId}`} key={fav.id} className="card" style={{ display: 'flex', gap: 16, padding: 'var(--space-md)', textDecoration: 'none' }}>
                  {fav.postCoverImage && <img src={fav.postCoverImage} alt={fav.postTitle} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 'var(--fs-body)', fontWeight: 600, marginBottom: 4, color: 'var(--color-near-black)' }}>{fav.postTitle}</h4>
                    <p style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-stone-gray)' }}>收藏于 {new Date(fav.createdAt).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}