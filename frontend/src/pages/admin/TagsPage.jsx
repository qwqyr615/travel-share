import { useState, useEffect } from 'react'
import { getTags, createTag, updateTag, deleteTag } from '../../services/api.js'

export default function TagsPage() {
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [editId, setEditId] = useState(null)
  const [msg, setMsg] = useState('')

  const load = async () => {
    try { const res = await getTags(); setList(res.data.data || res.data || []) } catch {}
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    try {
      if (editId) {
        await updateTag(editId, { name })
        setMsg('✅ 更新成功')
      } else {
        await createTag(name)
        setMsg('✅ 添加成功')
      }
      setName(''); setEditId(null); load()
    } catch { setMsg('❌ 操作失败') }
  }

  const handleEdit = (tag) => {
    setName(tag.name)
    setEditId(tag.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('确定删除这个标签吗？')) return
    try { await deleteTag(id); load(); setMsg('✅ 删除成功') } catch { setMsg('❌ 删除失败') }
  }

  return (
    <div className="page-section container">
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 style={{ fontSize: 'var(--fs-headline-1)' }}>标签管理</h2>
        <p style={{ color: 'var(--color-stone-gray)', fontSize: 'var(--fs-small)', marginTop: 4 }}>管理游记标签分类</p>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      {/* Form */}
      <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>{editId ? '编辑标签名称' : '新标签名称'}</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="输入标签名" required />
          </div>
          <button type="submit" className="btn btn-primary">
            {editId ? '更新' : '添加'}
          </button>
          {editId && (
            <button type="button" className="btn btn-ghost" onClick={() => { setName(''); setEditId(null) }}>
              取消
            </button>
          )}
        </form>
      </div>

      {/* Tag List */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {list.length === 0 ? (
          <div className="empty-state" style={{ width: '100%' }}>
            <h3>暂无标签</h3>
            <p>添加一些标签来分类游记</p>
          </div>
        ) : (
          list.map(tag => (
            <div key={tag.id} className="tag" style={{ fontSize: 'var(--fs-body)', padding: '8px 18px', gap: 10 }}>
              {tag.name}
              <button onClick={() => handleEdit(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-olive-gray)', fontSize: 14, padding: 0 }}>✎</button>
              <button onClick={() => handleDelete(tag.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error-crimson)', fontSize: 18, padding: 0, lineHeight: 1 }}>&times;</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
