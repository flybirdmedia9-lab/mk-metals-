import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="container page-container not-found-page">
      <section className="section not-found-shell">
        <div className="not-found-card">
          <h1>404</h1>
          <p>We could not find the page you were looking for.</p>
          <Link to="/" className="button button--primary">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  )
}
