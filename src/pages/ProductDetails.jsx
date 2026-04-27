import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productsApi } from '../utils/api.js'
import { useCart } from '../context/CartContext.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'

export default function ProductDetails() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    productsApi.getById(slug)
      .then((p) => {
        setProduct(p)
        return productsApi.getAll({ category: p.category })
      })
      .then((all) => setRelated(all.filter((p) => p.slug !== slug).slice(0, 4)))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <main className="container page-container"><p style={{ padding: '4rem 0' }}>Loading product…</p></main>

  if (!product) {
    return (
      <main className="container page-container">
        <div className="empty-state">
          <h2>Product not found</h2>
          <Link to="/products" className="button button--secondary">Back to catalog</Link>
        </div>
      </main>
    )
  }

  const whatsappHref = `https://wa.me/918125139139?text=${encodeURIComponent(
    `Hello, I am interested in ${product.name} (Quantity: ${quantity}). Please let me know availability and price.`,
  )}`

  return (
    <main className="container page-container">
      <section className="section product-detail-shell">
        <div className="product-detail-grid">
          <div className="product-detail-visual">
            {product.image ? <img src={product.image} alt={product.name} /> : <div className="image-placeholder" />}
          </div>

          <div className="product-detail-copy">
            <span className="section-label">{product.categoryName || 'Product'}</span>
            <h1>{product.name}</h1>
            <p className="product-detail-description">{product.description}</p>

            <div className="product-detail-meta">
              <div><span>Status</span><strong>{product.stock > 0 ? product.status : 'Out of stock'}</strong></div>
              <div><span>Price</span><strong>{product.contactForPrice ? 'Contact for Price' : `₹${product.price}`}</strong></div>
            </div>

            <div className="product-detail-actions">
              <div className="quantity-control">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => Math.min(99, q + 1))}>+</button>
              </div>
              <button type="button" className="button button--primary" onClick={() => addToCart(product, quantity)}>Add to Cart</button>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button button--outline">Enquire on WhatsApp</a>
            </div>

            {product.specs && product.specs.length > 0 && (
              <div className="product-specs">
                <h2>Specifications</h2>
                <ul>{product.specs.map((spec) => <li key={spec}>{spec}</li>)}</ul>
              </div>
            )}

            <Link to="/products" className="text-link">Back to catalog</Link>
          </div>

          {related.length > 0 && (
            <aside className="related-products">
              <div className="related-products-header">
                <span className="section-label">More products</span>
              </div>
              {related.map((item) => (
                <article key={item.id} className="related-product-card">
                  <Link to={`/products/${item.slug}`} className="related-product-card-link">
                    {item.image && <img src={item.image} alt={item.name} />}
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.contactForPrice ? 'Enquire for price' : `₹${item.price}`}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </aside>
          )}
        </div>
      </section>
      <EnquiryForm subject={product.name} />
    </main>
  )
}
