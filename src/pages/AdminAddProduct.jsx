import AdminProductForm from '../components/AdminProductForm.jsx'
import { productsApi } from '../utils/api.js'

export default function AdminAddProduct() {
  const handleSave = (product) => productsApi.create(product)
  return <AdminProductForm onSave={handleSave} mode="add" />
}
