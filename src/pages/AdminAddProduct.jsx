import AdminProductForm from '../components/AdminProductForm.jsx'
import { getProducts, saveProducts } from '../data/storage.js'

export default function AdminAddProduct() {
  const handleSave = (product) => {
    const newProduct = {
      ...product,
      id: crypto.randomUUID(),
      slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
    }
    saveProducts([newProduct, ...getProducts()])
  }

  return <AdminProductForm onSave={handleSave} mode="add" />
}
