import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menuItems = [
  { icon: '📊', label: 'Dashboard',  path: '/admin' },
  { icon: '🎉', label: 'Events',     path: '/admin/events' },
  { icon: '📢', label: 'Notices',    path: '/admin/notices' },
  { icon: '🖼️', label: 'Gallery',   path: '/admin/gallery' },
  { icon: '💬', label: 'Queries',    path: '/admin/queries' },
  { icon: '👨‍🏫', label: 'Teachers',  path: '/admin/teachers' },
  { icon: '⚙️', label: 'Settings',  path: '/admin/settings' },
]
export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()
  const location   = useLocation()
  const navigate   = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) =>
    path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(path)

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center font-bold text-primary">
              S
            </div>
            <div>
              <p className="font-bold text-sm">Sun Shine Smart School</p>
              <p className="text-blue-300 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-accent text-primary'
                  : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-blue-700 space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-blue-200 hover:bg-blue-700 transition-colors"
          >
            <span>🌐</span> View Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-900 hover:text-red-200 transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-primary"
            >
              ☰
            </button>
            <h1 className="font-semibold text-gray-800 text-lg">
              {menuItems.find(m => isActive(m.path))?.label || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">Welcome, Admin</span>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </div>
  )
}