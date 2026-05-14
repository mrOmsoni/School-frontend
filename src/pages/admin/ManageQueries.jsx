import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../services/api'

export default function ManageQueries() {
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState(null)
  const [filter, setFilter] = useState('all')

  const fetchQueries = () => {
    api.get('/queries')
      .then(r => setQueries(r.data.data || []))
      .catch(() => setQueries([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchQueries() }, [])

  const handleReply = async (id) => {
    if (!reply.trim()) return
    setSending(true)
    try {
      await api.put(`/queries/${id}/reply`, { reply })
      setMsg({ type: 'success', text: 'Reply sent!' })
      setSelected(null)
      setReply('')
      fetchQueries()
    } catch {
      setMsg({ type: 'error', text: 'Failed to send reply.' })
    } finally {
      setSending(false)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const filtered = filter === 'all' ? queries
    : queries.filter(q => (q.status || 'pending') === filter)

  const statusColors = {
    pending:  'bg-yellow-100 text-yellow-700',
    replied:  'bg-green-100 text-green-700',
  }

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Manage Queries</h2>
          <div className="flex gap-2">
            {['all','pending','replied'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Queries List */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="font-semibold text-gray-800">Queries ({filtered.length})</p>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-3">💬</div>
                <p className="text-gray-500">No queries found.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                {filtered.map(q => (
                  <div
                    key={q._id}
                    onClick={() => { setSelected(q); setReply('') }}
                    className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition ${selected?._id === q._id ? 'bg-blue-50 border-l-2 border-primary' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-800 text-sm">{q.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[q.status || 'pending']}`}>
                        {q.status || 'pending'}
                      </span>
                    </div>
                    <p className="text-xs text-accent font-medium">{q.subject}</p>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-1">{q.message}</p>
                    <p className="text-gray-300 text-xs mt-1">{q.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Query Detail + Reply */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {!selected ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-3">👈</div>
                <p className="text-gray-500 text-sm">Select a query to view details and reply</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">{selected.subject}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[selected.status || 'pending']}`}>
                      {selected.status || 'pending'}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <p><span className="text-gray-500">Name:</span> <span className="font-medium">{selected.name}</span></p>
                    <p><span className="text-gray-500">Email:</span> <span className="font-medium">{selected.email}</span></p>
                    {selected.phone && <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{selected.phone}</span></p>}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Message:</p>
                  <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </div>
                </div>

                {selected.adminReply && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Your Previous Reply:</p>
                    <div className="bg-green-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                      {selected.adminReply}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Reply:</p>
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    rows={4}
                    placeholder="Type your reply here..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                  <button
                    onClick={() => handleReply(selected._id)}
                    disabled={sending || !reply.trim()}
                    className="mt-2 w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition disabled:opacity-60">
                    {sending ? 'Sending...' : 'Send Reply via Email'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}