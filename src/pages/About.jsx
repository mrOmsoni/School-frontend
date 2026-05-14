import { Link } from 'react-router-dom'

// ── Hero ──────────────────────────────────────────────────
function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <span className="inline-block bg-accent text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
          About Us
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Know Our <span className="text-accent">Story</span>
        </h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto">
          Two decades of shaping young minds with values, knowledge, and purpose.
        </p>
      </div>
    </section>
  )
}

// ── Our Story ─────────────────────────────────────────────
function OurStory() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">

        {/* Image placeholder */}
        <div className="flex-1 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl h-72 flex items-center justify-center">
          <div className="text-center text-primary">
            <div className="text-6xl mb-3">🏫</div>
            <p className="font-semibold">Sun Shine Smart School</p>
            <p className="text-sm text-blue-400">Est. 2020</p>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-primary mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Founded in 2020, Sun Shine Smart School began with a simple yet powerful vision —
            to create an educational institution where every child feels valued, challenged,
            and inspired to achieve their fullest potential.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Over the past two decades, we have grown from a small school of 100 students
            to a thriving community of over 1,000 students, 20+ dedicated teachers, and
            countless alumni making their mark across the world.
          </p>
          <div className="flex gap-8">
            {[
              { number: '2020', label: 'Founded' },
              { number: '1000+', label: 'Students' },
              { number: '20+', label: 'Teachers' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-accent">{s.number}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

// ── Vision & Mission ──────────────────────────────────────
function VisionMission() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">Vision & Mission</h2>
          <p className="text-gray-500">What drives us every single day</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🔭',
              title: 'Our Vision',
              desc: 'To be a globally recognized institution that nurtures compassionate, creative, and competent individuals ready to lead the world.',
              bg: 'bg-blue-50 border-blue-200',
              titleColor: 'text-primary',
            },
            {
              icon: '🎯',
              title: 'Our Mission',
              desc: 'To provide holistic education through innovative teaching, strong values, and an inclusive environment where every student thrives.',
              bg: 'bg-yellow-50 border-yellow-200',
              titleColor: 'text-accent',
            },
            {
              icon: '💎',
              title: 'Our Values',
              desc: 'Integrity, Excellence, Respect, Innovation, and Empathy — these five values form the cornerstone of everything we do.',
              bg: 'bg-green-50 border-green-200',
              titleColor: 'text-green-700',
            },
          ].map(item => (
            <div key={item.title} className={`p-8 rounded-xl border ${item.bg}`}>
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className={`text-xl font-bold mb-3 ${item.titleColor}`}>{item.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Principal Message ─────────────────────────────────────
function PrincipalMessage() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-3">Principal's Message</h2>
        </div>
        <div className="bg-gradient-to-br from-primary to-blue-800 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row gap-8 items-center">
          {/* Avatar */}
          <div className="flex-shrink-0 text-center">
            <div className="w-28 h-28 bg-accent rounded-full flex items-center justify-center text-5xl mx-auto mb-3">
              👨‍🏫
            </div>
            <p className="font-semibold text-lg">Mr. Satyam Mishra</p>
            <p className="text-blue-300 text-sm">Principal</p>
          </div>
          {/* Quote */}
          <div>
            <div className="text-accent text-6xl leading-none mb-2 font-serif">"</div>
            <p className="text-blue-100 leading-relaxed italic">
              At Sun Shine Smart School, we believe that education is not just about passing exams —
              it's about building character, developing resilience, and igniting a lifelong love
              for learning. Every child who walks through our gates is a future leader, and we
              are committed to giving them the best foundation possible.
            </p>
            <p className="mt-4 text-accent font-medium">— Mr. Satyam Mishra</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Team / Staff ──────────────────────────────────────────
function Team() {
  const staff = [
    { name: 'Mrs. Priya Verma',   role: 'Vice Principal',       emoji: '👩‍💼' },
    { name: 'Mr. Anil Kumar',     role: 'Head of Science Dept', emoji: '🔬' },
    { name: 'Mrs. Sunita Gupta',  role: 'Head of Mathematics',  emoji: '📐' },
    { name: 'Mr. Vikram Singh',   role: 'Sports Director',      emoji: '🏃' },
    { name: 'Mrs. Kavita Joshi',  role: 'Head of Arts',         emoji: '🎨' },
    { name: 'Mr. Deepak Rao',     role: 'IT & Tech Lead',       emoji: '💻' },
  ]

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-3">Our Leadership Team</h2>
          <p className="text-gray-500">Experienced educators dedicated to your child's growth</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {staff.map(member => (
            <div key={member.name} className="bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-4xl mb-3">{member.emoji}</div>
              <p className="font-semibold text-primary text-sm">{member.name}</p>
              <p className="text-gray-400 text-xs mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────
function CTA() {
  return (
    <section className="bg-primary py-14 px-6 text-white text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Want to Be Part of Our Family?</h2>
        <p className="text-blue-200 mb-8">
          Admissions open for new session. Come visit us or apply online today.
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

// ── Main ──────────────────────────────────────────────────
export default function About() {
  return (
    <>
      <Hero />
      <OurStory />
      <VisionMission />
      <PrincipalMessage />
      <Team />
      <CTA />
    </>
  )
}