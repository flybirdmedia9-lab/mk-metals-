import { Link } from 'react-router-dom'
import { ShieldCheck, Settings2, Sparkles } from 'lucide-react'
import aboutImage from '../assets/mk/hero.jpg'

export default function About() {
  return (
    <main>
      <section className="section about-hero">
        <div className="container about-hero-shell">
          <div className="about-hero-copy">
            <span className="section-label">About MK Metals</span>
            <h1>
              Engineering premium <span className="hero-accent">metal</span> product solutions for industry.
            </h1>
            <p>
              Our team delivers manufacturing-grade materials, plumbing systems, and high-trust product sourcing for engineering and construction customers.
            </p>
            <Link to="/contact" className="button button--primary">
              Contact us
            </Link>
          </div>
          <div className="about-hero-image">
            <img src={aboutImage} alt="Industrial manufacturing" />
          </div>
        </div>
      </section>

      <section className="section section--light about-panel">
        <div className="container about-panel-grid">
          <div className="about-cards">
            <article className="about-card about-card--large">
              <h3>Our promise</h3>
              <p>
                Clear product details, transparent availability, and dependable enquiries to help procurement teams make confident decisions.
              </p>
            </article>
            <article className="about-card about-card--accent">
              <h3>What we offer</h3>
              <ul>
                <li><ShieldCheck size={18} /> Custom extrusion profiles and metal assemblies</li>
                <li><Settings2 size={18} /> Industrial fittings, plumbing parts and fabrication supplies</li>
                <li><Sparkles size={18} /> Fast WhatsApp enquiries with product-specific messages</li>
              </ul>
            </article>
          </div>

          <div className="about-stats-grid">
            <article className="stat-card stat-card--clean">
              <strong>15+</strong>
              <span>Years serving industry</span>
            </article>
            <article className="stat-card stat-card--clean">
              <strong>250+</strong>
              <span>Projects supplied</span>
            </article>
            <article className="stat-card stat-card--clean">
              <strong>98%</strong>
              <span>Client satisfaction</span>
            </article>
            <article className="stat-card stat-card--clean">
              <strong>50+</strong>
              <span>Trusted partners</span>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
