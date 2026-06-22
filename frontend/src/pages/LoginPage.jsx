import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { login } from '../services/api.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loginName, setLoginName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const success = searchParams.get('success')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await login(loginName, password)
      const body = res.data

      // 后端返回 { code: 401, message: "xxx", data: null }，HTTP 状态是 200
      // 需要手动检查 code
      if (!body || body.code !== 200) {
        setError(body?.message || '用户名或密码错误')
        setLoading(false)
        return
      }

      const userData = body.data
      if (!userData) {
        setError('登录失败：未返回用户信息')
        setLoading(false)
        return
      }

      sessionStorage.setItem('user', JSON.stringify(userData))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || '网络错误，请稍后重试')
      setLoading(false)
    }
  }

  return (
    <div className="page-section">
      <div className="container-narrow" style={{ maxWidth: 440 }}>
        <div className="card" style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
          <h2 style={{ fontSize: 'var(--fs-headline-1)', textAlign: 'center', marginBottom: 4 }}>欢迎回来</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-stone-gray)', fontSize: 'var(--fs-small)', marginBottom: 'var(--space-lg)' }}>
            登录你的账号，继续分享旅途故事
          </p>

          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-error" style={{ fontSize: 'var(--fs-body)', fontWeight: 500 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>用户名</label>
              <input
                className="input"
                value={loginName}
                onChange={e => setLoginName(e.target.value)}
                placeholder="输入用户名"
                required
              />
            </div>
            <div className="form-group">
              <label>密码</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="输入密码"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <p style={{ marginTop: 'var(--space-lg)', textAlign: 'center', fontSize: 'var(--fs-small)', color: 'var(--color-olive-gray)' }}>
            还没有账号？{' '}
            <Link to="/register" style={{ fontWeight: 500 }}>立即注册</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
