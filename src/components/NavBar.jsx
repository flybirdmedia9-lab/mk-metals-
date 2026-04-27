import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, PhoneCall } from 'lucide-react'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Products', path: '/products' },
  { label: 'Categories', path: '/categories' },
  { label: 'Contact', path: '/contact' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return null
  }

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link to="/" className="brand-link">
          <span className="brand-mark">MK</span>
          <span className="brand-name">MK Metals</span>
        </Link>

        <nav className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Primary navigation">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} onClick={() => setOpen(false)}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <a href="tel:+918125139139" className="button button--primary button--compact">
            <PhoneCall size={16} />
            <span>+91 81251 39139</span>
          </a>
        </div>

        <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  )
}
