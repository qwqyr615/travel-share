import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUserInfo, updateUserInfo, updatePassword } from '../services/api.js'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [nickname, setNickname] = useState('')
  const [intro, setIntro] = useState('')
  const [msg, setMsg] = useState('')
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')

  useEffect(() => {
    getUserInfo().then(res => {
      const u = res.data.data || res.data
      setUser(u)
      setNickname(u.nickname || '')
      setIntro(u.intro || '')
    }).catch(() => window.location.href = '/login')
  }, [])

  const handleUpdateInfo = async (e) => {
    e.preventDefault()
    try {
      await updateUserInfo({ nickname, intro })
      setMsg('更新成功')
    } catch { setMsg('更新失败') }
  }

  const handleUpdatePwd = async (e) => {
    e.preventDefault()
    setPwdMsg('')
    if (newPwd.length < 6) { setPwdMsg('新密码至少6位'); return }
    try {
      await updatePassword(oldPwd, newPwd)
      setPwdMsg('密码修改成功')
      setOldPwd(''); setNewPwd('')
    } catch (err) {
      setPwdMsg(err.response?.data?.message || '旧密码错误')
    }
  }

  if (!user) return <div className="container" style={{ paddingTop: 40 }}>加载中...</div>

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <nav style={{ marginBottom: 24 }}>
        <Link to="/">← 返回首页</Link>
      </nav>
      <h2>个人主页</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        <div style={{ background: '#fff', padding: 20, borderRadius: 8 }}>
          <h3>编辑资料</h3>
          {msg && <div style={{ background: '#d4edda', padding: 8, borderRadius: 4, margin: '8px 0' }}>{msg}</div>}
          <form onSubmit={handleUpdateInfo}>
            <div style={{ marginBottom: 12 }}>
              <label>用户名</label>
              <input style={inputStyle} value={user.username} disabled />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>昵称</label>
              <input style={inputStyle} value={nickname} onChange={e => setNickname(e.target.value)} maxLength={30} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>简介</label>
              <textarea style={{ ...inputStyle, minHeight: 80 }} value={intro} onChange={e => setIntro(e.target.value)} maxLength={200} />
            </div>
            <button style={btnStyle} type="submit">保存</button>
          </form>
        </div>
        <div style={{ background: '#fff', padding: 20, borderRadius: 8 }}>
          <h3>修改密码</h3>
          {pwdMsg && <div style={{ background: pwdMsg.includes('成功') ? '#d4edda' : '#f8d7da', padding: 8, borderRadius: 4, margin: '8px 0' }}>{pwdMsg}</div>}
          <form onSubmit={handleUpdatePwd}>
            <div style={{ marginBottom: 12 }}>
              <label>旧密码</label>
              <input style={inputStyle} type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>新密码</label>
              <input style={inputStyle} type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} required />
            </div>
            <button style={btnStyle} type="submit">修改密码</button>
          </form>
        </div>
      </div>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '8px 12px', marginTop: 4, border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }
const btnStyle = { width: '100%', padding: '10px', background: '#3273dc', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16 }