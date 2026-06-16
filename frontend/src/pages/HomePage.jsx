import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  return (
    <div>
      <nav style={{ background: '#fff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: 20 }}>🏔️ Travel Share</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          {user ? (
            <>
              <Link to="/profile">{user.nickname || user.username}</Link>
              <a href="/logout">退出</a>
            </>
          ) : (
            <>
              <Link to="/login">登入</Link>
              <Link to="/register">注册</Link>
            </>
          )}
        </div>
      </nav>

      <main className="container" style={{ paddingTop: 40 }}>
        <h2>欢迎来到游记分享平台</h2>
        <p style={{ marginTop: 12, color: '#666' }}>探索目的地的精彩故事</p>
      </main>
    </div>
  )
}