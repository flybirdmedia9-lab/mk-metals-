import { useMemo } from 'react'
import { getCategories, getEnquiries, getProducts } from '../data/storage.js'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const products = getProducts()
  const categories = getCategories()
  const enquiries = getEnquiries()

  const overview = useMemo(
    () => ({
      totalProducts: products.length,
      totalCategories: categories.length,
      totalEnquiries: enquiries.length,
      featured: products.filter((item) => item.featured).length,
      lowStock: products.filter((item) => item.status === 'Low stock').length,
      outOfStock: products.filter((item) => item.status === 'Out of stock').length,
      popular: products.filter((item) => item.popular).length,
      latest: products.filter((item) => item.latest).length,
    }),
    [products, categories, enquiries],
  )

  const recentEnquiries = enquiries.slice(0, 3)
  const recentProducts = products.slice(0, 4)

  return (
    <main className="admin-section-shell">
      <div className="admin-grid">
        <div className="admin-panel admin-panel--wide">
          <div className="panel-head">
            <div>
              <span className="section-label">Dashboard</span>
              <h1>Business management overview</h1>
            </div>
          </div>
          <p>
            Monitor product performance, track customer enquiries, and manage inventory from one business-focused admin hub.
          </p>
        </div>

        <div className="admin-overview-grid">
          {[
            { label: 'Total products', value: overview.totalProducts },
            { label: 'Total categories', value: overview.totalCategories },
            { label: 'Total enquiries', value: overview.totalEnquiries },
            { label: 'Featured products', value: overview.featured },
            { label: 'Low stock', value: overview.lowStock },
            { label: 'Out of stock', value: overview.outOfStock },
            { label: 'Popular products', value: overview.popular },
            { label: 'Latest products', value: overview.latest },
          ].map((card) => (
            <article key={card.label} className="admin-card">
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>

        <div className="admin-grid">
          <div className="admin-panel admin-panel--wide">
            <div className="panel-head">
              <h2>Recent enquiries</h2>
              <Link to="/admin/enquiries" className="button button--secondary">
                View all enquiries
              </Link>
            </div>
            <div className="enquiry-list">
              {recentEnquiries.length > 0 ? (
                recentEnquiries.map((enquiry) => (
                  <article key={enquiry.id} className="enquiry-card">
                    <div>
                      <span className="enquiry-meta">{new Date(enquiry.createdAt).toLocaleString()}</span>
                      <h3>{enquiry.subject || 'Product enquiry'}</h3>
                      <p>{enquiry.message}</p>
                    </div>
                    <div className="enquiry-contact">
                      <span>{enquiry.name || 'Customer'}</span>
                      <span>{enquiry.company || 'No company'}</span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <h2>No enquiries found</h2>
                  <p>Customer messages will appear here when they are submitted.</p>
                </div>
              )}
            </div>
          </div>

          <div className="admin-panel admin-panel--wide">
            <div className="panel-head">
              <h2>Quick actions</h2>
            </div>
            <div className="admin-action-grid">
              <Link to="/admin/add-product" className="button button--primary">
                Add new product
              </Link>
              <Link to="/admin/products" className="button button--secondary">
                Manage products
              </Link>
              <Link to="/admin/categories" className="button button--secondary">
                Manage categories
              </Link>
              <Link to="/admin/enquiries" className="button button--secondary">
                Review enquiries
              </Link>
            </div>
          </div>
        </div>

        <div className="admin-panel admin-panel--full">
          <div className="panel-head">
            <h2>Recent products</h2>
            <Link to="/admin/products" className="button button--secondary">
              View all products
            </Link>
          </div>
          <div className="admin-table">
            <div className="table-row table-head">
              <span>Name</span>
              <span>Category</span>
              <span>Stock</span>
              <span>Status</span>
            </div>
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div key={product.id} className="table-row">
                  <span>{product.name}</span>
                  <span>{categories.find((cat) => cat.id === product.category)?.name || '—'}</span>
                  <span>{product.stock}</span>
                  <span>{product.status}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h2>No products available</h2>
                <p>Create products from the Add Product menu to populate your catalog.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
