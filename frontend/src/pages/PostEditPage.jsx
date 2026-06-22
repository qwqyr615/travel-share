import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPostDetail, createPost, updatePost, getDestinations, getTags, uploadCover, uploadImage } from '../services/api.js'

export default function PostEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [destId, setDestId] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [loading, setLoading] = useState(false)

  const [destinations, setDestinations] = useState([])
  const [tags, setTags] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (!stored) { navigate('/login'); return }
    setUser(JSON.parse(stored))

    getDestinations().then(res => setDestinations(res.data.data || res.data || [])).catch(() => {})
    getTags().then(res => setTags(res.data.data || res.data || [])).catch(() => {})

    if (isEdit) {
      getPostDetail(id).then(res => {
        const data = res.data.data || res.data
        setTitle(data.title || '')
        setSummary(data.summary || '')
        setContent(data.content || '')
        setDestId(data.destId || data.destinationId || data.destination_id || '')
        setCoverPreview(data.cover_image || data.coverImage || '')
        // Tags
        const tagIds = (data.tags || []).map(t => t.id || t.tagId || t)
        setSelectedTags(tagIds)
      }).catch(() => navigate('/posts'))
    }
  }, [id])

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    )
  }

  const handleCoverChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCoverFile(file)
    // Local preview
    const reader = new FileReader()
    reader.onload = (ev) => setCoverPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      let coverUrl = coverPreview

      // Upload cover if new file
      if (coverFile) {
        try {
          const uploadRes = await uploadCover(coverFile)
          coverUrl = uploadRes.data.data || uploadRes.data
        } catch {}
      }

      const postData = {
        user_id: user?.id,
        title,
        summary,
        content,
        destination_id: destId ? parseInt(destId) : null,
        cover_image: coverUrl,
        tag_ids: selectedTags,
      }

      const res = isEdit ? await updatePost(id, postData) : await createPost(postData)
      const body = res.data
      if (body && body.code !== 200) {
        throw new Error(body.message || '操作失败')
      }
      if (isEdit) {
        navigate(`/posts/${id}`)
      } else {
        const newId = body?.data
        navigate(`/posts/${newId || ''}`)
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || '保存失败'
      alert('发布失败: ' + msg)
    } finally {
      setLoading(false)
    }
  }

  const insertImageToContent = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const res = await uploadImage(file)
      const url = res.data.data || res.data
      setContent(prev => prev + `<p><img src="${url}" alt="upload" style="max-width:100%" /></p>`)
    } catch {
      alert('图片上传失败')
    }
  }

  return (
    <div className="page-section" style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-xl) var(--space-md)' }}>
      <Link to={isEdit ? `/posts/${id}` : '/posts'} className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--space-lg)' }}>
        ← 返回
      </Link>

      <h2 style={{ fontSize: 'var(--fs-headline-1)', marginBottom: 'var(--space-lg)' }}>
        {isEdit ? '编辑游记' : '写游记'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          {/* Title */}
          <div className="form-group">
            <label>标题 *</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="给你的游记起个名字" required maxLength={200} />
          </div>

          {/* Summary */}
          <div className="form-group">
            <label>摘要</label>
            <textarea className="textarea" value={summary} onChange={e => setSummary(e.target.value)}
              placeholder="简短描述这篇游记" maxLength={500} style={{ minHeight: 60 }} />
          </div>

          {/* Destination */}
          <div className="form-group">
            <label>目的地</label>
            <select className="input" value={destId} onChange={e => setDestId(e.target.value)}>
              <option value="">选择目的地（可选）</option>
              {destinations.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label>标签</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tags.map(tag => (
                <button key={tag.id} type="button"
                  className={`btn btn-sm ${selectedTags.includes(tag.id) ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => handleTagToggle(tag.id)}>
                  {selectedTags.includes(tag.id) ? '✅ ' : ''}{tag.name}
                </button>
              ))}
              {tags.length === 0 && <span style={{ color: 'var(--color-stone-gray)', fontSize: 'var(--fs-small)' }}>暂无标签</span>}
            </div>
          </div>

          {/* Cover image */}
          <div className="form-group">
            <label>封面图</label>
            <input type="file" accept="image/*" onChange={handleCoverChange}
              style={{ fontSize: 'var(--fs-small)', color: 'var(--color-olive-gray)' }} />
            {coverPreview && (
              <img src={coverPreview} alt="cover preview"
                style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginTop: 'var(--space-sm)' }} />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <label style={{ fontSize: 'var(--fs-small)', fontWeight: 500, color: 'var(--color-olive-gray)' }}>正文内容</label>
            <label className="btn btn-sm btn-secondary" style={{ cursor: 'pointer' }}>
              🖼️ 插入图片
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={insertImageToContent} />
            </label>
          </div>
          <textarea
            className="textarea"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="写下你的旅行故事...&#10;&#10;支持 HTML 格式，可以插入图片、段落等。"
            style={{ minHeight: 400, fontFamily: 'var(--font-serif)', lineHeight: 1.8, fontSize: '1rem' }}
            required
          />
          <p style={{ fontSize: 'var(--fs-tiny)', color: 'var(--color-stone-gray)', marginTop: 8 }}>
            💡 支持 HTML 格式，上传的图片会自动插入到内容末尾
          </p>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? '保存中...' : (isEdit ? '保存修改' : '发布游记')}
          </button>
          <Link to={isEdit ? `/posts/${id}` : '/posts'} className="btn btn-ghost btn-lg">
            取消
          </Link>
        </div>
      </form>
    </div>
  )
}