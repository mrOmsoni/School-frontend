import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.data.token)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          <div className="bg-primary px-8 py-6 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
              🔐
            </div>
            <h1 className="text-white text-xl font-bold">Admin Portal</h1>
            <p className="text-blue-300 text-sm mt-1">Sun Shine Smart School</p>
          </div>

          <div className="px-8 py-8">
            <p className="text-gray-500 text-sm text-center mb-6">
              Sign in to access the admin dashboard
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@newoneera.school"
                  className={inp}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className={inp + ' pr-12'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div className="text-center mt-3">
              <a href="/admin-forgot-password"
              className="text-sm text-blue-300 hover:text-accent transition">
              Forgot Password?
              </a>
            </div>

            <div className="mt-6 text-center">
              <a href="/" className="text-sm text-gray-400 hover:text-primary transition-colors">
                Back to School Website
              </a>
            </div>
          </div>
        </div>

        <p className="text-blue-300 text-xs text-center mt-4 opacity-70">
          Secure admin area — authorized personnel only
        </p>
      </div>
    </div>
  )
}