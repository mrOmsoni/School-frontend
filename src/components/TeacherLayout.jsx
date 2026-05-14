import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTeacher } from '../context/TeacherContext'

const menuItems = [
  { icon: '📊', label: 'Dashboard',   path: '/teacher/dashboard' },
  { icon: '📸', label: 'Attendance',  path: '/teacher/attendance' },
  { icon: '📚', label: 'Materials',   path: '/teacher/materials' },
  { icon: '⚙️', label: 'Profile',    path: '/teacher/profile' },
]

export default function TeacherLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { teacher, logout } = useTeacher()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/teacher-login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-green-800 text-white flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="px-6 py-5 border-b border-green-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl">
              👨‍🏫
            </div>
            <div>
              <p className="font-bold text-sm">{teacher?.name}</p>
              <p className="text-green-300 text-xs">{teacher?.subject}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-yellow-400 text-green-900'
                  : 'text-green-100 hover:bg-green-700'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-green-700">
          <Link to="/" target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-green-200 hover:bg-green-700 transition-colors mb-1">
            <span>🌐</span> View Website
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-900 transition-colors">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
              ☰
            </button>
            <h1 className="font-semibold text-gray-800">
              {menuItems.find(m => isActive(m.path))?.label || 'Teacher Portal'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">{teacher?.name}</span>
            <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {teacher?.name?.[0]}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}