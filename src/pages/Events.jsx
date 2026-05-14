import { useState, useEffect } from 'react'
import api from '../services/api'

// ── Hero ──────────────────────────────────────────────────
function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <span className="inline-block bg-accent text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
          School Events
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Latest <span className="text-accent">Events</span>
        </h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Stay updated with everything happening at Sun Shine Smart School.
        </p>
      </div>
    </section>
  )
}

// ── Filter Bar ────────────────────────────────────────────
function FilterBar({ active, setActive }) {
  const filters = ['All', 'Academic', 'Sports', 'Cultural', 'Holiday', 'Other']
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

// ── Event Card ────────────────────────────────────────────
function EventCard({ event }) {
  const date = new Date(event.date)
  const day   = date.toLocaleDateString('en-IN', { day: '2-digit' })
  const month = date.toLocaleDateString('en-IN', { month: 'short' })
  const year  = date.toLocaleDateString('en-IN', { year: 'numeric' })

  const categoryColors = {
    Academic: 'bg-blue-100 text-blue-700',
    Sports:   'bg-green-100 text-green-700',
    Cultural: 'bg-purple-100 text-purple-700',
    Holiday:  'bg-red-100 text-red-700',
    Other:    'bg-gray-100 text-gray-700',
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col">
      {/* Image */}
      {event.imageUrl ? (
        <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-5xl">
          🎉
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Date + Category */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white rounded-lg px-3 py-1 text-center leading-tight">
              <p className="text-lg font-bold">{day}</p>
              <p className="text-xs">{month} {year}</p>
            </div>
          </div>
          {event.category && (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[event.category] || categoryColors.Other}`}>
              {event.category}
            </span>
          )}
        </div>

        <h3 className="font-bold text-primary text-lg mb-2">{event.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">
          {event.description}
        </p>

        {event.location && (
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
            📍 {event.location}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────
function EmptyState({ filter }) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">📅</div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Found</h3>
      <p className="text-gray-400 text-sm">
        {filter === 'All'
          ? 'No events have been added yet. Check back soon!'
          : `No events in "${filter}" category yet.`}
      </p>
    </div>
  )
}

// ── Skeleton Loader ───────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────
export default function Events() {
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('All')

  useEffect(() => {
    api.get('/events')
      .then(res => setEvents(res.data.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All'
    ? events
    : events.filter(e => e.category === filter)

  return (
    <>
      <Hero />
      <FilterBar active={filter} setActive={setFilter} />

      <section className="py-12 px-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Count */}
          {!loading && events.length > 0 && (
            <p className="text-gray-500 text-sm mb-6">
              Showing <span className="font-semibold text-primary">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''}
              {filter !== 'All' && ` in "${filter}"`}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  )
}