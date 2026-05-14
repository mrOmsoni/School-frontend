import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../services/api'

export default function ManageGallery() {
  const [images,   setImages]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [form,     setForm]     = useState({ imageUrl: '', caption: '', category: 'Events' })
  const [showForm, setShowForm] = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState(null)
  const [filter,   setFilter]   = useState('All')

  const fetchImages = () => {
    api.get('/gallery')
      .then(r => setImages(r.data.data || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchImages() }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/gallery', form)
      setMsg({ type: 'success', text: 'Image added!' })
      setForm({ imageUrl: '', caption: '', category: 'Events' })
      setShowForm(false)
      fetchImages()
    } catch {
      setMsg({ type: 'error', text: 'Something went wrong.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this image?')) return
    try { await api.delete(`/gallery/${id}`); fetchImages() } catch {}
  }

  const categories = ['All', 'Events', 'Sports', 'Cultural', 'Classroom', 'Campus']
  const filtered = filter === 'All' ? images : images.filter(i => i.category === filter)
  const inp = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition'

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Manage Gallery</h2>
          <button onClick={() => setShowForm(p => !p)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition">
            {showForm ? 'Cancel' : '+ Add Image'}
          </button>
        </div>

        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {msg.text}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Add Image</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input name="imageUrl" value={form.imageUrl}
                  onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                  required placeholder="https://cloudinary.com/..." className={inp} />
                <p className="text-xs text-gray-400 mt-1">Backend banane ke baad Cloudinary upload hoga. Abhi URL paste karo.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className={inp}>
                    {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                  <input value={form.caption}
                    onChange={e => setForm(p => ({ ...p, caption: e.target.value }))}
                    placeholder="Image caption" className={inp} />
                </div>
              </div>
              {form.imageUrl && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img src={form.imageUrl} alt="preview" className="h-40 rounded-lg object-cover border border-gray-200" onError={e => e.target.style.display='none'} />
                </div>
              )}
              <button type="submit" disabled={saving}
                className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition disabled:opacity-60">
                {saving ? 'Adding...' : 'Add to Gallery'}
              </button>
            </form>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === c ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <div className="text-5xl mb-3">🖼️</div>
            <p className="text-gray-500">No images yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(img => (
              <div key={img._id} className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <img src={img.imageUrl} alt={img.caption} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img._id)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg transition">
                    Delete
                  </button>
                </div>
                {img.caption && (
                  <div className="px-2 py-1.5 bg-white">
                    <p className="text-xs text-gray-600 truncate">{img.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  )
}