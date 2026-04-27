import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || '/admin/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, from, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please enter email and password.')
      return
    }
    if (!login(form)) {
      setError('Invalid admin credentials')
      return
    }
    navigate('/admin/dashboard', { replace: true })
  }

  return (
    <main className="container page-container admin-login-page">
      <section className="section admin-login-panel">
        <div className="panel-copy">
          <span className="section-label">Admin portal</span>
          <h1>Secure admin sign-in</h1>
          <p>Only registered admins can manage product listings, categories and incoming enquiries.</p>
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

          <button className="button button--primary full-width" type="submit">
            Login
          </button>
        </form>
      </section>
    </main>
  )
}
