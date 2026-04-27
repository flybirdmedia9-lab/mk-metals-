import { Link } from 'react-router-dom'
import { ShoppingCart, MessageCircle } from 'lucide-react'

export default function ProductCard({ product, onAddToCart }) {
  const whatsappHref = `https://wa.me/918125139139?text=${encodeURIComponent(
    `Hi, I am interested in ${product.name}. Please share availability and pricing details.`,
  )}`

  return (
    <article className="product-card">
      <div className="product-card-hero">
        {product.image ? <img src={product.image} alt={product.name} loading="lazy" /> : <div className="product-card-image-placeholder" />}
        {(product.categoryName || product.category) && (
          <div className="product-card-tag">{(product.categoryName || product.category).replace(/-/g, ' ')}</div>
        )}
      </div>
      <div className="product-card-body">
        <div>
          <h3>{product.name}</h3>
          <p>{product.shortDescription}</p>
        </div>

        <div className="product-card-meta">
          <span className={`stock-pill ${product.stock > 0 ? 'stock-pill--available' : 'stock-pill--out'}`}>
            {product.stock > 0 ? product.status : 'Out of stock'}
          </span>
          <strong>{product.contactForPrice ? 'Contact for Price' : `₹${product.price}`}</strong>
        </div>

        <div className="product-card-actions">
          <button type="button" className="button button--secondary" onClick={() => onAddToCart(product)}>
            <ShoppingCart size={16} /> Add to Cart
          </button>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button button--outline">
            <MessageCircle size={16} /> Enquire on WhatsApp
          </a>
        </div>
      </div>

      <Link to={`/products/${product.slug}`} className="product-card-link" aria-label={`View details for ${product.name}`}>
        View details
      </Link>
    </article>
  )
}
