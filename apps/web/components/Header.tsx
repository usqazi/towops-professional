'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth'

interface HeaderProps {
  currentPage?: string
}

export default function Header({ currentPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  useEffect(() => {
    // Check connection status
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:8000/healthz', { timeout: 3000 })
        setIsConnected(response.ok)
      } catch {
        setIsConnected(false)
      }
    }
    checkConnection()
    const interval = setInterval(checkConnection, 10000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { href: '/dispatch', label: 'Dispatch', icon: '📞' },
    { href: '/dispatch-management', label: 'Dispatch Mgmt', icon: '🎯', premium: true },
    { href: '/driver-mobile', label: 'Driver App', icon: '📱', premium: true },
    { href: '/request', label: 'Request Service', icon: '🚛', premium: true },
    { href: '/track', label: 'Track Request', icon: '🗺️', premium: true },
    { href: '/mobile', label: 'Mobile', icon: '📱' },
    { href: '/nsv', label: 'NSV QA', icon: '📋' },
    { href: '/reports', label: 'Reports', icon: '📊' },
    { href: '/live-tracking', label: 'Live Tracking', icon: '🗺️', premium: true },
    { href: '/map', label: 'Map', icon: '🌍', premium: true },
    { href: '/free-tier', label: 'Free Tier', icon: '🆓' },
    { href: '/upgrade', label: 'Upgrade', icon: '🚀', highlight: true }
  ]

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

  return (
    <header style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: 'white',
      padding: '16px 0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{maxWidth: 1200, margin: '0 auto', padding: '0 20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          {/* Logo and Brand */}
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 24
            }}>
              🚛
            </div>
            <div>
              <h1 style={{margin: 0, fontSize: 24, fontWeight: 'bold'}}>TowOps</h1>
              <p style={{margin: 0, fontSize: 12, opacity: 0.8}}>Professional Dispatch System</p>
            </div>
          </div>

          {/* User Info and Connection Status */}
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            {/* Connection Status */}
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isConnected ? '#10b981' : '#ef4444',
                animation: isConnected ? 'pulse 2s infinite' : 'none'
              }} />
              <span style={{fontSize: 12, opacity: 0.9}}>
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>

            {/* User Authentication */}
            {isAuthenticated && user ? (
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{
                  background: getRoleColor(user.role),
                  color: 'white',
                  borderRadius: 20,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <span>{getRoleIcon(user.role)}</span>
                  <span>{user.role.toUpperCase()}</span>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: 14, fontWeight: 'bold'}}>{user.name}</div>
                  <div style={{fontSize: 12, opacity: 0.8}}>{user.email}</div>
                </div>
                <button
                  onClick={logout}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '6px 12px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{display: 'flex', gap: 8}}>
                <a
                  href="/login"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: 6,
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 'bold',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  Login
                </a>
                <a
                  href="/login"
                  style={{
                    background: 'rgba(16,185,129,0.3)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: 6,
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 'bold',
                    border: '1px solid rgba(16,185,129,0.5)'
                  }}
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{marginTop: 16}}>
          {/* Desktop Navigation */}
          <div style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: currentPage === item.href ? 'bold' : 'normal',
                  background: currentPage === item.href 
                    ? 'rgba(255,255,255,0.2)' 
                    : item.highlight 
                      ? 'rgba(16,185,129,0.3)' 
                      : item.premium 
                        ? 'rgba(124,58,237,0.3)' 
                        : 'transparent',
                  border: item.highlight ? '1px solid rgba(16,185,129,0.5)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.premium && (
                  <span style={{
                    background: 'rgba(124,58,237,0.8)',
                    color: 'white',
                    fontSize: 10,
                    padding: '2px 4px',
                    borderRadius: 4,
                    fontWeight: 'bold'
                  }}>
                    PRO
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'none',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: 6,
              padding: '8px',
              color: 'white',
              cursor: 'pointer',
              marginTop: 12
            }}
          >
            ☰ Menu
          </button>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginTop: 12,
              padding: '12px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 8
            }}>
              {navItems.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 6,
                    textDecoration: 'none',
                    color: 'white',
                    fontSize: 14,
                    background: currentPage === item.href ? 'rgba(255,255,255,0.2)' : 'transparent'
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.premium && (
                    <span style={{
                      background: 'rgba(124,58,237,0.8)',
                      color: 'white',
                      fontSize: 10,
                      padding: '2px 4px',
                      borderRadius: 4,
                      fontWeight: 'bold'
                    }}>
                      PRO
                    </span>
                  )}
                </a>
              ))}
            </div>
          )}
        </nav>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  )
}
