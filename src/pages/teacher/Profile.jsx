import { useState, useEffect } from 'react'
import TeacherLayout from '../../components/TeacherLayout'
import teacherApi from '../../services/teacherApi'
import { useTeacher } from '../../context/TeacherContext'

export default function TeacherProfile() {
  const { teacher, login } = useTeacher()
  const [form, setForm]     = useState({ name: '', email: '', phone: '', subject: '', qualification: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [profileMsg, setProfileMsg] = useState(null)
  const [passMsg,    setPassMsg]    = useState(null)
  const [saving,     setSaving]     = useState(false)
  const [savingPass, setSavingPass] = useState(false)

  useEffect(() => {
    teacherApi.get('/teachers/me').then(r => {
      const t = r.data.data
      setForm({
        name:          t.name || '',
        email:         t.email || '',
        phone:         t.phone || '',
        subject:       t.subject || '',
        qualification: t.qualification || '',
      })
    }).catch(() => {})
  }, [])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await teacherApi.put(`/teachers/${teacher?._id || ''}`, form)
      setProfileMsg({ type: 'success', text: 'Profile updated!' })
    } catch {
      setProfileMsg({ type: 'error', text: 'Update failed.' })
    } finally {
      setSaving(false)
      setTimeout(() => setProfileMsg(null), 3000)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirm)
      return setPassMsg({ type: 'error', text: 'Passwords do not match' })
    if (passwords.newPassword.length < 6)
      return setPassMsg({ type: 'error', text: 'Min 6 characters required' })

    setSavingPass(true)
    try {
      await teacherApi.put('/teachers/change-password', {
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

  const inp = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition'

  return (
    <TeacherLayout>
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800">My Profile</h2>

        {/* Profile Card */}
        <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-2xl p-6 text-white flex items-center gap-4">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-3xl font-bold text-green-900">
            {form.name?.[0] || '?'}
          </div>
          <div>
            <p className="text-xl font-bold">{form.name}</p>
            <p className="text-green-200">{form.subject}</p>
            <p className="text-green-300 text-sm">{form.email}</p>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Edit Profile</h3>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required className={inp} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX" className={inp} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  required className={inp} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <input value={form.qualification}
                  onChange={e => setForm(p => ({ ...p, qualification: e.target.value }))}
                  placeholder="e.g. M.Sc, B.Ed" className={inp} />
              </div>
            </div>
            {profileMsg && (
              <div className={`px-4 py-2 rounded-lg text-sm ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {profileMsg.text}
              </div>
            )}
            <button type="submit" disabled={saving}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Change Password</h3>
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" value={passwords.currentPassword}
                onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
                required placeholder="Current password" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" value={passwords.newPassword}
                onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                required placeholder="Min 6 characters" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" value={passwords.confirm}
                onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                required placeholder="Confirm new password" className={inp} />
            </div>
            {passMsg && (
              <div className={`px-4 py-2 rounded-lg text-sm ${passMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {passMsg.text}
              </div>
            )}
            <button type="submit" disabled={savingPass}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-60">
              {savingPass ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

      </div>
    </TeacherLayout>
  )
}