import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { statsApi } from '../utils/api.js'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    statsApi.get()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <main className="admin-section-shell"><p className="admin-loading">Loading dashboard…</p></main>
  if (error) return <main className="admin-section-shell"><p className="form-status form-status--error">{error}</p></main>

  const { stats, recentEnquiries, recentProducts } = data

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
          <p>Monitor product performance, track customer enquiries, and manage inventory from one business-focused admin hub.</p>
        </div>

        <div className="admin-overview-grid">
          {[
            { label: 'Total products', value: stats.totalProducts },
            { label: 'Total categories', value: stats.totalCategories },
            { label: 'Total enquiries', value: stats.totalEnquiries },
            { label: 'New enquiries', value: stats.newEnquiries },
            { label: 'Featured products', value: stats.featured },
            { label: 'Low stock', value: stats.lowStock },
            { label: 'Out of stock', value: stats.outOfStock },
            { label: 'Team members', value: stats.totalTeam },
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
              <Link to="/admin/enquiries" className="button button--secondary">View all</Link>
            </div>
            <div className="enquiry-list">
              {recentEnquiries.length > 0 ? recentEnquiries.map((e) => (
                <article key={e.id} className="enquiry-card">
                  <div>
                    <span className="enquiry-meta">{new Date(e.created_at).toLocaleString()}</span>
                    <h3>{e.subject || 'Product enquiry'}</h3>
                    <p>{e.message}</p>
                  </div>
                  <div className="enquiry-contact">
                    <span>{e.name}</span>
                    <span>{e.company || 'No company'}</span>
                  </div>
                </article>
              )) : (
                <div className="empty-state">
                  <h2>No enquiries yet</h2>
                  <p>Customer messages will appear here when submitted.</p>
                </div>
              )}
            </div>
          </div>

          <div className="admin-panel admin-panel--wide">
            <div className="panel-head"><h2>Quick actions</h2></div>
            <div className="admin-action-grid">
              <Link to="/admin/add-product" className="button button--primary">Add new product</Link>
              <Link to="/admin/products" className="button button--secondary">Manage products</Link>
              <Link to="/admin/stock" className="button button--secondary">Update stock</Link>
              <Link to="/admin/categories" className="button button--secondary">Manage categories</Link>
              <Link to="/admin/enquiries" className="button button--secondary">Review enquiries</Link>
              <Link to="/admin/team" className="button button--secondary">Manage team</Link>
            </div>
          </div>
        </div>

        <div className="admin-panel admin-panel--full">
          <div className="panel-head">
            <h2>Recent products</h2>
            <Link to="/admin/products" className="button button--secondary">View all</Link>
          </div>
          <div className="admin-table">
            <div className="table-row table-head">
              <span>Name</span>
              <span>Category</span>
              <span>Stock</span>
              <span>Status</span>
            </div>
            {recentProducts.length > 0 ? recentProducts.map((p) => (
              <div key={p.id} className="table-row">
                <span>{p.name}</span>
                <span>{p.category_name || '—'}</span>
                <span>{p.stock}</span>
                <span>{p.status}</span>
              </div>
            )) : (
              <div className="empty-state">
                <h2>No products yet</h2>
                <p>Add products from the Add Product menu.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
