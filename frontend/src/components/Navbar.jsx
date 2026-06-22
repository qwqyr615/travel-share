import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const stored = sessionStorage.getItem('user')
  const user = stored ? JSON.parse(stored) : null

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    navigate('/')
  }

  return (
    <nav style={{
      background: 'var(--color-ivory)',
      borderBottom: '1px solid var(--color-border-cream)',
      padding: '0 var(--space-md)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-whisper)',
    }}>
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        <Link to="/" style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.35rem',
          fontWeight: 500,
          color: 'var(--color-near-black)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: '1.5rem' }}>🏔️</span> Travel Share
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--color-near-black)',
            padding: 8,
          }}
          className="mobile-menu-btn"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="nav-links">
          <Link to="/" className="nav-link" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none' }}>首页</Link>
          <Link to="/posts" className="nav-link" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none' }}>游记</Link>
          {user ? (
            <>
              <Link to="/posts/new" className="nav-link" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none', background: 'var(--color-terracotta)', color: '#fff' }}>
                ✏️ 写游记
              </Link>
              <Link to="/profile" className="nav-link" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                👤 个人中心
              </Link>
              {user.type === 1 && (
                <Link to="/admin/destinations" className="nav-link" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none' }}>管理</Link>
              )}
              <button onClick={handleLogout} style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-stone-gray)' }}>
                退出
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none' }}>登录</Link>
              <Link to="/register" className="nav-link" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none', background: 'var(--color-terracotta)', color: '#fff' }}>注册</Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div style={{
          padding: '0 var(--space-md) var(--space-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          borderTop: '1px solid var(--color-border-cream)',
        }}>
          <Link to="/" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none', display: 'block' }} onClick={() => setMenuOpen(false)}>首页</Link>
          <Link to="/posts" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none', display: 'block' }} onClick={() => setMenuOpen(false)}>游记</Link>
          {user ? (
            <>
              <Link to="/posts/new" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none', display: 'block' }} onClick={() => setMenuOpen(false)}>✏️ 写游记</Link>
              <Link to="/profile" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none', display: 'block' }} onClick={() => setMenuOpen(false)}>👤 个人中心</Link>
              {user.type === 1 && <Link to="/admin/destinations" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none', display: 'block' }} onClick={() => setMenuOpen(false)}>管理后台</Link>}
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, display: 'block', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--color-stone-gray)' }}>退出</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none', display: 'block' }} onClick={() => setMenuOpen(false)}>登录</Link>
              <Link to="/register" style={{ padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--fs-small)', fontWeight: 500, textDecoration: 'none', display: 'block' }} onClick={() => setMenuOpen(false)}>注册</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
