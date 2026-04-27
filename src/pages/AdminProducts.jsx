import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categoriesApi, productsApi } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { canAccess } from '../utils/roles.js'

export default function AdminProducts() {
  const navigate = useNavigate()
  const { admin } = useAuth()
  const userRole = admin?.role || 'viewer'
  const canManageProducts = canAccess(userRole, 'manager')

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    Promise.all([productsApi.getAll(), categoriesApi.getAll()])
      .then(([prods, cats]) => {
        setProducts(prods)
        setCategories(cats)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter
      const matchesStatus = statusFilter === 'All' || product.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, search, categoryFilter, statusFilter])

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    try {
      await productsApi.delete(id)
      setProducts((prev) => prev.filter((product) => product.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const toggleFeatured = async (id, field, current) => {
    try {
      const updated = await productsApi.updateFeatured(id, { [field]: !current })
      setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...updated } : product)))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <main className="admin-section-shell">
        <p className="admin-loading">Loading products...</p>
      </main>
    )
  }

  return (
    <main className="admin-section-shell">
      <div className="admin-panel admin-panel--full">
        <div className="panel-head">
          <div>
            <span className="section-label">Products</span>
            <h1>Manage your product catalog</h1>
          </div>
          {canManageProducts && (
            <button type="button" className="button button--primary" onClick={() => navigate('/admin/add-product')}>
              Add product
            </button>
          )}
        </div>

        {error && <p className="form-status form-status--error">{error}</p>}
        {!canManageProducts && (
          <p className="form-status form-status--info">
            You have read-only access. Contact an owner/manager to add, update, or delete products.
          </p>
        )}

        <div className="filter-bar">
          <input type="search" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All statuses</option>
            <option value="In stock">In stock</option>
            <option value="Low stock">Low stock</option>
            <option value="Out of stock">Out of stock</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <h2>No products match your filters</h2>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="admin-table">
            <div className="table-row table-head">
              <span>Name</span>
              <span>Category</span>
              <span>Stock</span>
              <span>Status</span>
              <span>Featured</span>
              <span>Actions</span>
            </div>
            {filtered.map((product) => (
              <div key={product.id} className="table-row">
                <span>{product.name}</span>
                <span>{categories.find((category) => category.id === product.category)?.name || 'Uncategorized'}</span>
                <span>{product.stock}</span>
                <span>{product.status}</span>
                <span className="table-actions">
                  {canManageProducts ? (
                    <button
                      type="button"
                      className={`text-button ${product.featured ? 'text-button--active' : ''}`}
                      onClick={() => toggleFeatured(product.id, 'featured', product.featured)}
                      title="Toggle featured"
                    >
                      {product.featured ? 'Featured' : 'Feature'}
                    </button>
                  ) : (
                    <span>{product.featured ? 'Featured' : 'Not featured'}</span>
                  )}
                </span>
                <span className="table-actions">
                  {canManageProducts && (
                    <button type="button" className="text-button" onClick={() => navigate(`/admin/edit-product?id=${product.id}`)}>
                      Edit
                    </button>
                  )}
                  {(admin?.role === 'owner' || admin?.role === 'manager') && (
                    <button type="button" className="text-button text-button--danger" onClick={() => handleDelete(product.id)}>
                      Delete
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
