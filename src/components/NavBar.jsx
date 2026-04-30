import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, PhoneCall, Search, ChevronDown } from 'lucide-react'
import ServiceRequestModal from './ServiceRequestModal'
import Logo from './Logo'

const navItems = [
  { label: 'Home', path: '/' },
  { 
    label: 'Products', 
    path: '/products',
    children: [
      { label: 'All Products', path: '/products' },
      { label: 'New Products', path: '/products?filter=latest' },
    ]
  },
  { label: 'Service Request', action: 'service-modal' },
  { label: 'About', path: '/about' },
  { label: 'Categories', path: '/categories' },
  { label: 'Contact', path: '/contact' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchQuery(params.get('search') || '')
  }, [location.search])

  if (isAdminRoute) {
    return null
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/products')
    }
    setOpen(false)
  }

  return (
    <>
      <header className="site-header">
        <div className="container nav-shell">
          <Link to="/" className="brand-link">
            <Logo className="site-logo" />
          </Link>

          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <Search size={18} />
            </button>
          </form>

          <nav className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Primary navigation">
            <ul>
              {navItems.map((item) => (
                <li 
                  key={item.label} 
                  className={item.children ? 'nav-item-dropdown' : ''}
                  onMouseEnter={() => item.children && setDropdownOpen(true)}
                  onMouseLeave={() => item.children && setDropdownOpen(false)}
                >
                  {item.action === 'service-modal' ? (
                    <button 
                      className="nav-button-link"
                      onClick={() => {
                        setIsServiceModalOpen(true)
                        setOpen(false)
                      }}
                    >
                      {item.label}
                    </button>
                  ) : item.children ? (
                    <div className="dropdown-trigger">
                      <Link 
                        to={item.path} 
                        className={location.pathname === item.path ? 'nav-link--active' : ''}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                      <ChevronDown size={14} className={`dropdown-icon ${dropdownOpen ? 'dropdown-icon--open' : ''}`} />
                      
                      <div className={`dropdown-menu ${dropdownOpen ? 'dropdown-menu--open' : ''}`}>
                        {item.children.map((child) => (
                          <Link 
                            key={child.path} 
                            to={child.path} 
                            onClick={() => {
                              setOpen(false)
                              setDropdownOpen(false)
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link 
                      to={item.path} 
                      className={location.pathname === item.path ? 'nav-link--active' : ''}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <div 
              className="contact-dropdown"
              onMouseEnter={() => setIsContactOpen(true)}
              onMouseLeave={() => setIsContactOpen(false)}
            >
              <button 
                className="button button--primary button--compact contact-trigger"
                onClick={() => setIsContactOpen(!isContactOpen)}
              >
                <PhoneCall size={16} />
                <span>+91 81251 39139</span>
                <ChevronDown size={14} className={isContactOpen ? 'rotate-180' : ''} />
              </button>
              <div className={`contact-menu ${isContactOpen ? 'contact-menu--open' : ''}`}>
                <a href="tel:+918125139139">
                  <strong>Murali Krishna</strong>
                  <span>+91 81251 39139</span>
                </a>
                <a href="https://wa.me/918125139139" target="_blank" rel="noreferrer">
                  <strong>WhatsApp</strong>
                  <span>Send a message</span>
                </a>
                <a href="tel:+918500065222">
                  <strong>Mobile</strong>
                  <span>+91 85000 65222</span>
                </a>
                <a href="tel:04042700227">
                  <strong>Landline</strong>
                  <span>040 427 00 227</span>
                </a>
              </div>
            </div>
          </div>

          <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <ServiceRequestModal 
        isOpen={isServiceModalOpen} 
        onClose={() => setIsServiceModalOpen(false)} 
      />
    </>
  )
}
