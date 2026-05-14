import { useState } from 'react'
import api from '../services/api'

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-primary px-8 py-6 text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            🔑
          </div>
          <h1 className="text-white text-xl font-bold">Forgot Password</h1>
          <p className="text-blue-300 text-sm mt-1">Sun Shine Smart School</p>
        </div>

        <div className="px-8 py-8">
          {status === 'success' ? (
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-lg font-bold text-green-700 mb-2">Email Sent!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Reset link has been sent to your email. Check your inbox.
              </p>
              <a href="/admin-login" className="text-primary text-sm hover:underline font-medium">
                Back to Login
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-500 text-sm text-center mb-2">
                Enter your admin email — we'll send a reset link.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                  Something went wrong. Please try again.
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="text-center">
                <a href="/admin-login" className="text-sm text-gray-400 hover:text-primary transition">
                  Back to Login
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}