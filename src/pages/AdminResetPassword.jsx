import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function AdminResetPassword() {
  const [form, setForm]     = useState({ newPassword: '', confirm: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const { token }  = useParams()
  const navigate   = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.newPassword !== form.confirm)
      return setError('Passwords do not match')

    if (form.newPassword.length < 6)
      return setError('Password must be at least 6 characters')

    setLoading(true)
    try {
      await api.post(`/auth/reset-password/${token}`, {
        newPassword: form.newPassword
      })
      setStatus('success')
      setTimeout(() => navigate('/admin-login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired link.')
    } finally {
      setLoading(false)
    }
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-primary px-8 py-6 text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            🔒
          </div>
          <h1 className="text-white text-xl font-bold">Reset Password</h1>
          <p className="text-blue-300 text-sm mt-1">Sun Shine Smart School</p>
        </div>

        <div className="px-8 py-8">
          {status === 'success' ? (
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-lg font-bold text-green-700 mb-2">Password Reset!</h3>
              <p className="text-gray-500 text-sm">Redirecting to login page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" value={form.newPassword}
                  onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))}
                  required placeholder="Min 6 characters" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input type="password" value={form.confirm}
                  onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                  required placeholder="Confirm new password" className={inp} />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}