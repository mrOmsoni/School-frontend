import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-primary text-white">

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Column 1 — School info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold text-primary text-lg">
              S
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">Sun Shine Smart School</p>
              <p className="text-blue-300 text-xs">Excellence in Education</p>
            </div>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed">
            Providing quality education and shaping the future of students since 2020.
            Our mission is to nurture every child's potential.
          </p>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <h3 className="font-semibold text-accent mb-4 text-sm uppercase tracking-wider">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {[
              { name: 'Home',       path: '/' },
              { name: 'About Us',   path: '/about' },
              { name: 'Events',     path: '/events' },
              { name: 'Gallery',    path: '/gallery' },
              { name: 'Admissions', path: '/admissions' },
              { name: 'Contact',    path: '/contact' },
            ].map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="text-blue-200 hover:text-accent text-sm transition-colors"
                >
                  → {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Contact Info */}
        <div>
          <h3 className="font-semibold text-accent mb-4 text-sm uppercase tracking-wider">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm text-blue-200">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">📍</span>
              <span>Post office road Bargi, Sihora, Jabalpur -483225</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span>
              <a href="tel:+911234567890" className="hover:text-accent transition-colors">
                +91 12345 67890
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span>✉️</span>
              <a href="mailto:info@newoneera.school" className="hover:text-accent transition-colors">
                info@sunshine.school
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span>🕐</span>
              <span>Mon – Sat: 8:00 AM – 4:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-blue-300 text-xs">
            © {new Date().getFullYear()} Sun Shine Smart School. All rights reserved.
          </p>
          <p className="text-blue-400 text-xs">
            Om
          </p>
        </div>
      </div>

    </footer>
  )
}