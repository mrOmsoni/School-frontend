import { useState, useEffect } from 'react'
import api from '../services/api'

// ── Hero ──────────────────────────────────────────────────
function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <span className="inline-block bg-accent text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
          Photo Gallery
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Our <span className="text-accent">Memories</span>
        </h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Glimpses of life at NewOneEra School — events, sports, celebrations and more.
        </p>
      </div>
    </section>
  )
}

// ── Filter Bar ────────────────────────────────────────────
function FilterBar({ active, setActive }) {
  const filters = ['All', 'Events', 'Sports', 'Cultural', 'Classroom', 'Campus']
  return (
    <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              active === f
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Lightbox ──────────────────────────────────────────────
function Lightbox({ image, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft')  onPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onNext, onPrev])

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-accent transition-colors z-10"
        onClick={onClose}
      >
        ✕
      </button>

      {/* Prev */}
      <button
        className="absolute left-4 text-white text-4xl font-bold hover:text-accent transition-colors z-10 px-3 py-2"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
      >
        ‹
      </button>

      {/* Image */}
      <div onClick={e => e.stopPropagation()} className="max-w-4xl w-full">
        <img
          src={image.imageUrl}
          alt={image.caption || ''}
          className="w-full max-h-[80vh] object-contain rounded-xl"
        />
        {image.caption && (
          <p className="text-white text-center mt-4 text-sm opacity-80">{image.caption}</p>
        )}
        {image.category && (
          <p className="text-accent text-center text-xs mt-1 uppercase tracking-wider">{image.category}</p>
        )}
      </div>

      {/* Next */}
      <button
        className="absolute right-4 text-white text-4xl font-bold hover:text-accent transition-colors z-10 px-3 py-2"
        onClick={(e) => { e.stopPropagation(); onNext() }}
      >
        ›
      </button>
    </div>
  )
}

// ── Gallery Grid ──────────────────────────────────────────
function GalleryGrid({ images, onImageClick }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {images.map((image, index) => (
        <div
          key={image._id || index}
          className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all"
          onClick={() => onImageClick(index)}
        >
          <img
            src={image.imageUrl}
            alt={image.caption || 'Gallery image'}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-primary bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
            {image.caption && (
              <p className="text-white text-sm px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {image.caption}
              </p>
            )}
          </div>
          {/* Category badge */}
          {image.category && (
            <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              {image.category}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────
function Skeleton() {
  const heights = ['h-48', 'h-64', 'h-40', 'h-56', 'h-44', 'h-60', 'h-36', 'h-52']
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {heights.map((h, i) => (
        <div key={i} className={`break-inside-avoid ${h} bg-gray-200 rounded-xl animate-pulse`} />
      ))}
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────
function EmptyState({ filter }) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🖼️</div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Photos Yet</h3>
      <p className="text-gray-400 text-sm">
        {filter === 'All'
          ? 'Gallery is empty. Photos will appear here once added.'
          : `No photos in "${filter}" category yet.`}
      </p>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────
export default function Gallery() {
  const [images,   setImages]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('All')
  const [lightbox, setLightbox] = useState(null) // index of open image

  useEffect(() => {
    api.get('/gallery')
      .then(res => setImages(res.data.data || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All'
    ? images
    : images.filter(img => img.category === filter)

  const openLightbox  = (index) => setLightbox(index)
  const closeLightbox = () => setLightbox(null)
  const prevImage     = () => setLightbox(i => (i - 1 + filtered.length) % filtered.length)
  const nextImage     = () => setLightbox(i => (i + 1) % filtered.length)

  return (
    <>
      <Hero />
      <FilterBar active={filter} setActive={setFilter} />

      <section className="py-12 px-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Count */}
          {!loading && images.length > 0 && (
            <p className="text-gray-500 text-sm mb-6">
              Showing <span className="font-semibold text-primary">{filtered.length}</span> photo{filtered.length !== 1 ? 's' : ''}
              {filter !== 'All' && ` in "${filter}"`}
            </p>
          )}

          {loading ? (
            <Skeleton />
          ) : filtered.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <GalleryGrid images={filtered} onImageClick={openLightbox} />
          )}

        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox
          image={filtered[lightbox]}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  )
}