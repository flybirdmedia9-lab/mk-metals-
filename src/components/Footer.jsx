import { MapPin, Phone, Mail, ExternalLink, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-branding">
          <Link to="/" className="footer-logo-link">
            <Logo className="footer-logo" />
            <p className="footer-title">MK Metals</p>
          </Link>
          <p className="footer-copy">
            Premium industrial metal products, engineered fittings, and plumbing solutions with reliable enquiry workflows.
          </p>
        </div>

        <div className="footer-links">
          <p className="footer-subtitle">Quick links</p>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/products">Products</Link>
          <Link to="/categories">Categories</Link>
        </div>

        <div className="footer-contact">
          <p className="footer-subtitle">Contact</p>
          <p>
            <Phone size={16} /> <a href="tel:+918125139139">+91 81251 39139</a>
          </p>
          <p>
            <Mail size={16} /> <a href="mailto:info@mkmetals.in">info@mkmetals.in</a>
          </p>
          <p>
            <MapPin size={16} /> #3, TSK Chambers, Opp. Ranigunj Bus Depot, M.G. Road, Ranigunj, SECUNDERABAD - 500003, Telangana.
          </p>
        </div>

        <div className="footer-company">
          <p className="footer-subtitle">Follow us</p>
          <div className="footer-socials">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              <ExternalLink size={18} />
            </a>
            <a href="https://www.google.com" target="_blank" rel="noreferrer">
              <Globe size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
