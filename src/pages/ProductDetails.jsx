import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProducts, getCategories } from '../data/storage.js'
import { useCart } from '../context/CartContext.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'

export default function ProductDetails() {
  const { slug } = useParams()
  const products = getProducts()
  const categories = getCategories()
  const product = useMemo(() => products.find((item) => item.slug === slug), [products, slug])
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()

  if (!product) {
    navigate('/404', { replace: true })
    return null
  }

  const category = categories.find((category) => category.id === product.category)
  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4)
  const fallbackProducts = products.filter((item) => item.id !== product.id).slice(0, 4)
  const suggestions = relatedProducts.length > 0 ? relatedProducts : fallbackProducts
  const whatsappHref = `https://wa.me/918125139139?text=${encodeURIComponent(
    `Hello, I am interested in ${product.name} (Quantity: ${quantity}). Please let me know availability and price.`,
  )}`

  return (
    <main className="container page-container">
      <section className="section product-detail-shell">
        <div className="product-detail-grid">
          <div className="product-detail-visual">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-detail-copy">
            <span className="section-label">{category?.name || 'Product'}</span>
            <h1>{product.name}</h1>
            <p className="product-detail-description">{product.description}</p>

            <div className="product-detail-meta">
              <div>
                <span>Status</span>
                <strong>{product.stock > 0 ? product.status : 'Out of stock'}</strong>
              </div>
              <div>
                <span>Price</span>
                <strong>{product.contactForPrice ? 'Contact for Price' : `₹${product.price}`}</strong>
              </div>
            </div>

            <div className="product-detail-actions">
              <div className="quantity-control">
                <button type="button" onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}>-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((qty) => Math.min(99, qty + 1))}>+</button>
              </div>
              <button type="button" className="button button--primary" onClick={() => addToCart(product, quantity)}>
                Add to Cart
              </button>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button button--outline">
                Enquire on WhatsApp
              </a>
            </div>

            <div className="product-specs">
              <h2>Specifications</h2>
              <ul>
                {product.specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
            </div>

            <Link to="/products" className="text-link">Back to catalog</Link>
          </div>

          <aside className="related-products">
            <div className="related-products-header">
              <span className="section-label">More products</span>
              <p>{category?.name || 'Related items'}</p>
            </div>
            {suggestions.map((item) => (
              <article key={item.id} className="related-product-card">
                <Link to={`/products/${item.slug}`} className="related-product-card-link">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.contactForPrice ? 'Enquire for price' : `₹${item.price}`}</p>
                  </div>
                </Link>
              </article>
            ))}
          </aside>
        </div>
      </section>

      <EnquiryForm subject={product.name} />
    </main>
  )
}
