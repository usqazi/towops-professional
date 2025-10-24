'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../../../lib/auth'
import MobileLayout from '../../../components/MobileLayout'
import GPSTracker from '../../../components/GPSTracker'

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
  assignedDriver?: string
  expiresAt: number
  acceptedAt?: number
  completedAt?: number
}

interface Driver {
  id: string
  name: string
  phone: string
  rating: number
  location: { lat: number; lng: number }
  vehicleType: string
}

export default function TrackRequestPage() {
  const { user } = useAuth()
  const [requestId, setRequestId] = useState<string>('')
  const [request, setRequest] = useState<DispatchRequest | null>(null)
  const [driver, setDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)

  // Get request ID from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('requestId')
    if (id) {
      setRequestId(id)
      trackRequest(id)
    }
  }, [])

  const trackRequest = async (id?: string) => {
    const requestIdToTrack = id || requestId
    if (!requestIdToTrack) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/dispatch/request?requestId=${requestIdToTrack}`)
      const data = await response.json()

      if (data.success && data.requests.length > 0) {
        const foundRequest = data.requests[0]
        setRequest(foundRequest)

        // If driver is assigned, get driver details
        if (foundRequest.assignedDriver) {
          const driverResponse = await fetch(`/api/dispatch/response?driverId=${foundRequest.assignedDriver}`)
          const driverData = await driverResponse.json()
          if (driverData.success && driverData.driver) {
            setDriver(driverData.driver)
          }
        }
      } else {
        setError('Request not found. Please check your request ID.')
      }
    } catch (error) {
      setError('Failed to load request details. Please try again.')
    } finally {
      setLoading(false)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b'
      case 'assigned': return '#3b82f6'
      case 'accepted': return '#10b981'
      case 'rejected': return '#ef4444'
      case 'completed': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '⏳ Waiting for driver assignment'
      case 'assigned': return '📞 Driver assigned, waiting for acceptance'
      case 'accepted': return '🚛 Driver accepted, en route to location'
      case 'rejected': return '❌ Driver rejected, reassigning'
      case 'completed': return '✅ Service completed'
      default: return '❓ Unknown status'
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getEstimatedArrival = () => {
    if (!driver || !request) return null
    
    // Simple distance calculation (in production, use proper routing)
    const distance = Math.sqrt(
      Math.pow(driver.location.lat - request.location.lat, 2) +
      Math.pow(driver.location.lng - request.location.lng, 2)
    ) * 111 // Rough conversion to km
    
    const estimatedMinutes = Math.round(distance * 2) // Rough estimate
    return estimatedMinutes
  }

  return (
    <MobileLayout title="Track Request">
      {/* Search Form */}
      {!request && (
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 'bold' }}>
            🔍 Track Your Request
          </h3>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
              Request ID
            </label>
            <input
              type="text"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              placeholder="Enter your request ID"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 16
              }}
            />
          </div>
          
          <button
            onClick={() => trackRequest()}
            disabled={loading || !requestId}
            style={{
              width: '100%',
              background: loading || !requestId
                ? '#9ca3af'
                : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 'bold',
              cursor: loading || !requestId ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Tracking...' : '🔍 Track Request'}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
          color: '#dc2626'
        }}>
          <p style={{ margin: 0, fontSize: 14 }}>❌ {error}</p>
        </div>
      )}

      {/* Request Details */}
      {request && (
        <>
          {/* Request Status */}
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: `3px solid ${getStatusColor(request.status)}`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16
            }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>
                {getPriorityIcon(request.priority)} Request #{request.id.slice(-8)}
              </h3>
              <span style={{
                background: getPriorityColor(request.priority),
                color: 'white',
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 'bold'
              }}>
                {request.priority.toUpperCase()}
              </span>
            </div>
            
            <div style={{
              background: getStatusColor(request.status),
              color: 'white',
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 'bold' }}>
                {getStatusText(request.status)}
              </p>
            </div>
            
            <div style={{ fontSize: 14, color: '#6b7280' }}>
              <p style={{ margin: '4px 0' }}>
                <strong>Created:</strong> {formatTime(request.createdAt)}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>Service:</strong> {request.description}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>Vehicle:</strong> {request.vehicleType}
              </p>
            </div>
          </div>

          {/* Driver Information */}
          {driver && (
            <div style={{
              background: 'white',
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 'bold' }}>
                🚛 Driver Information
              </h3>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color: 'white',
                  marginRight: 16
                }}>
                  🚛
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 'bold' }}>
                    {driver.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>
                    ⭐ {driver.rating} | 📞 {driver.phone}
                  </p>
                </div>
              </div>
              
              {request.status === 'accepted' && (
                <div style={{
                  background: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 16
                }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 'bold', color: '#0c4a6e' }}>
                    🚛 Driver is en route to your location
                  </p>
                  <p style={{ margin: 0, fontSize: 14, color: '#0c4a6e' }}>
                    Estimated arrival: {getEstimatedArrival()} minutes
                  </p>
                </div>
              )}
              
              <button
                onClick={() => setShowMap(!showMap)}
                style={{
                  width: '100%',
                  background: showMap 
                    ? '#6b7280' 
                    : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {showMap ? '🗺️ Hide Map' : '🗺️ Show Driver Location'}
              </button>
            </div>
          )}

          {/* Map */}
          {showMap && driver && (
            <div style={{
              background: 'white',
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 'bold' }}>
                🗺️ Live Tracking
              </h3>
              <GPSTracker
                driverLocation={driver.location}
                customerLocation={request.location}
                driverName={driver.name}
                showRoute={true}
              />
            </div>
          )}

          {/* Actions */}
          <div style={{
            background: 'white',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 'bold' }}>
              📞 Contact & Actions
            </h3>
            
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <button
                onClick={() => window.location.href = `tel:${request.customerPhone}`}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                📞 Call Customer
              </button>
              
              {driver && (
                <button
                  onClick={() => window.location.href = `tel:${driver.phone}`}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🚛 Call Driver
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setRequest(null)}
                style={{
                  flex: 1,
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🔍 Track Another
              </button>
              
              <button
                onClick={() => window.location.href = '/request'}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ➕ New Request
              </button>
            </div>
          </div>
        </>
      )}
    </MobileLayout>
  )
}
