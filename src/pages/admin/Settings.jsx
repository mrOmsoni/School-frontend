import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../services/api'

export default function Settings() {
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [profileMsg, setProfileMsg] = useState(null)
  const [passMsg, setPassMsg]       = useState(null)
  const [saving, setSaving]         = useState(false)
  const [savingPass, setSavingPass] = useState(false)

  useEffect(() => {
    api.get('/auth/me')
      .then(r => setProfile({ name: r.data.data.name, email: r.data.data.email }))
      .catch(() => {})
  }, [])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/auth/update-profile', profile)
      setProfileMsg({ type: 'success', text: 'Profile updated!' })
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed' })
    } finally {
      setSaving(false)
      setTimeout(() => setProfileMsg(null), 3000)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirm)
      return setPassMsg({ type: 'error', text: 'Passwords do not match' })

    setSavingPass(true)
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword:     passwords.newPassword,
      })
      setPassMsg({ type: 'success', text: 'Password changed!' })
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || 'Failed' })
    } finally {
      setSavingPass(false)
      setTimeout(() => setPassMsg(null), 3000)
    }
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition'

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">

        <h2 className="text-xl font-bold text-gray-800">Account Settings</h2>

        {/* Profile */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Update Profile</h3>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                required
                className={inp}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                required
                className={inp}
              />
            </div>
            {profileMsg && (
              <div className={`px-4 py-2 rounded-lg text-sm ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {profileMsg.text}
              </div>
            )}
            <button type="submit" disabled={saving}
              className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Change Password</h3>
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
                required
                placeholder="Current password"
                className={inp}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                required
                placeholder="Min 6 characters"
                className={inp}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                required
                placeholder="Confirm new password"
                className={inp}
              />
            </div>
            {passMsg && (
              <div className={`px-4 py-2 rounded-lg text-sm ${passMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {passMsg.text}
              </div>
            )}
            <button type="submit" disabled={savingPass}
              className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition disabled:opacity-60">
              {savingPass ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

      </div>
    </AdminLayout>
  )
}