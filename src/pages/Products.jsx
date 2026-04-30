import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categoriesApi, productsApi } from '../utils/api.js'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Products() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const selectedCategory = searchParams.get('category') || ''
  const filterType = searchParams.get('filter') || ''
  const { addToCart } = useCart()

  useEffect(() => {
    productsApi.getAll().then(setProducts).catch(() => {})
    categoriesApi.getAll().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    const urlSearch = searchParams.get('search') || ''
    if (urlSearch !== search) {
      setSearch(urlSearch)
    }
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true
      const matchesLatest = filterType === 'latest' ? product.latest === true : true
      const matchesSearch = search
        ? [product.name, product.shortDescription, product.category]
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase())
        : true
      return matchesCategory && matchesSearch && matchesLatest
    })
  }, [products, selectedCategory, search, filterType])

  const handleSearchChange = (val) => {
    setSearch(val)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (val) next.set('search', val)
      else next.delete('search')
      return next
    }, { replace: true })
  }

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
          <span className="section-label">
            {filterType === 'latest' ? 'New Arrivals' : 'Product catalog'}
          </span>
          <h1>
            {filterType === 'latest' 
              ? 'Check out our latest premium metal fixings.' 
              : 'Browse our complete metal and plumbing inventory.'}
          </h1>
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
              onChange={(event) => handleSearchChange(event.target.value)}
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
