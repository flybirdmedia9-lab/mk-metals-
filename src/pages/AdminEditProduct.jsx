import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AdminProductForm from '../components/AdminProductForm.jsx'
import { productsApi } from '../utils/api.js'

export default function AdminEditProduct() {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const id = new URLSearchParams(location.search).get('id')
    if (!id) { setLoading(false); return }
    productsApi.getById(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [location.search])

  if (loading) return <main className="admin-section-shell"><p className="admin-loading">Loading product…</p></main>

  if (!product) {
    return (
      <main className="admin-section-shell">
        <div className="admin-panel admin-panel--full">
          <div className="empty-state">
            <h2>Product not found</h2>
            <p>Select a product from the product list to edit it.</p>
          </div>
        </div>
      </main>
    )
  }

  const handleSave = (updated) => productsApi.update(product.id, updated)

  return <AdminProductForm key={product.id} initialProduct={product} onSave={handleSave} mode="edit" />
}
