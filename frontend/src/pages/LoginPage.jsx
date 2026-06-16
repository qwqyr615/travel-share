import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { login } from '../services/api.js'

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const [loginName, setLoginName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(searchParams.get('error') || '')
  const success = searchParams.get('success')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await login(loginName, password)
      const user = res.data.data || res.data
      sessionStorage.setItem('user', JSON.stringify(user))
      window.location.href = '/'
    } catch (err) {
      setError(err.response?.data?.message || '用户名或密码错误')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h2 style={{ marginBottom: 20 }}>登入</h2>
      {success && <div style={{ background: '#d4edda', padding: 8, borderRadius: 4, marginBottom: 12 }}>{success}</div>}
      {error && <div style={{ background: '#f8d7da', padding: 8, borderRadius: 4, marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>用户名</label>
          <input style={inputStyle} value={loginName} onChange={e => setLoginName(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>密码</label>
          <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button style={btnStyle} type="submit">登入</button>
      </form>
      <p style={{ marginTop: 16, textAlign: 'center' }}>
        还没有账号？<Link to="/register">立即注册</Link>
      </p>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '8px 12px', marginTop: 4, border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }
const btnStyle = { width: '100%', padding: '10px', background: '#3273dc', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16 }