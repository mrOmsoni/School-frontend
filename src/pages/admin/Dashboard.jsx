import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import api from '../../services/api'

function StatCard({ icon, label, value, color, path }) {
  return (
    <Link to={path} className={`bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4`}>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-3xl font-bold text-primary">{value}</p>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    events: 0, notices: 0, gallery: 0, queries: 0
  })
  const [recentQueries, setRecentQueries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/events').catch(() => ({ data: { data: [] } })),
      api.get('/notices').catch(() => ({ data: { data: [] } })),
      api.get('/gallery').catch(() => ({ data: { data: [] } })),
      api.get('/queries').catch(() => ({ data: { data: [] } })),
    ]).then(([events, notices, gallery, queries]) => {
      setStats({
        events:  events.data.data?.length  || 0,
        notices: notices.data.data?.length || 0,
        gallery: gallery.data.data?.length || 0,
        queries: queries.data.data?.length || 0,
      })
      setRecentQueries(queries.data.data?.slice(0, 5) || [])
    }).finally(() => setLoading(false))
  }, [])

  const quickActions = [
    { icon: '🎉', label: 'Add Event',   path: '/admin/events' },
    { icon: '📢', label: 'Add Notice',  path: '/admin/notices' },
    { icon: '🖼️', label: 'Add Photo',  path: '/admin/gallery' },
    { icon: '💬', label: 'View Queries', path: '/admin/queries' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="🎉" label="Total Events"   value={loading ? '...' : stats.events}  color="bg-blue-50"   path="/admin/events" />
          <StatCard icon="📢" label="Active Notices" value={loading ? '...' : stats.notices} color="bg-yellow-50" path="/admin/notices" />
          <StatCard icon="🖼️" label="Gallery Items" value={loading ? '...' : stats.gallery} color="bg-purple-50" path="/admin/gallery" />
          <StatCard icon="💬" label="Total Queries"  value={loading ? '...' : stats.queries} color="bg-green-50"  path="/admin/queries" />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map(a => (
              <Link
                key={a.path}
                to={a.path}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-accent border border-transparent transition-all"
              >
                <span className="text-3xl">{a.icon}</span>
                <span className="text-sm font-medium text-gray-700">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Queries */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Queries</h2>
            <Link to="/admin/queries" className="text-sm text-accent hover:underline">
              View All
            </Link>
          </div>
          {recentQueries.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No queries yet</p>
          ) : (
            <div className="space-y-3">
              {recentQueries.map((q, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{q.name}</p>
                    <p className="text-gray-400 text-xs">{q.subject} • {q.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    q.status === 'replied'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {q.status || 'pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  )
}