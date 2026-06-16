import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTags, createTag, deleteTag } from '../../services/api.js'

export default function TagsPage() {
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    try { const res = await getTags(); setList(res.data.data || res.data || []) } catch {}
  }
  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    try { await createTag(name); setName(''); setMsg('添加成功'); load() } catch { setMsg('添加失败') }
  }

  const handleDelete = async (id) => {
    if (!confirm('确定删除？')) return
    try { await deleteTag(id); load(); setMsg('删除成功') } catch { setMsg('删除失败') }
  }

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <nav style={{ marginBottom: 24 }}><Link to="/">← 返回首页</Link></nav>
      <h2>标签管理</h2>
      {msg && <div style={{ background: '#d4edda', padding: 8, borderRadius: 4, margin: '12px 0' }}>{msg}</div>}

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }} placeholder="标签名称" value={name} onChange={e => setName(e.target.value)} required />
        <button style={{ padding: '8px 24px', background: '#3273dc', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }} type="submit">添加</button>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {list.map(tag => (
          <span key={tag.id} style={{ background: '#fff', padding: '6px 14px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            {tag.name}
            <button onClick={() => handleDelete(tag.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>&times;</button>
          </span>
        ))}
      </div>
    </div>
  )
}