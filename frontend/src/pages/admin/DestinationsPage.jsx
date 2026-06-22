import { useState, useEffect } from 'react'
import { getDestinations, createDestination, updateDestination, deleteDestination } from '../../services/api.js'

export default function DestinationsPage() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name: '', city: '', province: '', coverImage: '' })
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
        setMsg('✅ 更新成功')
      } else {
        await createDestination(form)
        setMsg('✅ 添加成功')
      }
      setForm({ name: '', city: '', province: '', coverImage: '' })
      setEditId(null)
      load()
    } catch { setMsg('❌ 操作失败') }
  }

  const handleEdit = (item) => {
    setForm({ name: item.name || '', city: item.city || '', province: item.province || '', coverImage: item.coverImage || item.cover_image || '' })
    setEditId(item.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个目的地吗？')) return
    try { await deleteDestination(id); load(); setMsg('✅ 删除成功') } catch { setMsg('❌ 删除失败') }
  }

  return (
    <div className="page-section container">
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 style={{ fontSize: 'var(--fs-headline-1)' }}>目的地管理</h2>
        <p style={{ color: 'var(--color-stone-gray)', fontSize: 'var(--fs-small)', marginTop: 4 }}>管理所有旅行目的地</p>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      {/* Form */}
      <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ fontSize: 'var(--fs-headline-3)', marginBottom: 'var(--space-md)' }}>
          {editId ? '编辑目的地' : '添加目的地'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label>名称 *</label>
              <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="如：丽江古城" required />
            </div>
            <div className="form-group">
              <label>封面图 URL</label>
              <input className="input" value={form.coverImage} onChange={e => setForm({...form, coverImage: e.target.value})} placeholder="可选" />
            </div>
            <div className="form-group">
              <label>城市</label>
              <input className="input" value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="如：丽江" />
            </div>
            <div className="form-group">
              <label>省份</label>
              <input className="input" value={form.province} onChange={e => setForm({...form, province: e.target.value})} placeholder="如：云南" />
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary">
              {editId ? '更新' : '添加'}
            </button>
            {editId && (
              <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm({ name: '', city: '', province: '', coverImage: '' }) }}>
                取消
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>城市</th>
              <th>省份</th>
              <th style={{ width: 160 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-stone-gray)', padding: 40 }}>暂无目的地数据</td></tr>
            ) : (
              list.map(item => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--color-stone-gray)', fontSize: 'var(--fs-small)' }}>{item.id}</td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.city || '-'}</td>
                  <td>{item.province || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(item)} style={{ marginRight: 6 }}>编辑</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>删除</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
