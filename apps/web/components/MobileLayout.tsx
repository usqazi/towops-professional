'use client'
import { useState, useEffect } from 'react'

interface MobileLayoutProps {
  children: React.ReactNode
  title?: string
  showBackButton?: boolean
  onBack?: () => void
}

export default function MobileLayout({ 
  children, 
  title, 
  showBackButton = false, 
  onBack 
}: MobileLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile) {
    return <>{children}</>
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      paddingBottom: '80px' // Space for bottom navigation
    }}>
      {/* Mobile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          {showBackButton && (
            <button
              onClick={onBack}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: 6,
                padding: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: 18
              }}
            >
              ←
            </button>
          )}
          <div>
            <h1 style={{margin: 0, fontSize: 18, fontWeight: 'bold'}}>
              {title || 'TowOps'}
            </h1>
            <p style={{margin: 0, fontSize: 12, opacity: 0.8}}>
              Professional Dispatch
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div style={{padding: '16px'}}>
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '8px 0',
        zIndex: 1000,
        boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          {[
            { href: '/dispatch', icon: '📞', label: 'Dispatch' },
            { href: '/mobile', icon: '📱', label: 'Mobile' },
            { href: '/live-tracking', icon: '🗺️', label: 'Track' },
            { href: '/reports', icon: '📊', label: 'Reports' },
            { href: '/free-tier', icon: '🆓', label: 'Free' }
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '8px',
                textDecoration: 'none',
                color: '#6b7280',
                fontSize: 12,
                fontWeight: 'bold'
              }}
            >
              <span style={{fontSize: 20}}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
