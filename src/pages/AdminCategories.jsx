import { useMemo, useState } from 'react'
import { getCategories, getProducts, saveCategories } from '../data/storage.js'

function slugify(value) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AdminCategories() {
  const [categories, setCategories] = useState(getCategories())
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState(null)
  const products = useMemo(() => getProducts(), [])

  const handleAdd = (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setStatus({ type: 'error', message: 'Category name is required.' })
      return
    }
    const id = slugify(trimmed)
    if (categories.some((category) => category.id === id)) {
      setStatus({ type: 'error', message: 'This category already exists.' })
      return
    }
    const next = [{ id, name: trimmed, description }, ...categories]
    saveCategories(next)
    setCategories(next)
    setName('')
    setDescription('')
    setStatus({ type: 'success', message: 'Category added.' })
  }

  const handleDelete = (id) => {
    if (products.some((product) => product.category === id)) {
      setStatus({ type: 'error', message: 'Remove products from this category before deleting.' })
      return
    }
    const next = categories.filter((category) => category.id !== id)
    saveCategories(next)
    setCategories(next)
    setStatus({ type: 'success', message: 'Category deleted.' })
  }

  return (
    <main className="admin-section-shell">
      <div className="admin-grid">
        <div className="admin-panel admin-panel--wide">
          <div className="panel-head">
            <div>
              <span className="section-label">Categories</span>
              <h1>Manage categories</h1>
            </div>
          </div>
          <form className="admin-form" onSubmit={handleAdd}>
            <label>
              Category name
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              Description
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows="3" />
            </label>
            <button type="submit" className="button button--primary">
              Add category
            </button>
            {status ? <p className={`form-status form-status--${status.type}`}>{status.message}</p> : null}
          </form>
        </div>

        <div className="admin-panel admin-panel--wide">
          <div className="panel-head">
            <h2>Category list</h2>
          </div>
          <div className="admin-table">
            <div className="table-row table-head">
              <span>Name</span>
              <span>Description</span>
              <span>Products</span>
              <span>Actions</span>
            </div>
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.id} className="table-row">
                  <span>{category.name}</span>
                  <span>{category.description || 'No description'}</span>
                  <span>{products.filter((product) => product.category === category.id).length}</span>
                  <span className="table-actions">
                    <button type="button" className="text-button text-button--danger" onClick={() => handleDelete(category.id)}>
                      Delete
                    </button>
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h2>No categories yet</h2>
                <p>Add business categories here to organize your product catalog.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
