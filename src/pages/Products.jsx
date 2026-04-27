import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategories, getProducts } from '../data/storage.js'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Products() {
  const categories = getCategories()
  const products = getProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const selectedCategory = searchParams.get('category') || ''
  const { addToCart } = useCart()

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true
      const matchesSearch = search
        ? [product.name, product.shortDescription, product.category]
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase())
        : true
      return matchesCategory && matchesSearch
    })
  }, [products, selectedCategory, search])

  const handleCategory = (id) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (next.get('category') === id) {
        next.delete('category')
      } else {
        next.set('category', id)
      }
      return next
    })
  }

  return (
    <main className="container page-container">
      <section className="section section--wide">
        <div className="section-heading">
          <span className="section-label">Product catalog</span>
          <h1>Browse our complete metal and plumbing inventory.</h1>
          <p>Filter by category, compare stock status, and add items to your enquiry cart.</p>
        </div>

        <div className="filter-bar">
          <div className="search-field">
            <label htmlFor="product-search">Search Products</label>
            <input
              id="product-search"
              type="search"
              placeholder="Search by name, category or spec"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="category-pills">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`category-pill ${selectedCategory === category.id ? 'category-pill--active' : ''}`}
                onClick={() => handleCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))
          ) : (
            <div className="empty-state">
              <h2>No matching items found</h2>
              <p>Try a different keyword or select a category.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
