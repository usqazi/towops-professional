'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'dispatcher' | 'driver' | 'customer'
  company?: string
  phone?: string
  createdAt: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', { method: 'POST' })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          router.push('/login')
        }
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#dc2626'
      case 'dispatcher': return '#2563eb'
      case 'driver': return '#059669'
      case 'customer': return '#7c3aed'
      default: return '#6b7280'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑'
      case 'dispatcher': return '📞'
      case 'driver': return '🚛'
      case 'customer': return '👤'
      default: return '❓'
    }
  }

  const getDashboardFeatures = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dispatch Management', href: '/dispatch', icon: '📞', color: '#2563eb' },
          { name: 'Live Tracking', href: '/live-tracking', icon: '🗺️', color: '#7c3aed' },
          { name: 'Reports & Analytics', href: '/reports', icon: '📊', color: '#f59e0b' },
          { name: 'User Management', href: '/users', icon: '👥', color: '#059669' },
          { name: 'NSV QA System', href: '/nsv', icon: '📄', color: '#dc2626' },
          { name: 'System Settings', href: '/settings', icon: '⚙️', color: '#6b7280' }
        ]
      case 'dispatcher':
        return [
          { name: 'Dispatch Management', href: '/dispatch', icon: '📞', color: '#2563eb' },
          { name: 'Live Tracking', href: '/live-tracking', icon: '🗺️', color: '#7c3aed' },
          { name: 'Reports & Analytics', href: '/reports', icon: '📊', color: '#f59e0b' },
          { name: 'NSV QA System', href: '/nsv', icon: '📄', color: '#dc2626' }
        ]
      case 'driver':
        return [
          { name: 'Mobile Driver App', href: '/mobile', icon: '📱', color: '#059669' },
          { name: 'Live Tracking', href: '/live-tracking', icon: '🗺️', color: '#7c3aed' },
          { name: 'My Assignments', href: '/assignments', icon: '📋', color: '#2563eb' }
        ]
      case 'customer':
        return [
          { name: 'Request Tow Service', href: '/request', icon: '🚛', color: '#2563eb' },
          { name: 'Track My Request', href: '/track', icon: '🗺️', color: '#7c3aed' },
          { name: 'My History', href: '/history', icon: '📋', color: '#059669' }
        ]
      default:
        return []
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        padding: '20px 0'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>
                Welcome back, {user.name}!
              </h1>
              <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>
                {getRoleIcon(user.role)} {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        {/* User Info Card */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              background: getRoleColor(user.role),
              color: 'white',
              borderRadius: 50,
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24
            }}>
              {getRoleIcon(user.role)}
            </div>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: 20, fontWeight: 'bold' }}>
                {user.name}
              </h2>
              <p style={{ margin: '4px 0', color: '#6b7280' }}>
                📧 {user.email}
              </p>
              {user.company && (
                <p style={{ margin: '4px 0', color: '#6b7280' }}>
                  🏢 {user.company}
                </p>
              )}
              {user.phone && (
                <p style={{ margin: '4px 0', color: '#6b7280' }}>
                  📞 {user.phone}
                </p>
              )}
              <div style={{
                display: 'inline-block',
                background: getRoleColor(user.role),
                color: 'white',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 'bold',
                marginTop: 8
              }}>
                {user.role.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Features */}
        <div>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 'bold' }}>
            Dashboard Features
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20
          }}>
            {getDashboardFeatures(user.role).map((feature, index) => (
              <a
                key={index}
                href={feature.href}
                style={{
                  background: 'white',
                  borderRadius: 12,
                  padding: 24,
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    background: feature.color,
                    color: 'white',
                    borderRadius: 8,
                    padding: '12px',
                    fontSize: 24
                  }}>
                    {feature.icon}
                  </div>
                  <div>
                    <h4 style={{
                      margin: '0 0 4px 0',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#1f2937'
                    }}>
                      {feature.name}
                    </h4>
                    <p style={{
                      margin: 0,
                      fontSize: 14,
                      color: '#6b7280'
                    }}>
                      Access {feature.name.toLowerCase()}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 'bold' }}>
            Quick Stats
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16
          }}>
            <div style={{
              background: 'white',
              borderRadius: 8,
              padding: 20,
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>0</div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Total Dispatches</div>
            </div>
            <div style={{
              background: 'white',
              borderRadius: 8,
              padding: 20,
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🚛</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>0</div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Active Trucks</div>
            </div>
            <div style={{
              background: 'white',
              borderRadius: 8,
              padding: 20,
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>⏱️</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>0</div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Avg Response Time</div>
            </div>
            <div style={{
              background: 'white',
              borderRadius: 8,
              padding: 20,
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>0</div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Customer Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
