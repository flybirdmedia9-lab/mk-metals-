import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { categoriesApi } from '../utils/api.js'

export default function Categories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(() => {})
  }, [])

  return (
    <main>
      <section className="section section--wide">
        <div className="container section-heading">
          <span className="section-label">Browse categories</span>
          <h1>Find the right material for your application.</h1>
          <p>Filter by product family, view availability, and send a request for quotes with ease.</p>
        </div>

        <div className="application-grid application-grid--compact">
          {categories.map((category) => (
            <article key={category.id} className="application-card application-card--compact">
              <div>
                <span>{category.name}</span>
                <p>{category.description}</p>
              </div>
              <div className="category-footer">
                <span>{category.productCount ?? 0} products</span>
                <Link to={`/products?category=${category.id}`} className="text-link">View items</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
