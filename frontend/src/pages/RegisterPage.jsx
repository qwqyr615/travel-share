import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { register } from '../services/api.js'

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const [regName, setRegName] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState(searchParams.get('error') || '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (regName.length < 3 || regName.length > 20) {
      setError('用户名需 3-20 位')
      return
    }
    if (password.length < 6 || password.length > 32) {
      setError('密码需 6-32 位')
      return
    }
    try {
      await register(regName, password, nickname)
      window.location.href = '/login?success=' + encodeURIComponent('注册成功，请登录')
    } catch (err) {
      setError(err.response?.data?.message || '注册失败')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h2 style={{ marginBottom: 20 }}>注册</h2>
      {error && <div style={{ background: '#f8d7da', padding: 8, borderRadius: 4, marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>用户名 *</label>
          <input style={inputStyle} value={regName} onChange={e => setRegName(e.target.value)} placeholder="3-20位" required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>密码 *</label>
          <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="6-32位" required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>昵称</label>
          <input style={inputStyle} value={nickname} onChange={e => setNickname(e.target.value)} placeholder="可选" />
        </div>
        <button style={btnStyle} type="submit">注册</button>
      </form>
      <p style={{ marginTop: 16, textAlign: 'center' }}>
        已有账号？<Link to="/login">立即登入</Link>
      </p>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '8px 12px', marginTop: 4, border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }
const btnStyle = { width: '100%', padding: '10px', background: '#3273dc', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16 }