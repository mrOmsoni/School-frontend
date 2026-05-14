import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { name: 'Home',       path: '/' },
  { name: 'About',      path: '/about' },
  { name: 'Events',     path: '/events' },
  { name: 'Gallery',    path: '/gallery' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Contact',    path: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { admin, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)

  return (
    <nav className="bg-primary shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo + School Name */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold text-primary text-lg">
            SSS
          </div>
          <div className="leading-tight">
            <p className="text-white font-bold text-base">Sun Shine Smart</p>
            <p className="text-blue-200 text-xs">Excellence in Education</p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-accent text-primary'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Teacher Login */}
          <Link
            to="/teacher-login"
            className="ml-1 px-3 py-2 rounded text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            👨‍🏫 Teacher
          </Link>

          {/* Admin button */}
          {admin ? (
            <div className="flex items-center gap-2 ml-2">
              <Link
                to="/admin"
                className="px-3 py-2 rounded text-sm font-medium bg-accent text-primary hover:bg-yellow-400 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-3 py-2 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/admin-login"
              className="ml-1 px-3 py-2 rounded text-sm font-medium border border-blue-300 text-blue-100 hover:bg-blue-700 transition-colors"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-900 px-4 pb-4 flex flex-col gap-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-accent text-primary'
                  : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Teacher Login Mobile */}
          <Link
            to="/teacher-login"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2 rounded text-sm font-medium bg-green-600 text-white"
          >
            👨‍🏫 Teacher Login
          </Link>

          {/* Admin Mobile */}
          {admin ? (
            <>
              <Link to="/admin" onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded text-sm bg-accent text-primary font-medium">
                Dashboard
              </Link>
              <button onClick={() => { logout(); setMenuOpen(false) }}
                className="px-3 py-2 rounded text-sm bg-red-500 text-white text-left">
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin-login" onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded text-sm border border-blue-300 text-blue-100">
              Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}