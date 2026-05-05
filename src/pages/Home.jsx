import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Sparkles, Layers, MessageCircle } from 'lucide-react'
import { productsApi, categoriesApi } from '../utils/api.js'
import HeroSlider from '../components/HeroSlider.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../context/CartContext.jsx'
import heroImage from '../assets/mk/hero.jpg'
import chemicalImage from '../assets/mk/fischer-chemical.jpg'
import steelImage from '../assets/mk/fischer-steel.jpg'
import sanitaryImage from '../assets/mk/fischer-sanitary.jpg'

const heroSlides = [
  { id: 'hero-main', image: heroImage },
  { id: 'hero-chemical', image: chemicalImage },
  { id: 'hero-steel', image: steelImage },
  { id: 'hero-sanitary', image: sanitaryImage },
]

export default function Home() {
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  useEffect(() => {
    productsApi.getAll().then(setAllProducts).catch(() => {})
    categoriesApi.getAll().then(setCategories).catch(() => {})
  }, [])
  const featured = allProducts.filter((p) => p.featured)
  const featuredProducts = featured.length >= 4
    ? featured.slice(0, 4)
    : [...featured, ...allProducts.filter((p) => !p.featured).slice(0, 4 - featured.length)]
  const previewProducts = featuredProducts.slice(0, 3)
  const applications = categories.slice(0, 8)
  const { addToCart } = useCart()

  return (
    <main>
      <section className="hero-section home-hero">
        <HeroSlider slides={heroSlides} intervalMs={5200} />
        <div className="hero-overlay" />
        <div className="container hero-shell">
          <div className="hero-content">
            <span className="eyebrow">Industrial Manufacturing</span>
            <h1 className="home-hero-title">
              <span>Precision </span>
              <span className="hero-accent">extrusions</span>
              <span> and engineered metal solutions.</span>
            </h1>
            <p>
              MK Metals delivers high-performance metal products and plumbing systems for commercial, construction, and industrial projects across India.
            </p>

            <div className="hero-actions">
              <Link to="/products" className="button button--primary">
                Our Products
                <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="button button--outline">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-card">
              <span className="section-label">Trusted by projects</span>
              <h2>Modern engineering quality for precision builds.</h2>
              <p>
                Built for customers who demand strong materials, reliable specifications, and a structured enquiry workflow.
              </p>
              <div className="hero-stat-grid">
                <div>
                  <strong>{allProducts.length}+</strong>
                  <span>Catalog items</span>
                </div>
                <div>
                  <strong>{categories.length}</strong>
                  <span>Category lines</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container section-heading">
          <span className="section-label">Why choose us</span>
          <h2>Industrial-grade sourcing with a premium business focus.</h2>
          <p>
            Clear materials data, fast enquiry access, and expert support for buyers, contractors and project teams.
          </p>
        </div>

        <div className="container">
          <div className="features-grid">
            <article className="feature-card feature-card--elevated">
              <ShieldCheck size={24} />
              <h3>Trusted specification workflows</h3>
              <p>Clear product details and curated machining solutions that reduce procurement guesswork.</p>
            </article>
            <article className="feature-card feature-card--elevated">
              <Sparkles size={24} />
              <h3>Premium materials assurance</h3>
              <p>Quality-tested metal profiles and fittings for industrial, construction and plumbing applications.</p>
            </article>
            <article className="feature-card feature-card--elevated">
              <Layers size={24} />
              <h3>Efficient enquiry experience</h3>
              <p>Products and categories are structured for fast evaluation and contact through WhatsApp or direct sales.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-section-stack">
          <div className="about-panel">
            <div className="about-visual">
              <img src={heroImage} alt="Industrial manufacturing facility" />
            </div>
            <div className="about-content">
              <span className="section-label">About MK Metals</span>
              <h2>
                Engineering excellence in custom <span className="hero-accent">extrusions</span>
              </h2>
              <p>
                MK Metals combines manufacturing experience with engineering precision to deliver reliable metal products and consultation for demanding projects.
              </p>
              <div className="about-features">
                <div className="feature-pill">Custom extrusion profiles</div>
                <div className="feature-pill">Industrial fittings & fixings</div>
                <div className="feature-pill">WhatsApp enquiry-ready catalog</div>
              </div>
            </div>
          </div>

          <div className="stats-grid about-stats-home">
            <div className="stat-card">
              <strong>15+</strong>
              <span>Years experience</span>
            </div>
            <div className="stat-card">
              <strong>98%</strong>
              <span>Client satisfaction</span>
            </div>
            <div className="stat-card">
              <strong>{categories.length}</strong>
              <span>Product lines</span>
            </div>
            <div className="stat-card">
              <strong>{allProducts.length}</strong>
              <span>Catalog items</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container section-heading">
          <span className="section-label">Applications</span>
          <h2>Materials designed for every industrial use case.</h2>
        </div>

        <div className="application-grid">
          {applications.map((category) => (
            <article key={category.id} className="application-card">
              <div className="application-card-overlay" />
              <div>
                <span>{category.name}</span>
                <p>{category.description || 'Industrial application'}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container section-heading">
          <span className="section-label">Products</span>
          <h2>Explore our featured industrial catalog.</h2>
          <p>Browse engineered product cards, compare specifications, and send enquiry requests directly.</p>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      <section className="section stats-section section--light">
        <div className="container">
          <div className="section-heading products-preview-heading">
            <span className="section-label">Catalog Preview</span>
            <h2>Explore quick picks from our industrial product range.</h2>
            <p>Review featured catalog items and jump straight to product details or an enquiry.</p>
          </div>

          <div className="products-preview-grid">
            {previewProducts.map((product) => {
              const whatsappHref = `https://wa.me/918125139139?text=${encodeURIComponent(
                `Hi, I am interested in ${product.name}. Please share availability and pricing details.`,
              )}`

              return (
                <article key={product.id} className="product-preview-card">
                  <div className="product-preview-media">
                    {product.image ? <img src={product.image} alt={product.name} loading="lazy" /> : <div className="product-card-image-placeholder" />}
                  </div>
                  <div className="product-preview-body">
                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.shortDescription}</p>
                    </div>

                    <div className="product-preview-actions">
                      <Link to={`/products/${product.slug}`} className="button button--primary button--compact">
                        View Details
                      </Link>
                      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button button--outline button--compact">
                        <MessageCircle size={16} />
                        Enquire
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-inner">
          <div>
            <span className="section-label">Ready to start</span>
            <h2>Get a quote today for your next industrial project.</h2>
            <p>
              Send product requirements, request specifications, and receive fast guidance from our sales team.
            </p>
          </div>
          <div className="cta-actions">
            <Link to="/contact" className="button button--primary">
              Get a quote
            </Link>
            <Link to="/products" className="button button--outline">
              Browse catalog
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
