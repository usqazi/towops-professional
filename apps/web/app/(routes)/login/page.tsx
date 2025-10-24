'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: '',
    phone: '',
    role: 'customer'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', { method: 'POST' })
        if (response.ok) {
          router.push('/dashboard')
        }
      } catch (error) {
        // User not authenticated, stay on login page
      }
    }
    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(isLogin ? 'Login successful!' : 'Registration successful!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setError(data.error || 'An error occurred')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const fillDemoCredentials = () => {
    setFormData({
      ...formData,
      email: 'admin@towops.com',
      password: 'password'
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: '40px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            borderRadius: 12,
            padding: '12px',
            fontSize: 32,
            width: 64,
            height: 64,
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🚛
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            color: '#1f2937'
          }}>
            TowOps Professional
          </h1>
          <p style={{
            color: '#6b7280',
            margin: 0,
            fontSize: 16
          }}>
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Demo Credentials */}
        {isLogin && (
          <div style={{
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: 8,
            padding: 12,
            marginBottom: 24,
            fontSize: 14
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#92400e' }}>
              🚀 Demo Credentials:
            </p>
            <div style={{ color: '#92400e', marginBottom: 8 }}>
              <strong>Admin:</strong> admin@towops.com / password
            </div>
            <div style={{ color: '#92400e', marginBottom: 8 }}>
              <strong>Dispatcher:</strong> dispatcher@towops.com / password
            </div>
            <div style={{ color: '#92400e', marginBottom: 8 }}>
              <strong>Driver:</strong> driver@towops.com / password
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              style={{
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 4,
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Fill Demo Credentials
            </button>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: 8,
            padding: 12,
            marginBottom: 24,
            color: '#dc2626',
            fontSize: 14
          }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#dcfce7',
            border: '1px solid #86efac',
            borderRadius: 8,
            padding: 12,
            marginBottom: 24,
            color: '#16a34a',
            fontSize: 14
          }}>
            ✅ {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 6,
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#374151'
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 14,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 6,
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#374151'
                }}>
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 14,
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="customer">Customer</option>
                  <option value="driver">Driver</option>
                  <option value="dispatcher">Dispatcher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 6,
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#374151'
                }}>
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 14,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 6,
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#374151'
                }}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 14,
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 14,
              fontWeight: 'bold',
              color: '#374151'
            }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 14,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 14,
              fontWeight: 'bold',
              color: '#374151'
            }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 14,
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: 16
            }}
          >
            {loading ? '⏳ Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Toggle Form */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setSuccess('')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              fontSize: 14,
              fontWeight: 'bold',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>

        {/* Features */}
        <div style={{
          marginTop: 32,
          padding: 20,
          background: '#f9fafb',
          borderRadius: 8,
          fontSize: 12,
          color: '#6b7280'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>🔐 Secure Authentication</h4>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li>JWT token-based authentication</li>
            <li>HTTP-only secure cookies</li>
            <li>Password hashing with bcrypt</li>
            <li>Role-based access control</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
