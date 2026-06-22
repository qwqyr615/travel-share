import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
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
      nickname: nextUser.nickname,
      avatar: nextUser.avatar,
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
    try { const res = await getMyPosts(); setMyPosts(res.data.data || res.data || []) } catch {}
  }
  const loadFavorites = async () => {
    try { const res = await getMyFavorites(); setMyFavorites(res.data.data || res.data || []) } catch {}
  }

  useEffect(() => { if (tab === 'posts') loadMyPosts() }, [tab])
  useEffect(() => { if (tab === 'favorites') loadFavorites() }, [tab])

  const handleUpdateInfo = async (e) => {
    e.preventDefault()
    try {
      await updateUserInfo({ nickname, intro })
      setMsg('✅ 更新成功')
      await loadUser()
    } catch {
      setMsg('❌ 更新失败')
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMsg('❌ 仅支持上传图片文件')
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
      const errMsg = err.response?.data?.message || err.message || '文件上传失败'
      setMsg('❌ ' + errMsg)
      e.target.value = ''
      return
    }

    try {
      const profilePayload = {
        avatar: avatarUrl,
        nickname: nickname || user.nickname || user.username,
        intro,
      }
      await updateUserInfo(profilePayload)
      const refreshedUser = await loadUser()
      if (refreshedUser) {
        setUser(refreshedUser)
        syncSessionUser(refreshedUser)
      } else {
        setUser((prev) => prev ? { ...prev, avatar: avatarUrl } : prev)
      }
      setMsg('✅ 头像更新成功')
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || '保存头像信息失败'
      setMsg('❌ ' + errMsg)
    } finally {
      e.target.value = ''
    }
  }

  const handleUpdatePwd = async (e) => {
    e.preventDefault()
    setPwdMsg('')
    if (newPwd.length < 6) { setPwdMsg('新密码至少需要 6 位'); return }
    try {
      await updatePassword(oldPwd, newPwd)
      setPwdMsg('✅ 密码修改成功')
      setOldPwd(''); setNewPwd('')
    } catch (err) {
      setPwdMsg(err.response?.data?.message || '旧密码错误')
    }
  }

  if (loading) return <div className="loading page-section"><div className="spinner" /> 加载中...</div>
  if (!user) return null

  return (
    <div className="page-section container" style={{ maxWidth: 900 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-lg)',
        flexWrap: 'wrap',
      }}>
        <div>
          <p style={{
            fontSize: 'var(--fs-tiny)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-stone-gray)',
            marginBottom: 6,
          }}>
            Personal Space
          </p>
          <h1 style={{ fontSize: 'var(--fs-headline-2)' }}>个人主页</h1>
        </div>
        {tab === 'favorites' && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setTab('info')}
          >
            返回个人主页
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        <div style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
             onClick={() => avatarInputRef.current?.click()}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: user.avatar ? `url(${user.avatar}) center/cover` : 'var(--color-warm-sand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, color: 'var(--color-stone-gray)',
            overflow: 'hidden', border: '2px solid var(--color-border-cream)',
            boxShadow: 'var(--shadow-ring)',
          }}>
            {!user.avatar && '👤'}
          </div>
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            background: 'var(--color-terracotta)', color: '#fff',
            borderRadius: '50%', width: 26, height: 26,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, boxShadow: 'var(--shadow-ring)',
            border: '2px solid var(--color-ivory)',
          }}>
            📷
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            id="avatarInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 'var(--fs-headline-2)', marginBottom: 2 }}>{user.nickname || user.username}</h2>
          <p style={{ color: 'var(--color-stone-gray)', fontSize: 'var(--fs-small)' }}>
            @{user.username}
            {user.type === 1 && <span className="tag tag-primary" style={{ marginLeft: 8 }}>管理员</span>}
          </p>
          {user.intro && <p style={{ color: 'var(--color-olive-gray)', fontSize: 'var(--fs-small)', marginTop: 6 }}>{user.intro}</p>}
          <p style={{ color: 'var(--color-stone-gray)', fontSize: 'var(--fs-tiny)', marginTop: 4 }}>
            💡 点击头像上传新照片
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--color-border-cream)', paddingBottom: 12, marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <button style={tabStyle(tab === 'info')} onClick={() => setTab('info')}>📋 编辑资料</button>
        <button style={tabStyle(tab === 'password')} onClick={() => setTab('password')}>🔒 修改密码</button>
        <button style={tabStyle(tab === 'posts')} onClick={() => setTab('posts')}>✍️ 我的游记</button>
        <button style={tabStyle(tab === 'favorites')} onClick={() => setTab('favorites')}>❤️ 我的收藏</button>
      </div>

      {tab === 'info' && (
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--fs-headline-3)', marginBottom: 'var(--space-md)' }}>编辑个人资料</h3>
          {msg && (
            <div className={`alert ${msg.includes('✅') ? 'alert-success' : 'alert-error'}`}>
              {msg}
            </div>
          )}
          <form onSubmit={handleUpdateInfo}>
            <div className="form-group">
              <label>用户名（不可修改）</label>
              <input className="input" value={user.username} disabled />
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
          {pwdMsg && (
            <div className={`alert ${pwdMsg.includes('✅') ? 'alert-success' : 'alert-error'}`}>{pwdMsg}</div>
          )}
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
              <h3>你还没有发布游记</h3>
              <p>开始你的第一篇游记吧！</p>
              <Link to="/posts/new" className="btn btn-primary" style={{ marginTop: 16 }}>✏️ 写游记</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {myPosts.map(post => (
                <Link to={`/posts/${post.id}`} key={post.id} className="card" style={{ display: 'flex', gap: 16, padding: 'var(--space-md)', textDecoration: 'none' }}>
                  {post.cover_image && (
                    <img src={post.cover_image} alt={post.title} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 'var(--fs-body)', fontWeight: 600, marginBottom: 4, color: 'var(--color-near-black)' }}>{post.title}</h4>
                    {post.summary && <p style={{ fontSize: 'var(--fs-small)', color: 'var(--color-olive-gray)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.summary}</p>}
                    <div style={{ marginTop: 8, fontSize: 'var(--fs-tiny)', color: 'var(--color-stone-gray)', display: 'flex', gap: 12 }}>
                      <span>👁️ {post.view_count || 0}</span>
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-md)',
            flexWrap: 'wrap',
          }}>
            <div>
              <h3 style={{ fontSize: 'var(--fs-headline-3)', marginBottom: 4 }}>我的收藏</h3>
              <p style={{ color: 'var(--color-olive-gray)', fontSize: 'var(--fs-small)' }}>
                回看你保存过的灵感与路线。
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate(-1)}
            >
              返回上一页
            </button>
          </div>
          {myFavorites.length === 0 ? (
            <div className="empty-state">
              <h3>还没有收藏的游记</h3>
              <p>浏览游记时点击 ❤️ 即可收藏</p>
              <Link to="/posts" className="btn btn-primary" style={{ marginTop: 16 }}>浏览游记</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {myFavorites.map(fav => (
                <Link to={`/posts/${fav.postId || fav.id}`} key={fav.id} className="card" style={{ display: 'flex', gap: 16, padding: 'var(--space-md)', textDecoration: 'none' }}>
                  {fav.cover_image && (
                    <img src={fav.cover_image} alt={fav.post_title} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 'var(--fs-body)', fontWeight: 600, marginBottom: 4, color: 'var(--color-near-black)' }}>{fav.post_title}</h4>
                    <p style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-stone-gray)' }}>
                      收藏于 {new Date(fav.created_at || fav.createTime).toLocaleDateString()}
                    </p>
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
