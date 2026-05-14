import { useState, useEffect } from 'react'
import TeacherLayout from '../../components/TeacherLayout'
import { useTeacher } from '../../context/TeacherContext'
import teacherApi from '../../services/teacherApi'
import { Link } from 'react-router-dom'

export default function TeacherDashboard() {
  const { teacher } = useTeacher()
  const [stats, setStats]         = useState({ present: 0, total: 0, materials: 0 })
  const [todayMarked, setTodayMarked] = useState(false)
  const [recentMaterials, setRecentMaterials] = useState([])
  const [loading, setLoading]     = useState(true)

  const currentMonth = new Date().toISOString().substring(0, 7)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    Promise.all([
      teacherApi.get(`/teachers/attendance/my?month=${currentMonth}`).catch(() => ({ data: { data: { present: 0, total: 0 } } })),
      teacherApi.get('/teachers/materials/my').catch(() => ({ data: { data: [] } })),
    ]).then(([attendance, materials]) => {
      const att = attendance.data.data
      setStats({
        present:   att.presentCount || 0,
        total:     att.total || 0,
        materials: materials.data.data?.length || 0,
      })
      // Check today attendance
      const todayRecord = att.attendance?.find(a => a.date === today)
      setTodayMarked(!!todayRecord)
      setRecentMaterials(materials.data.data?.slice(0, 3) || [])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <TeacherLayout>
      <div className="space-y-6">

        {/* Welcome */}
        <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-1">Good Morning, {teacher?.name}! 👋</h2>
          <p className="text-green-200">Subject: {teacher?.subject}</p>
        </div>

        {/* Today Attendance Alert */}
        {!todayMarked && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-yellow-800">Attendance not marked today!</p>
                <p className="text-yellow-600 text-sm">Mark your attendance using face scan</p>
              </div>
            </div>
            <Link to="/teacher/attendance"
              className="bg-yellow-400 text-yellow-900 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-yellow-500 transition">
              Mark Now
            </Link>
          </div>
        )}

        {todayMarked && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <p className="font-semibold text-green-800">Attendance marked for today!</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center">
            <div className="text-4xl mb-2">📅</div>
            <p className="text-3xl font-bold text-green-700">{loading ? '...' : stats.present}</p>
            <p className="text-gray-500 text-sm">Present This Month</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-3xl font-bold text-blue-600">
              {loading ? '...' : stats.total > 0 ? Math.round((stats.present / stats.total) * 100) + '%' : '0%'}
            </p>
            <p className="text-gray-500 text-sm">Attendance Rate</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-center">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-3xl font-bold text-purple-600">{loading ? '...' : stats.materials}</p>
            <p className="text-gray-500 text-sm">Materials Uploaded</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '📸', label: 'Mark Attendance', path: '/teacher/attendance', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
            { icon: '📤', label: 'Upload Material', path: '/teacher/materials', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
            { icon: '📋', label: 'My Attendance', path: '/teacher/attendance', color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700' },
            { icon: '👤', label: 'My Profile', path: '/teacher/profile', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
          ].map(a => (
            <Link key={a.path + a.label} to={a.path}
              className={`${a.color} rounded-xl p-4 text-center transition-all border border-transparent`}>
              <div className="text-3xl mb-2">{a.icon}</div>
              <p className="text-sm font-medium">{a.label}</p>
            </Link>
          ))}
        </div>

        {/* Recent Materials */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="font-semibold text-gray-800">Recent Materials</p>
            <Link to="/teacher/materials" className="text-sm text-green-600 hover:underline">View All</Link>
          </div>
          {recentMaterials.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-4xl mb-2">📚</div>
              <p>No materials uploaded yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentMaterials.map(m => (
                <div key={m._id} className="px-6 py-3 flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{m.title}</p>
                    <p className="text-gray-400 text-xs">{m.subject} • {new Date(m.createdAt).toLocaleDateString('en-IN')}</p>
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