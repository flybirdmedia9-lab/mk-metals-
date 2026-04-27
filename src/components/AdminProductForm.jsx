import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../data/storage.js'

const emptyProduct = {
  name: '',
  slug: '',
  category: '',
  brand: '',
  shortDescription: '',
  description: '',
  price: '',
  offerPrice: '',
  sku: '',
  stock: 0,
  status: 'In stock',
  unit: 'pcs',
  specs: [''],
  technicalDetails: '',
  application: '',
  featured: false,
  popular: false,
  latest: false,
  whatsappEnabled: true,
  metaTitle: '',
  metaDescription: '',
  image: '',
}

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

export default function AdminProductForm({ initialProduct = emptyProduct, onSave, mode = 'add' }) {
  const [product, setProduct] = useState(initialProduct)
  const [status, setStatus] = useState(null)
  const categories = getCategories()
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' ? { slug: slugify(value) } : {}),
    }))
  }

  const handleSpecChange = (index, value) => {
    setProduct((prev) => {
      const specs = [...prev.specs]
      specs[index] = value
      return { ...prev, specs }
    })
  }

  const addSpec = () => setProduct((prev) => ({ ...prev, specs: [...prev.specs, ''] }))
  const removeSpec = (index) => {
    setProduct((prev) => ({ ...prev, specs: prev.specs.filter((_, idx) => idx !== index) }))
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setProduct((prev) => ({ ...prev, image: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!product.name.trim() || !product.category) {
      setStatus({ type: 'error', message: 'Product name and category are required.' })
      return
    }
    onSave(product)
    navigate('/admin/products')
  }

  return (
    <div className="admin-grid admin-grid--single">
      <div className="admin-panel admin-panel--full">
        <div className="panel-head">
          <h2>{mode === 'edit' ? 'Edit product details' : 'Create new product'}</h2>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Product name
              <input name="name" value={product.name} onChange={handleChange} />
            </label>
            <label>
              Product slug
              <input name="slug" value={product.slug} onChange={handleChange} />
            </label>
            <label>
              Category
              <select name="category" value={product.category} onChange={handleChange}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Brand
              <input name="brand" value={product.brand} onChange={handleChange} />
            </label>
            <label>
              SKU / product code
              <input name="sku" value={product.sku} onChange={handleChange} />
            </label>
            <label>
              Price
              <input name="price" value={product.price} onChange={handleChange} />
            </label>
            <label>
              Offer price
              <input name="offerPrice" value={product.offerPrice} onChange={handleChange} />
            </label>
            <label>
              Stock quantity
              <input name="stock" type="number" min="0" value={product.stock} onChange={handleChange} />
            </label>
            <label>
              Stock status
              <select name="status" value={product.status} onChange={handleChange}>
                <option value="In stock">In stock</option>
                <option value="Low stock">Low stock</option>
                <option value="Out of stock">Out of stock</option>
              </select>
            </label>
            <label>
              Unit
              <input name="unit" value={product.unit} onChange={handleChange} />
            </label>
          </div>

          <label>
            Short description
            <textarea name="shortDescription" value={product.shortDescription} onChange={handleChange} rows="2" />
          </label>
          <label>
            Full description
            <textarea name="description" value={product.description} onChange={handleChange} rows="4" />
          </label>
          <label>
            Technical details
            <textarea name="technicalDetails" value={product.technicalDetails} onChange={handleChange} rows="3" />
          </label>
          <label>
            Application / usage
            <textarea name="application" value={product.application} onChange={handleChange} rows="3" />
          </label>
          <label>
            Meta title
            <input name="metaTitle" value={product.metaTitle} onChange={handleChange} />
          </label>
          <label>
            Meta description
            <textarea name="metaDescription" value={product.metaDescription} onChange={handleChange} rows="3" />
          </label>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input name="featured" type="checkbox" checked={product.featured} onChange={handleChange} />
              Featured
            </label>
            <label className="checkbox-label">
              <input name="popular" type="checkbox" checked={product.popular} onChange={handleChange} />
              Popular
            </label>
            <label className="checkbox-label">
              <input name="latest" type="checkbox" checked={product.latest} onChange={handleChange} />
              Latest
            </label>
            <label className="checkbox-label">
              <input name="whatsappEnabled" type="checkbox" checked={product.whatsappEnabled} onChange={handleChange} />
              WhatsApp enquiry enabled
            </label>
          </div>

          <label>
            Main image
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>
          {product.image ? <img src={product.image} alt="Preview" className="image-preview" /> : null}

          {status ? <p className={`form-status form-status--${status.type}`}>{status.message}</p> : null}

          <div className="form-actions">
            <button type="submit" className="button button--primary">
              {mode === 'edit' ? 'Save changes' : 'Publish product'}
            </button>
            <button type="button" className="button button--secondary" onClick={() => navigate('/admin/products')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
