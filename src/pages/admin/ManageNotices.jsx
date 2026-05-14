import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../services/api'

const empty = { title: '', content: '', priority: 'medium', expiryDate: '' }

export default function ManageNotices() {
  const [notices,  setNotices]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [form,     setForm]     = useState(empty)
  const [editId,   setEditId]   = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState(null)

  const fetchNotices = () => {
    api.get('/notices')
      .then(r => setNotices(r.data.data || []))
      .catch(() => setNotices([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchNotices() }, [])

  const handleChange = e =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await api.put(`/notices/${editId}`, form)
        setMsg({ type: 'success', text: 'Notice updated!' })
      } else {
        await api.post('/notices', form)
        setMsg({ type: 'success', text: 'Notice added!' })
      }
      setForm(empty); setEditId(null); setShowForm(false)
      fetchNotices()
    } catch {
      setMsg({ type: 'error', text: 'Something went wrong.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const handleToggle = async (id, isActive) => {
    try {
      await api.put(`/notices/${id}`, { isActive: !isActive })
      fetchNotices()
    } catch {}
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this notice?')) return
    try { await api.delete(`/notices/${id}`); fetchNotices() } catch {}
  }

  const priorityColors = {
    high:   'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low:    'bg-green-100 text-green-700',
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition'

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Manage Notices</h2>
          <button onClick={() => { setForm(empty); setEditId(null); setShowForm(p => !p) }}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition">
            {showForm ? 'Cancel' : '+ Add Notice'}
          </button>
        </div>

        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {msg.text}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">{editId ? 'Edit Notice' : 'Add New Notice'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="Notice title" className={inp} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select name="priority" value={form.priority} onChange={handleChange} className={inp}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea name="content" value={form.content} onChange={handleChange} required rows={4} placeholder="Notice content..." className={inp} />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving}
                  className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition disabled:opacity-60">
                  {saving ? 'Saving...' : editId ? 'Update' : 'Add Notice'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(empty) }}
                  className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-800">All Notices ({notices.length})</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : notices.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-3">📢</div>
              <p className="text-gray-500">No notices yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notices.map(n => (
                <div key={n._id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-800 truncate">{n.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${priorityColors[n.priority] || priorityColors.medium}`}>
                        {n.priority}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs line-clamp-1">{n.content}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleToggle(n._id, n.isActive)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition ${n.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {n.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => { setForm({ title: n.title, content: n.content, priority: n.priority, expiryDate: n.expiryDate?.split('T')[0] || '' }); setEditId(n._id); setShowForm(true) }}
                      className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(n._id)}
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
    </AdminLayout>
  )
}