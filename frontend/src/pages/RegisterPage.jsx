import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api.js'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [regName, setRegName] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (regName.length < 3 || regName.length > 20) {
      setError('用户名需要 3-20 个字符')
      return
    }
    if (password.length < 6 || password.length > 32) {
      setError('密码需要 6-32 个字符')
      return
    }
    setLoading(true)
    try {
      await register(regName, password, nickname)
      navigate('/login?success=' + encodeURIComponent('注册成功，请登录'))
    } catch (err) {
      setError(err.response?.data?.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-section">
      <div className="container-narrow" style={{ maxWidth: 440 }}>
        <div className="card" style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
          <h2 style={{ fontSize: 'var(--fs-headline-1)', textAlign: 'center', marginBottom: 4 }}>创建账号</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-stone-gray)', fontSize: 'var(--fs-small)', marginBottom: 'var(--space-lg)' }}>
            注册成为 Travel Share 的一员
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>用户名 *</label>
              <input
                className="input"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                placeholder="3-20 个字符"
                required
              />
            </div>
            <div className="form-group">
              <label>密码 *</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="6-32 个字符"
                required
              />
            </div>
            <div className="form-group">
              <label>昵称（可选）</label>
              <input
                className="input"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="给自己取个名字"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <p style={{ marginTop: 'var(--space-lg)', textAlign: 'center', fontSize: 'var(--fs-small)', color: 'var(--color-olive-gray)' }}>
            已有账号？{' '}
            <Link to="/login" style={{ fontWeight: 500 }}>立即登录</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
