import { useState } from 'react'
import api from '../services/api'

// ── Hero ──────────────────────────────────────────────────
function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <span className="inline-block bg-accent text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
          Admissions 2026-27
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Join Our <span className="text-accent">Family</span>
        </h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Admissions are open for the new academic session. Give your child
          the best start in life at NewOneEra School.
        </p>
      </div>
    </section>
  )
}

// ── Why Admit ─────────────────────────────────────────────
function WhyAdmit() {
  const points = [
    { icon: '🏆', text: 'Consistent top results in board exams' },
    { icon: '🎨', text: 'Strong focus on arts, sports & co-curriculars' },
    { icon: '👨‍👩‍👧', text: 'Regular parent-teacher communication' },
    { icon: '🔒', text: 'Safe, CCTV-monitored campus' },
    { icon: '🚌', text: 'Transport facility available' },
    { icon: '💻', text: 'Smart classrooms & modern labs' },
  ]

  return (
    <section className="py-14 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-3">Why Admit Your Child Here?</h2>
          <p className="text-gray-500">Reasons thousands of parents trust us</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {points.map((p, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-accent transition-colors">
              <span className="text-3xl">{p.icon}</span>
              <p className="text-gray-700 font-medium text-sm leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Process Steps ─────────────────────────────────────────
function AdmissionProcess() {
  const steps = [
    { step: '01', title: 'Fill Enquiry Form',   desc: 'Submit the online enquiry form below with basic details.' },
    { step: '02', title: 'Document Submission', desc: 'Submit required documents at the school office.' },
    { step: '03', title: 'Interaction Round',   desc: 'Student and parent interaction with the principal.' },
    { step: '04', title: 'Fee Payment',          desc: 'Pay admission fee to confirm the seat.' },
    { step: '05', title: 'Welcome!',             desc: 'Collect admission kit and join the Sun shine smart family.' },
  ]

  return (
    <section className="py-14 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">Admission Process</h2>
          <p className="text-gray-500">Simple 5-step process to secure your child's seat</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 z-0" style={{ width: 'calc(100% - 2rem)' }} />
              )}
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm relative z-10 text-center">
                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="font-semibold text-primary mb-1 text-sm">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Classes & Fees ────────────────────────────────────────
function ClassesFees() {
  const classes = [
    { class: 'Nursery – KG',  age: '3 – 5 years',  fee: '₹ 45,000/year' },
    { class: 'Class I – V',   age: '6 – 10 years',  fee: '₹ 55,000/year' },
    { class: 'Class VI – VIII', age: '11 – 13 years', fee: '₹ 65,000/year' },
    { class: 'Class IX – X',  age: '14 – 15 years', fee: '₹ 75,000/year' },
    { class: 'Class XI – XII', age: '16 – 17 years', fee: '₹ 85,000/year' },
  ]

  return (
    <section className="py-14 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-3">Classes & Fee Structure</h2>
          <p className="text-gray-500">Transparent pricing — no hidden charges</p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Class</th>
                <th className="px-6 py-4 text-left font-semibold">Age Group</th>
                <th className="px-6 py-4 text-left font-semibold">Annual Fee</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((row, i) => (
                <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4 font-medium text-primary">{row.class}</td>
                  <td className="px-6 py-4 text-gray-500">{row.age}</td>
                  <td className="px-6 py-4 text-accent font-semibold">{row.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          * Fee includes tuition, activity, and library charges. Transport fee is extra.
        </p>
      </div>
    </section>
  )
}

// ── Documents Required ────────────────────────────────────
function Documents() {
  const docs = [
    'Birth Certificate (original + photocopy)',
    'Previous class marksheet / report card',
    'Transfer Certificate (TC) from previous school',
    'Aadhaar Card of student',
    'Passport size photographs (4 copies)',
    'Parent/Guardian ID proof',
    'Address proof',
    'Caste certificate (if applicable)',
  ]

  return (
    <section className="py-14 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-3">Documents Required</h2>
          <p className="text-gray-500">Please bring these at the time of admission</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {docs.map((doc, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <span className="text-green-500 font-bold mt-0.5">✓</span>
              <p className="text-gray-700 text-sm">{doc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Enquiry Form ──────────────────────────────────────────
function EnquiryForm() {
  const [form, setForm] = useState({
    parentName: '', studentName: '', email: '',
    phone: '', classApplying: '', message: ''
  })
  const [status, setStatus] = useState(null)

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await api.post('/queries', {
        name: form.parentName,
        email: form.email,
        phone: form.phone,
        subject: 'Admission Enquiry',
        message: `Student Name: ${form.studentName}\nClass Applying For: ${form.classApplying}\n\n${form.message}`,
      })
      setStatus('success')
      setForm({ parentName: '', studentName: '', email: '', phone: '', classApplying: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"

  return (
    <section className="py-16 px-6 bg-white" id="enquiry-form">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-3">Admission Enquiry Form</h2>
          <p className="text-gray-500">Fill this form and we'll contact you within 24 hours</p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">Enquiry Submitted!</h3>
            <p className="text-green-600 mb-6">
              Thank you! Our admissions team will call you within 24 hours.
            </p>
            <button
              onClick={() => setStatus(null)}
              className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm hover:bg-blue-800 transition-colors"
            >
              Submit Another Enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent/Guardian Name <span className="text-red-500">*</span>
                </label>
                <input type="text" name="parentName" value={form.parentName}
                  onChange={handleChange} required placeholder="Parent full name"
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input type="text" name="studentName" value={form.studentName}
                  onChange={handleChange} required placeholder="Student full name"
                  className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input type="email" name="email" value={form.email}
                  onChange={handleChange} required placeholder="your@email.com"
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input type="tel" name="phone" value={form.phone}
                  onChange={handleChange} required placeholder="+91 XXXXX XXXXX"
                  className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Applying For <span className="text-red-500">*</span>
              </label>
              <select name="classApplying" value={form.classApplying}
                onChange={handleChange} required className={inputClass}>
                <option value="">Select class</option>
                {['Nursery','LKG','UKG','Class I','Class II','Class III',
                  'Class IV','Class V','Class VI','Class VII','Class VIII',
                  'Class IX','Class X','Class XI','Class XII'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Message
              </label>
              <textarea name="message" value={form.message} onChange={handleChange}
                rows={4} placeholder="Any specific questions or requirements..."
                className={inputClass} />
            </div>

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
                ❌ Something went wrong. Please call us at +91 12345 67890.
              </div>
            )}

            <button type="submit" disabled={status === 'loading'}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60">
              {status === 'loading' ? 'Submitting...' : 'Submit Enquiry →'}
            </button>

          </form>
        )}
      </div>
    </section>
  )
}

// ── Main ──────────────────────────────────────────────────
export default function Admissions() {
  return (
    <>
      <Hero />
      <WhyAdmit />
      <AdmissionProcess />
      <ClassesFees />
      <Documents />
      <EnquiryForm />
    </>
  )
}