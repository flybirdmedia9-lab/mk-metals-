import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartAmount, clearCart } = useCart()

  const whatsappMessage = useMemo(() => {
    if (cartItems.length === 0) return ''
    const lines = ['Hello, I would like a quote for the following items:']
    cartItems.forEach((item) => {
      lines.push(`- ${item.name} x ${item.quantity}`)
    })
    lines.push('\nPlease share pricing and availability.')
    return encodeURIComponent(lines.join('\n'))
  }, [cartItems])

  return (
    <main className="container page-container">
      <section className="section section--wide">
        <div className="section-heading">
          <span className="section-label">Cart enquiry</span>
          <h1>Your enquiry cart</h1>
          <p>Review selected products and send a combined WhatsApp request without online checkout.</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-layout">
            <div className="cart-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.contactForPrice ? 'Contact for Price' : `₹${item.price}`}</p>
                    <div className="quantity-control">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button type="button" className="text-button text-button--danger" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <div className="summary-card">
                <span>Total items</span>
                <strong>{cartTotal}</strong>
              </div>
              <div className="summary-card">
                <span>Estimated amount</span>
                <strong>{cartAmount ? `₹${cartAmount}` : 'Contact for Price'}</strong>
              </div>
              <a href={`https://wa.me/918125139139?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="button button--primary full-width">
                Send Cart Enquiry on WhatsApp
              </a>
              <button type="button" className="button button--outline full-width" onClick={clearCart}>
                Clear Cart
              </button>
            </aside>
          </div>
        ) : (
          <div className="empty-state empty-state--cart">
            <h2>Your cart is empty</h2>
            <p>Add products from the catalog and send a quick enquiry to our sales team.</p>
            <Link to="/products" className="button button--primary">
              Browse products
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
