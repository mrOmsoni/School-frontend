import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../services/api'

const empty = { title: '', description: '', date: '', category: 'Academic', location: '', imageUrl: '' }

export default function ManageEvents() {
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)
  const [form,    setForm]    = useState(empty)
  const [editId,  setEditId]  = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState(null)

  const fetchEvents = () => {
    api.get('/events')
      .then(r => setEvents(r.data.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchEvents() }, [])

  const handleChange = e =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await api.put(`/events/${editId}`, form)
        setMsg({ type: 'success', text: 'Event updated!' })
      } else {
        await api.post('/events', form)
        setMsg({ type: 'success', text: 'Event added!' })
      }
      setForm(empty)
      setEditId(null)
      setShowForm(false)
      fetchEvents()
    } catch {
      setMsg({ type: 'error', text: 'Something went wrong.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const handleEdit = ev => {
    setForm({
      title: ev.title, description: ev.description,
      date: ev.date?.split('T')[0], category: ev.category || 'Academic',
      location: ev.location || '', imageUrl: ev.imageUrl || ''
    })
    setEditId(ev._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this event?')) return
    try {
      await api.delete(`/events/${id}`)
      fetchEvents()
    } catch {
      setMsg({ type: 'error', text: 'Delete failed.' })
    }
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition'

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Manage Events</h2>
          <button
            onClick={() => { setForm(empty); setEditId(null); setShowForm(p => !p) }}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition">
            {showForm ? 'Cancel' : '+ Add Event'}
          </button>
        </div>

        {/* Message */}
        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {msg.text}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">{editId ? 'Edit Event' : 'Add New Event'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} required placeholder="Event title" className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange} required className={inp} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inp}>
                    {['Academic','Sports','Cultural','Holiday','Other'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Event location" className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." className={inp} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Event description..." className={inp} />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving}
                  className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition disabled:opacity-60">
                  {saving ? 'Saving...' : editId ? 'Update Event' : 'Add Event'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(empty) }}
                  className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-800">All Events ({events.length})</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-3">📅</div>
              <p className="text-gray-500">No events yet. Add your first event!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {events.map(ev => (
                <div key={ev._id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-primary text-white rounded-lg px-3 py-1 text-center flex-shrink-0">
                      <p className="text-sm font-bold">{new Date(ev.date).toLocaleDateString('en-IN', { day: '2-digit' })}</p>
                      <p className="text-xs">{new Date(ev.date).toLocaleDateString('en-IN', { month: 'short' })}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{ev.title}</p>
                      <p className="text-gray-400 text-xs">{ev.category} {ev.location && `• ${ev.location}`}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(ev)}
                      className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(ev._id)}
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