import { useState } from 'react'
import api from '../services/api'

// ── Hero ──────────────────────────────────────────────────
function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <span className="inline-block bg-accent text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
          Get In Touch
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Contact <span className="text-accent">Us</span>
        </h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Have a question or want to visit us? We'd love to hear from you.
        </p>
      </div>
    </section>
  )
}

// ── Contact Info Cards ────────────────────────────────────
function InfoCards() {
  const cards = [
    {
      icon: '📍',
      title: 'Our Address',
      lines: ['Post office road Bargi', 'Sihora, Jabalpur - 483225'],
    },
    {
      icon: '📞',
      title: 'Phone Numbers',
      lines: ['+91 12345 67890', '+91 98765 43210'],
    },
    {
      icon: '✉️',
      title: 'Email Us',
      lines: ['info@newoneera.school', 'admissions@newoneera.school'],
    },
    {
      icon: '🕐',
      title: 'Office Hours',
      lines: ['Mon – Sat: 8:00 AM – 4:00 PM', 'Sunday: Closed'],
    },
  ]

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(card => (
          <div key={card.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3">{card.icon}</div>
            <h3 className="font-semibold text-primary mb-2">{card.title}</h3>
            {card.lines.map((line, i) => (
              <p key={i} className="text-gray-500 text-sm">{line}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Query Form ────────────────────────────────────────────
function QueryForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  })
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await api.post('/queries', form)
      setStatus('success')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

        {/* Left — text */}
        <div className="lg:w-2/5">
          <h2 className="text-3xl font-bold text-primary mb-4">Send Us a Message</h2>
          <p className="text-gray-500 leading-relaxed mb-6">
            Fill out the form and our team will get back to you within 24 hours.
            For urgent queries, please call us directly.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <p className="text-primary font-semibold mb-2">📌 Quick Note</p>
            <p className="text-gray-500 text-sm leading-relaxed">
              For admission-related queries, please visit our Admissions page
              or call us directly at <span className="text-primary font-medium">+91 12345 67890</span>.
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div className="lg:w-3/5">
          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-700 mb-2">Message Sent!</h3>
              <p className="text-green-600 text-sm mb-6">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setStatus(null)}
                className="bg-primary text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Select a subject</option>
                    <option value="Admission Enquiry">Admission Enquiry</option>
                    <option value="Fee Structure">Fee Structure</option>
                    <option value="Transport">Transport</option>
                    <option value="Academic Query">Academic Query</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Write your message here..."
                  className={inputClass}
                />
              </div>

              {/* Error */}
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                  ❌ Something went wrong. Please try again or call us directly.
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  )
}

// ── Map Section ───────────────────────────────────────────
function MapSection() {
  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Find Us Here</h2>
        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 h-80">
          <iframe
            title="School Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.6742757946!2d77.2090212!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x77acda8d4b8e5b%3A0x2c04e53bdb2b7e89!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

// ── Main ──────────────────────────────────────────────────
export default function Contact() {
  return (
    <>
      <Hero />
      <InfoCards />
      <QueryForm />
      <MapSection />
    </>
  )
}