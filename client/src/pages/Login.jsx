import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { user, login, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: 'student@example.com',
    password: 'Student@123',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    clearError()
  }, [clearError])

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (event) => {
    clearError()
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      await login(form)
      navigate('/dashboard')
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <p className="eyebrow">DSA Sheet</p>
        <h1>Log in to continue your DSA sheet.</h1>
        <p>
          Track solved problems, resume saved progress, and keep every topic,
          practice link, tutorial, and article in one place.
        </p>
      </section>

      <section className="auth-card">
        <h2>Student Login</h2>
        <p className="muted">Use the demo account below or create a student account.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          New student? <Link to="/signup">Sign up</Link>
        </p>
      </section>
    </main>
  )
}

export default Login
