import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

// ── Hero Section ──────────────────────────────────────────
function Hero() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400',
      title: 'Welcome to Sun Shine Smart School',
      subtitle: "Shaping Tomorrow's Leaders Today",
    },
    {
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1400',
      title: 'Excellence in Education',
      subtitle: 'World-class learning environment for every child',
    },
    {
      image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1400',
      title: 'Sports & Activities',
      subtitle: 'Nurturing talent beyond the classroom',
    },
    {
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1400',
      title: 'Modern Infrastructure',
      subtitle: 'State-of-the-art facilities for better learning',
    },
    {
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1400',
      title: 'Admissions Open 2025-26',
      subtitle: "Secure your child's future today",
    },
  ]

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % slides.length)
  }, [slides.length])

  const prev = () => {
    setCurrent(c => (c - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [paused, next])

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '90vh' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
            <span className="inline-block bg-accent text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              Sun Shine Smart School Bargi
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl drop-shadow">
              {slide.subtitle}
            </p>
            <div className="flex gap-4">
              <a href="/admissions" className="bg-accent text-primary font-semibold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors">
                Apply Now
              </a>
              <a href="/about" className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors">
                Learn More
              </a>
            </div>
          </div>
        </div>
      ))}

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center text-2xl transition-all">
        ‹
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center text-2xl transition-all">
        ›
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${
              i === current ? 'w-8 h-3 bg-accent' : 'w-3 h-3 bg-white bg-opacity-60 hover:bg-opacity-100'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 z-20 h-1 bg-accent transition-all duration-300"
        style={{ width: `${((current + 1) / slides.length) * 100}%` }}
      />
    </section>
  )
}

// ── Notice Board ──────────────────────────────────────────
function NoticeBoard({ notices }) {
  if (!notices.length) return null
  return (
    <section className="bg-yellow-50 border-y border-yellow-200 py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
        <span className="bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap uppercase">
          📢 Notice
        </span>
        <div className="overflow-hidden flex-1">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {notices.map((n, i) => (
              <span key={i} className="text-sm text-gray-700">
                {n.title} &nbsp;•&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Features Section ──────────────────────────────────────
function Features() {
  const items = [
    {
      icon: '🎓',
      title: 'Academic Excellence',
      desc: 'Rigorous curriculum designed to bring out the best in every student.',
      back: 'Board toppers every year with 95% pass rate and scholarships.',
      color: '#1a3c6e',
    },
    {
      icon: '⚽',
      title: 'Sports & Activities',
      desc: 'Wide range of sports, arts, and extracurricular programs.',
      back: 'Cricket, football, chess, dance, music and 20+ more activities.',
      color: '#16a34a',
    },
    {
      icon: '🔬',
      title: 'Modern Labs',
      desc: 'State-of-the-art science, computer, and language labs.',
      back: 'Physics, Chemistry, Biology, Computer labs with latest equipment.',
      color: '#7c3aed',
    },
    {
      icon: '🛡️',
      title: 'Safe Environment',
      desc: 'CCTV-monitored campus with trained security staff.',
      back: '24/7 CCTV surveillance, biometric entry, trained guards on duty.',
      color: '#dc2626',
    },
    {
      icon: '🚌',
      title: 'Transport Facility',
      desc: 'Safe and reliable bus service covering all major areas.',
      back: 'GPS-tracked buses covering 30+ routes across the city.',
      color: '#d97706',
    },
    {
      icon: '📚',
      title: 'Rich Library',
      desc: 'Thousands of books, journals, and digital resources.',
      back: '10,000+ books, e-library access, newspapers and magazines daily.',
      color: '#0891b2',
    },
  ]

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block bg-accent text-primary text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
            Why Choose Us
          </span>
          <h2 className="text-4xl font-bold text-primary mb-4">
            Everything Your Child Needs
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Hover over each card to know more about our facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="group"
              style={{ perspective: '1000px', height: '220px' }}
            >
              <div
                className="relative w-full h-full transition-all duration-700"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(0deg)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'rotateY(180deg)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'rotateY(0deg)'}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md border border-gray-100 bg-white"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg"
                    style={{ background: item.color }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: item.color,
                  }}
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="font-bold text-white text-lg mb-3">{item.title}</h3>
                  <p className="text-white text-sm leading-relaxed opacity-90">{item.back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: '1200+', label: 'Students', icon: '👨‍🎓' },
            { number: '80+',   label: 'Teachers', icon: '👩‍🏫' },
            { number: '20+',   label: 'Years',    icon: '🏆' },
            { number: '95%',   label: 'Pass Rate', icon: '📈' },
          ].map(stat => (
            <div key={stat.label} className="bg-primary rounded-2xl p-5 text-center text-white shadow-md">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <p className="text-3xl font-bold text-accent">{stat.number}</p>
              <p className="text-blue-200 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ── Latest Events ─────────────────────────────────────────
function LatestEvents({ events }) {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-primary">Latest Events</h2>
            <p className="text-gray-500 mt-1">Stay updated with school activities</p>
          </div>
          <Link to="/events" className="text-sm font-medium text-accent hover:underline">
            View All
          </Link>
        </div>
        {events.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No events yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                {event.imageUrl && (
                  <img src={event.imageUrl} alt={event.title} className="w-full h-44 object-cover" />
                )}
                <div className="p-5">
                  <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-1">
                    {new Date(event.date).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                  <h3 className="font-semibold text-primary text-lg mb-2">{event.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ── CTA Section ───────────────────────────────────────────
function CTA() {
  return (
    <section className="bg-primary py-16 px-6 text-white text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Join Our School?</h2>
        <p className="text-blue-200 mb-8">
          Admissions are open for the new academic session. Secure your child's future today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/admissions" className="bg-accent text-primary font-semibold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors">
            Apply Now
          </Link>
          <Link to="/contact" className="border border-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Main Home Component ───────────────────────────────────
export default function Home() {
  const [events, setEvents]   = useState([])
  const [notices, setNotices] = useState([])

  useEffect(() => {
    api.get('/events')
      .then(res => setEvents(res.data.data?.slice(0, 3) || []))
      .catch(() => {})
    api.get('/notices')
      .then(res => setNotices(res.data.data || []))
      .catch(() => {})
  }, [])

  return (
    <>
      <Hero />
      <NoticeBoard notices={notices} />
      <Features />
      <LatestEvents events={events} />
      <CTA />
    </>
  )
}

// vjfm wgci uuuf asxv