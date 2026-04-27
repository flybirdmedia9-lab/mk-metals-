import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AdminProductForm from '../components/AdminProductForm.jsx'
import { getProducts, saveProducts } from '../data/storage.js'

export default function AdminEditProduct() {
  const [product, setProduct] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const productId = params.get('id')
    const existing = getProducts().find((item) => item.id === productId)
    setProduct(existing || null)
  }, [location.search])

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

  const handleSave = (updatedProduct) => {
    const next = getProducts().map((item) => (item.id === product.id ? { ...item, ...updatedProduct } : item))
    saveProducts(next)
  }

  return <AdminProductForm initialProduct={product} onSave={handleSave} mode="edit" />
}
