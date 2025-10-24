'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../../../lib/auth'
import MobileLayout from '../../../components/MobileLayout'

interface DispatchRequest {
  id: string
  customerName: string
  customerPhone: string
  location: { lat: number; lng: number }
  destination?: { lat: number; lng: number }
  priority: 'low' | 'medium' | 'high' | 'emergency'
  vehicleType: string
  description: string
  estimatedDuration: number
  createdAt: number
  status: 'pending' | 'assigned' | 'accepted' | 'rejected' | 'completed'
  expiresAt: number
}

interface Driver {
  id: string
  name: string
  status: 'available' | 'busy' | 'offline'
  rating: number
  totalJobs: number
  location: { lat: number; lng: number }
  vehicleType: string
}

export default function DriverMobilePage() {
  const { user } = useAuth()
  const [driver, setDriver] = useState<Driver | null>(null)
  const [currentRequest, setCurrentRequest] = useState<DispatchRequest | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDriverData()
      connectToRealTimeUpdates()
    }
  }, [user])

  const loadDriverData = async () => {
    try {
      // Load driver profile
      const response = await fetch(`/api/dispatch/response?driverId=${user?.id}`)
      const data = await response.json()
      
      if (data.success) {
        setDriver(data.driver)
        setCurrentRequest(data.requests[0] || null)
      }
    } catch (error) {
      console.error('Failed to load driver data:', error)
    } finally {
      setLoading(false)
    }
  }

  const connectToRealTimeUpdates = async () => {
    try {
      await fetch('/api/dispatch/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: user?.id,
          action: 'connect'
        })
      })
      setIsOnline(true)
    } catch (error) {
      console.error('Failed to connect to real-time updates:', error)
    }
  }

  const disconnectFromUpdates = async () => {
    try {
      await fetch('/api/dispatch/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: user?.id,
          action: 'disconnect'
        })
      })
      setIsOnline(false)
    } catch (error) {
      console.error('Failed to disconnect:', error)
    }
  }

  const handleDriverResponse = async (action: 'accept' | 'reject') => {
    if (!currentRequest) return

    try {
      const response = await fetch('/api/dispatch/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: currentRequest.id,
          driverId: user?.id,
          action
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setCurrentRequest(data.dispatchRequest)
        if (action === 'accept') {
          // Show success message
          alert('Request accepted! Navigate to customer location.')
        } else {
          // Request rejected, clear current request
          setCurrentRequest(null)
          alert('Request rejected. Looking for next opportunity.')
        }
      } else {
        alert('Failed to respond to request. Please try again.')
      }
    } catch (error) {
      console.error('Failed to respond to request:', error)
      alert('Network error. Please check your connection.')
    }
  }

  const completeRequest = async () => {
    if (!currentRequest) return

    try {
      const response = await fetch('/api/dispatch/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: currentRequest.id,
          driverId: user?.id,
          action: 'complete'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setCurrentRequest(null)
        alert('Request completed successfully!')
        loadDriverData() // Refresh driver stats
      }
    } catch (error) {
      console.error('Failed to complete request:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return '#dc2626'
      case 'high': return '#f59e0b'
      case 'medium': return '#3b82f6'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'emergency': return '🚨'
      case 'high': return '⚡'
      case 'medium': return '📞'
      case 'low': return '📋'
      default: return '📝'
    }
  }

  const formatTimeRemaining = (expiresAt: number) => {
    const remaining = Math.max(0, expiresAt - Date.now())
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <MobileLayout title="Driver App">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
          gap: 16
        }}>
          <div style={{ fontSize: 48 }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Loading driver data...</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout title="Driver App">
      {/* Driver Status Header */}
      <div style={{
        background: isOnline ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        color: 'white',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: 24 }}>🚛 {driver?.name || 'Driver'}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: isOnline ? '#10b981' : '#ef4444',
            animation: isOnline ? 'pulse 2s infinite' : 'none'
          }} />
          <span style={{ fontSize: 16, fontWeight: 'bold' }}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>⭐ {driver?.rating || 0}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Rating</div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>📋 {driver?.totalJobs || 0}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Jobs</div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>🚛 {driver?.vehicleType || 'N/A'}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Vehicle</div>
          </div>
        </div>
      </div>

      {/* Current Request */}
      {currentRequest ? (
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: `3px solid ${getPriorityColor(currentRequest.priority)}`
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>
              {getPriorityIcon(currentRequest.priority)} New Request
            </h3>
            <div style={{
              background: getPriorityColor(currentRequest.priority),
              color: 'white',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 'bold'
            }}>
              {currentRequest.priority.toUpperCase()}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '8px 0', fontSize: 16 }}>
              <strong>Customer:</strong> {currentRequest.customerName}
            </p>
            <p style={{ margin: '8px 0', fontSize: 16 }}>
              <strong>Phone:</strong> {currentRequest.customerPhone}
            </p>
            <p style={{ margin: '8px 0', fontSize: 16 }}>
              <strong>Service:</strong> {currentRequest.description}
            </p>
            <p style={{ margin: '8px 0', fontSize: 16 }}>
              <strong>Vehicle Type:</strong> {currentRequest.vehicleType}
            </p>
          </div>

          {currentRequest.status === 'assigned' && (
            <div style={{
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 'bold', color: '#92400e' }}>
                ⏰ Time to Accept: {formatTimeRemaining(currentRequest.expiresAt)}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {currentRequest.status === 'assigned' && (
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => handleDriverResponse('accept')}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ✅ Accept Request
              </button>
              <button
                onClick={() => handleDriverResponse('reject')}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ❌ Reject
              </button>
            </div>
          )}

          {currentRequest.status === 'accepted' && (
            <div>
              <div style={{
                background: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 'bold', color: '#16a34a' }}>
                  ✅ Request Accepted! Navigate to customer location.
                </p>
              </div>
              <button
                onClick={completeRequest}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🏁 Complete Request
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 40,
          marginBottom: 20,
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 'bold' }}>
            No Active Requests
          </h3>
          <p style={{ margin: 0, color: '#6b7280' }}>
            {isOnline ? 'Waiting for dispatch requests...' : 'Go online to receive requests'}
          </p>
        </div>
      )}

      {/* Driver Controls */}
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 'bold' }}>
          Driver Controls
        </h3>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={isOnline ? disconnectFromUpdates : connectToRealTimeUpdates}
            style={{
              flex: 1,
              background: isOnline 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {isOnline ? '🔴 Go Offline' : '🟢 Go Online'}
          </button>
          
          <button
            onClick={loadDriverData}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </MobileLayout>
  )
}
