import { useEffect, useState } from 'react'
import { categoriesApi } from '../utils/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminCategories() {
  const { admin } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [status, setStatus] = useState(null)

  useEffect(() => {
    categoriesApi.getAll()
      .then(setCategories)
      .catch((err) => setStatus({ type: 'error', message: err.message }))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (event) => {
    event.preventDefault()
    if (!name.trim()) { setStatus({ type: 'error', message: 'Category name is required.' }); return }
    try {
      const cat = await categoriesApi.create({ name, description })
      setCategories((prev) => [cat, ...prev])
      setName(''); setDescription('')
      setStatus({ type: 'success', message: 'Category added.' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  const startEdit = (cat) => { setEditingId(cat.id); setEditName(cat.name); setEditDesc(cat.description || '') }

  const handleEdit = async (id) => {
    try {
      const updated = await categoriesApi.update(id, { name: editName, description: editDesc })
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)))
      setEditingId(null)
      setStatus({ type: 'success', message: 'Category updated.' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await categoriesApi.delete(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      setStatus({ type: 'success', message: 'Category deleted.' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  if (loading) return <main className="admin-section-shell"><p className="admin-loading">Loading categories…</p></main>

  return (
    <main className="admin-section-shell">
      <div className="admin-grid">
        <div className="admin-panel admin-panel--wide">
          <div className="panel-head">
            <div><span className="section-label">Categories</span><h1>Manage categories</h1></div>
          </div>
          <form className="admin-form" onSubmit={handleAdd}>
            <label>Category name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label>Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" /></label>
            <button type="submit" className="button button--primary">Add category</button>
            {status && <p className={`form-status form-status--${status.type}`}>{status.message}</p>}
          </form>
        </div>

        <div className="admin-panel admin-panel--wide">
          <div className="panel-head"><h2>Category list</h2></div>
          <div className="admin-table">
            <div className="table-row table-head">
              <span>Name</span><span>Description</span><span>Products</span><span>Actions</span>
            </div>
            {categories.length > 0 ? categories.map((cat) => (
              <div key={cat.id} className="table-row">
                {editingId === cat.id ? (
                  <>
                    <span><input value={editName} onChange={(e) => setEditName(e.target.value)} /></span>
                    <span><input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} /></span>
                    <span>{cat.productCount ?? 0}</span>
                    <span className="table-actions">
                      <button type="button" className="text-button" onClick={() => handleEdit(cat.id)}>Save</button>
                      <button type="button" className="text-button" onClick={() => setEditingId(null)}>Cancel</button>
                    </span>
                  </>
                ) : (
                  <>
                    <span>{cat.name}</span>
                    <span>{cat.description || 'No description'}</span>
                    <span>{cat.productCount ?? 0}</span>
                    <span className="table-actions">
                      <button type="button" className="text-button" onClick={() => startEdit(cat)}>Edit</button>
                      {admin?.role === 'owner' && (
                        <button type="button" className="text-button text-button--danger" onClick={() => handleDelete(cat.id)}>Delete</button>
                      )}
                    </span>
                  </>
                )}
              </div>
            )) : (
              <div className="empty-state"><h2>No categories yet</h2></div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
