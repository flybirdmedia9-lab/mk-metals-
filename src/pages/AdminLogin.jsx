import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/admin/dashboard'

  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/login', { replace: true })
    }
  }, [location.pathname, navigate])

  useEffect(() => {
    if (!loading && isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, loading, from, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please enter email and password.')
      return
    }
    setSubmitting(true)
    try {
      await login(form)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="container page-container admin-login-page">
      <section className="section admin-login-panel">
        <div className="panel-copy">
          <span className="section-label">Admin portal</span>
          <h1>Secure admin sign-in</h1>
          <p>Only registered team members can manage product listings, categories and enquiries.</p>
        </div>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input name="email" value={form.email} onChange={handleChange} autoComplete="email" type="email" />
          </label>
          <label>
            Password
            <input name="password" value={form.password} onChange={handleChange} type="password" autoComplete="current-password" />
          </label>
          {error ? <p className="form-status form-status--error">{error}</p> : null}
          <button className="button button--primary full-width" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}
