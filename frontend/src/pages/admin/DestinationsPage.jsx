import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDestinations, createDestination, updateDestination, deleteDestination } from '../../services/api.js'

export default function DestinationsPage() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name: '', city: '', province: '', cover_image: '' })
  const [editId, setEditId] = useState(null)
  const [msg, setMsg] = useState('')

  const load = async () => {
    try { const res = await getDestinations(); setList(res.data.data || res.data || []) } catch {}
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await updateDestination(editId, form)
      } else {
        await createDestination(form)
      }
      setForm({ name: '', city: '', province: '', cover_image: '' })
      setEditId(null)
      setMsg(editId ? '更新成功' : '添加成功')
      load()
    } catch { setMsg('操作失败') }
  }

  const handleEdit = (item) => {
    setForm({ name: item.name || '', city: item.city || '', province: item.province || '', cover_image: item.cover_image || '' })
    setEditId(item.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('确定删除？')) return
    try { await deleteDestination(id); load(); setMsg('删除成功') } catch { setMsg('删除失败') }
  }

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <nav style={{ marginBottom: 24 }}><Link to="/">← 返回首页</Link></nav>
      <h2>目的地管理</h2>
      {msg && <div style={{ background: '#d4edda', padding: 8, borderRadius: 4, margin: '12px 0' }}>{msg}</div>}

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input style={inputStyle} placeholder="名称" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input style={inputStyle} placeholder="城市" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
        <input style={inputStyle} placeholder="省份" value={form.province} onChange={e => setForm({...form, province: e.target.value})} />
        <input style={inputStyle} placeholder="封面图URL" value={form.cover_image} onChange={e => setForm({...form, cover_image: e.target.value})} />
        <button style={btnStyle} type="submit">{editId ? '更新' : '添加'}</button>
        {editId && <button type="button" style={{...btnStyle, background: '#999'}} onClick={() => { setEditId(null); setForm({ name: '', city: '', province: '', cover_image: '' }) }}>取消</button>}
      </form>

      <table style={{ width: '100%', background: '#fff', borderRadius: 8, overflow: 'hidden', borderCollapse: 'collapse' }}>
        <thead><tr style={{ background: '#f0f0f0' }}>
          <th style={thStyle}>ID</th><th style={thStyle}>名称</th><th style={thStyle}>城市</th><th style={thStyle}>省份</th><th style={thStyle}>操作</th>
        </tr></thead>
        <tbody>
          {list.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{item.id}</td>
              <td style={tdStyle}>{item.name}</td>
              <td style={tdStyle}>{item.city}</td>
              <td style={tdStyle}>{item.province}</td>
              <td style={tdStyle}>
                <button style={{...smallBtn, background: '#ffc107'}} onClick={() => handleEdit(item)}>编辑</button>
                <button style={{...smallBtn, background: '#dc3545'}} onClick={() => handleDelete(item.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const inputStyle = { padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, flex: '1 1 160px' }
const btnStyle = { padding: '8px 20px', background: '#3273dc', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }
const thStyle = { padding: '10px 12px', textAlign: 'left', fontSize: 13 }
const tdStyle = { padding: '10px 12px', fontSize: 13 }
const smallBtn = { padding: '4px 12px', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 12, marginRight: 6 }