import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function AdminSetup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm)
      return setError('Passwords do not match')

    if (form.password.length < 6)
      return setError('Password must be at least 6 characters')

    setLoading(true)
    try {
      await api.post('/auth/setup', {
        name:     form.name,
        email:    form.email,
        password: form.password,
      })
      alert('Admin account created! Please login.')
      navigate('/admin-login')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Top */}
          <div className="bg-primary px-8 py-6 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
              🏫
            </div>
            <h1 className="text-white text-xl font-bold">Create Admin Account</h1>
            <p className="text-blue-300 text-sm mt-1">First time setup</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <p className="text-gray-500 text-sm text-center mb-6">
              Setup your admin account to manage the school website
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                  placeholder="Principal / Admin name"
                  className={inp}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                  placeholder="your@email.com"
                  className={inp}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                  placeholder="Min 6 characters"
                  className={inp}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                  required
                  placeholder="Confirm your password"
                  className={inp}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
                {loading ? 'Creating...' : 'Create Admin Account'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <a href="/admin-login" className="text-sm text-gray-400 hover:text-primary transition">
                Already have account? Login
              </a>
            </div>
          </div>

        </div>

        <p className="text-blue-300 text-xs text-center mt-4 opacity-70">
          This page works only once — admin already exists toh error aayega
        </p>
      </div>
    </div>
  )
}