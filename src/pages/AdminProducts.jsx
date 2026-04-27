import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories, getProducts, saveProducts } from '../data/storage.js'

export default function AdminProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState(getProducts())
  const categories = getCategories()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchMatch = product.name.toLowerCase().includes(search.toLowerCase())
      const categoryMatch = categoryFilter === 'All' || product.category === categoryFilter
      const statusMatch = statusFilter === 'All' || product.status === statusFilter
      return searchMatch && categoryMatch && statusMatch
    })
  }, [products, search, categoryFilter, statusFilter])

  const handleDelete = (id) => {
    const next = products.filter((product) => product.id !== id)
    saveProducts(next)
    setProducts(next)
  }

  return (
    <main className="admin-section-shell">
      <div className="admin-panel admin-panel--full">
        <div className="panel-head">
          <div>
            <span className="section-label">Products</span>
            <h1>Manage your product catalog</h1>
          </div>
          <button type="button" className="button button--primary" onClick={() => navigate('/admin/add-product')}>
            Add product
          </button>
        </div>

        <div className="filter-bar">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="All">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="All">All statuses</option>
            <option value="In stock">In stock</option>
            <option value="Low stock">Low stock</option>
            <option value="Out of stock">Out of stock</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
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
              <span>Actions</span>
            </div>
            {filteredProducts.map((product) => (
              <div key={product.id} className="table-row">
                <span>{product.name}</span>
                <span>{categories.find((category) => category.id === product.category)?.name || 'Uncategorized'}</span>
                <span>{product.stock}</span>
                <span>{product.status}</span>
                <span className="table-actions">
                  <button type="button" className="text-button" onClick={() => navigate(`/admin/edit-product?id=${product.id}`)}>
                    Edit
                  </button>
                  <button type="button" className="text-button text-button--danger" onClick={() => handleDelete(product.id)}>
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
