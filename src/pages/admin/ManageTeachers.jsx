import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../services/api'

const emptyForm = {
  name: '', email: '', password: '', phone: '',
  subject: '', qualification: ''
}

// ── Add/Edit Form ─────────────────────────────────────────
function TeacherForm({ onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/teachers', form)
      onSave()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition'

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Add New Teacher</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              required placeholder="Teacher name" className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required placeholder="teacher@email.com" className={inp} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input type="password" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required placeholder="Min 6 characters" className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              placeholder="+91 XXXXX XXXXX" className={inp} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input value={form.subject}
              onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
              required placeholder="e.g. Mathematics" className={inp} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
            <input value={form.qualification}
              onChange={e => setForm(p => ({ ...p, qualification: e.target.value }))}
              placeholder="e.g. M.Sc, B.Ed" className={inp} />
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition disabled:opacity-60">
            {saving ? 'Adding...' : 'Add Teacher'}
          </button>
          <button type="button" onClick={onCancel}
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Attendance Modal ──────────────────────────────────────
function AttendanceModal({ teacher, onClose }) {
  const [month, setMonth]     = useState(new Date().toISOString().substring(0, 7))
  const [data,  setData]      = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get(`/teachers/${teacher._id}/attendance?month=${month}`)
      .then(r => setData(r.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [month, teacher._id])

  const getDaysInMonth = () => {
    const [y, m] = month.split('-')
    return new Date(y, m, 0).getDate()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h3 className="font-bold text-gray-800">{teacher.name}</h3>
            <p className="text-gray-500 text-sm">{teacher.subject}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Month selector */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Month:</label>
            <input type="month" value={month}
              onChange={e => setMonth(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : !data ? (
            <div className="text-center py-8 text-gray-400">No data found</div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{data.presentCount}</p>
                  <p className="text-xs text-gray-500">Present</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-red-500">{getDaysInMonth() - data.presentCount}</p>
                  <p className="text-xs text-gray-500">Absent</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {getDaysInMonth() > 0
                      ? Math.round((data.presentCount / getDaysInMonth()) * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-gray-500">Rate</p>
                </div>
              </div>

              {/* Calendar */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Monthly Calendar</p>
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {['S','M','T','W','T','F','S'].map((d, i) => (
                    <div key={i} className="text-xs text-gray-400 font-medium py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: getDaysInMonth() }, (_, i) => {
                    const day = i + 1
                    const dateStr = `${month}-${String(day).padStart(2, '0')}`
                    const record = data.attendance?.find(a => a.date === dateStr)
                    return (
                      <div key={day}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                          record?.status === 'present'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-50 text-gray-400'
                        }`}>
                        {day}
                      </div>
                    )
                  })}
                </div>
                <div className="flex gap-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-500" /> Present
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gray-100 border" /> Absent
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────
export default function ManageTeachers() {
  const [teachers,    setTeachers]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [showForm,    setShowForm]    = useState(false)
  const [msg,         setMsg]         = useState(null)
  const [selected,    setSelected]    = useState(null) // attendance modal
  const [search,      setSearch]      = useState('')

  const fetchTeachers = () => {
    api.get('/teachers')
      .then(r => setTeachers(r.data.data || []))
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTeachers() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher?')) return
    try {
      await api.delete(`/teachers/${id}`)
      setMsg({ type: 'success', text: 'Teacher deleted!' })
      fetchTeachers()
    } catch {
      setMsg({ type: 'error', text: 'Delete failed.' })
    } finally {
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const handleToggle = async (id, isActive) => {
    try {
      await api.put(`/teachers/${id}`, { isActive: !isActive })
      fetchTeachers()
    } catch {}
  }

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Manage Teachers</h2>
          <button onClick={() => setShowForm(p => !p)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition">
            {showForm ? 'Cancel' : '+ Add Teacher'}
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
          <TeacherForm
            onSave={() => { setShowForm(false); fetchTeachers(); setMsg({ type: 'success', text: 'Teacher added!' }); setTimeout(() => setMsg(null), 3000) }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-bold text-primary">{teachers.length}</p>
            <p className="text-gray-500 text-sm">Total Teachers</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-bold text-green-600">{teachers.filter(t => t.isActive).length}</p>
            <p className="text-gray-500 text-sm">Active</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-bold text-red-500">{teachers.filter(t => !t.isActive).length}</p>
            <p className="text-gray-500 text-sm">Inactive</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, subject or email..."
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-gray-400 text-sm">{filtered.length} teachers</span>
          </div>

          {/* Teachers List */}
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-3">👨‍🏫</div>
              <p className="text-gray-500">No teachers found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(t => (
                <div key={t._id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700 flex-shrink-0">
                      {t.name?.[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800 truncate">{t.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {t.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {t.faceDescriptor?.length > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Face ✓
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs">{t.subject} • {t.email}</p>
                      {t.qualification && <p className="text-gray-300 text-xs">{t.qualification}</p>}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setSelected(t)}
                      className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">
                      Attendance
                    </button>
                    <button onClick={() => handleToggle(t._id, t.isActive)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition ${t.isActive ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                      {t.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(t._id)}
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

      {/* Attendance Modal */}
      {selected && (
        <AttendanceModal
          teacher={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </AdminLayout>
  )
}