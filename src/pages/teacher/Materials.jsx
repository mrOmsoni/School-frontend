import { useState, useEffect } from 'react'
import TeacherLayout from '../../components/TeacherLayout'
import teacherApi from '../../services/teacherApi'
import { useTeacher } from '../../context/TeacherContext'

export default function Materials() {
  const { teacher } = useTeacher()
  const [materials, setMaterials] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [msg,       setMsg]       = useState(null)
  const [form, setForm] = useState({
    title: '', description: '', subject: '', class: '', fileUrl: '', fileType: 'pdf'
  })

  const fetchMaterials = () => {
    teacherApi.get('/teachers/materials/my')
      .then(r => setMaterials(r.data.data || []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchMaterials()
    setForm(p => ({ ...p, subject: teacher?.subject || '' }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await teacherApi.post('/teachers/materials', form)
      setMsg({ type: 'success', text: 'Material uploaded!' })
      setForm({ title: '', description: '', subject: teacher?.subject || '', class: '', fileUrl: '', fileType: 'pdf' })
      setShowForm(false)
      fetchMaterials()
    } catch {
      setMsg({ type: 'error', text: 'Upload failed. Try again.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this material?')) return
    try {
      await teacherApi.delete(`/teachers/materials/${id}`)
      fetchMaterials()
    } catch {}
  }

  const fileTypeIcons = {
    pdf:   '📄',
    doc:   '📝',
    image: '🖼️',
    video: '🎥',
    other: '📁',
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition'

  return (
    <TeacherLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Study Materials</h2>
          <button
            onClick={() => setShowForm(p => !p)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
            {showForm ? 'Cancel' : '+ Upload Material'}
          </button>
        </div>

        {/* Message */}
        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {msg.text}
          </div>
        )}

        {/* Upload Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Upload New Material</h3>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    required placeholder="e.g. Chapter 5 Notes"
                    className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <input value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    required placeholder="e.g. Mathematics"
                    className={inp} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select value={form.class}
                    onChange={e => setForm(p => ({ ...p, class: e.target.value }))}
                    className={inp}>
                    <option value="">All Classes</option>
                    {['Class I','Class II','Class III','Class IV','Class V',
                      'Class VI','Class VII','Class VIII','Class IX','Class X',
                      'Class XI','Class XII'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
                  <select value={form.fileType}
                    onChange={e => setForm(p => ({ ...p, fileType: e.target.value }))}
                    className={inp}>
                    <option value="pdf">PDF</option>
                    <option value="doc">Document</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File URL * <span className="text-gray-400 font-normal">(Google Drive, Cloudinary, etc.)</span>
                </label>
                <input value={form.fileUrl}
                  onChange={e => setForm(p => ({ ...p, fileUrl: e.target.value }))}
                  required placeholder="https://drive.google.com/... or https://res.cloudinary.com/..."
                  className={inp} />
                <p className="text-xs text-gray-400 mt-1">
                  💡 Google Drive pe file upload karo → Share → "Anyone with link" → URL copy karo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3} placeholder="Brief description of the material..."
                  className={inp} />
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={saving}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-60">
                  {saving ? 'Uploading...' : 'Upload Material'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Materials List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-800">My Materials ({materials.length})</p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : materials.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-3">📚</div>
              <p className="text-gray-500">No materials uploaded yet.</p>
              <button onClick={() => setShowForm(true)}
                className="mt-3 text-green-600 text-sm hover:underline">
                Upload your first material
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {materials.map(m => (
                <div key={m._id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-3xl">{fileTypeIcons[m.fileType] || '📁'}</div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{m.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {m.subject} {m.class && `• ${m.class}`} •{' '}
                        {new Date(m.createdAt).toLocaleDateString('en-IN')}
                      </p>
                      {m.description && (
                        <p className="text-gray-500 text-xs mt-1 line-clamp-1">{m.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <a href={m.fileUrl} target="_blank" rel="noreferrer"
                      className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">
                      View
                    </a>
                    <button onClick={() => handleDelete(m._id)}
                      className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </TeacherLayout>
  )
}