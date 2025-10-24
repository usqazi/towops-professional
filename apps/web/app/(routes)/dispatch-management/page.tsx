'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../../../lib/auth'
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
}

interface Driver {
  id: string
  name: string
  status: 'available' | 'busy' | 'offline'
  rating: number
  totalJobs: number
  location: { lat: number; lng: number }
  vehicleType: string
  lastActive: number
}

export default function DispatchManagementPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<DispatchRequest[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selectedRequest, setSelectedRequest] = useState<DispatchRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    loadDispatchData()
    const interval = setInterval(loadDispatchData, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const loadDispatchData = async () => {
    try {
      const [requestsRes, driversRes] = await Promise.all([
        fetch('/api/dispatch/request'),
        fetch('/api/dispatch/response')
      ])

      const requestsData = await requestsRes.json()
      const driversData = await driversRes.json()

      if (requestsData.success) {
        setRequests(requestsData.requests)
      }

      if (driversData.success) {
        setDrivers(driversData.drivers)
      }
    } catch (error) {
      console.error('Failed to load dispatch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createDispatchRequest = async (formData: any) => {
    try {
      const response = await fetch('/api/dispatch/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'customer-1',
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          location: {
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng)
          },
          priority: formData.priority,
          vehicleType: formData.vehicleType,
          description: formData.description
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Dispatch request created successfully!')
        setShowCreateForm(false)
        loadDispatchData()
      } else {
        alert('Failed to create dispatch request. Please try again.')
      }
    } catch (error) {
      console.error('Failed to create dispatch request:', error)
      alert('Network error. Please check your connection.')
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

  const getDriverStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10b981'
      case 'busy': return '#f59e0b'
      case 'offline': return '#6b7280'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        gap: 16
      }}>
        <div style={{ fontSize: 48 }}>⏳</div>
        <p style={{ color: '#6b7280' }}>Loading dispatch data...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 'bold' }}>
            📞 Dispatch Management
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#6b7280' }}>
            Real-time dispatch management with Uber-style driver assignment
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ➕ Create Request
        </button>
      </div>

      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 20,
        marginBottom: 30
      }}>
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
            {requests.length}
          </div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>Total Requests</div>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
            {requests.filter(r => r.status === 'pending').length}
          </div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>Pending</div>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🚛</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
            {drivers.filter(d => d.status === 'available').length}
          </div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>Available Drivers</div>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
            {requests.filter(r => r.status === 'completed').length}
          </div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>Completed</div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: 30
      }}>
        {/* Requests List */}
        <div>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 'bold' }}>
            Dispatch Requests
          </h3>
          
          <div style={{ maxHeight: 600, overflowY: 'auto' }}>
            {requests.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: 12,
                padding: 40,
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <p style={{ margin: 0, color: '#6b7280' }}>No dispatch requests</p>
              </div>
            ) : (
              requests.map(request => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  style={{
                    background: 'white',
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 16,
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: selectedRequest?.id === request.id ? '2px solid #2563eb' : '1px solid #e5e7eb'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                  }}>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 'bold' }}>
                      {getPriorityIcon(request.priority)} {request.customerName}
                    </h4>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{
                        background: getPriorityColor(request.priority),
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}>
                        {request.priority.toUpperCase()}
                      </span>
                      <span style={{
                        background: getStatusColor(request.status),
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}>
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 8 }}>
                    <p style={{ margin: '4px 0', fontSize: 14 }}>
                      <strong>Phone:</strong> {request.customerPhone}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: 14 }}>
                      <strong>Service:</strong> {request.description}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: 14 }}>
                      <strong>Vehicle:</strong> {request.vehicleType}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: 14 }}>
                      <strong>Created:</strong> {new Date(request.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Drivers Status */}
        <div>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 'bold' }}>
            Driver Status
          </h3>
          
          <div style={{ maxHeight: 600, overflowY: 'auto' }}>
            {drivers.map(driver => (
              <div
                key={driver.id}
                style={{
                  background: 'white',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8
                }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 'bold' }}>
                    🚛 {driver.name}
                  </h4>
                  <span style={{
                    background: getDriverStatusColor(driver.status),
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 'bold'
                  }}>
                    {driver.status.toUpperCase()}
                  </span>
                </div>
                
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  <p style={{ margin: '2px 0' }}>
                    ⭐ Rating: {driver.rating} | Jobs: {driver.totalJobs}
                  </p>
                  <p style={{ margin: '2px 0' }}>
                    🚛 {driver.vehicleType} | Last Active: {new Date(driver.lastActive).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: 'white',
            padding: 32,
            borderRadius: 12,
            maxWidth: 500,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Create Dispatch Request</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              createDispatchRequest({
                customerName: formData.get('customerName'),
                customerPhone: formData.get('customerPhone'),
                lat: formData.get('lat'),
                lng: formData.get('lng'),
                priority: formData.get('priority'),
                vehicleType: formData.get('vehicleType'),
                description: formData.get('description')
              })
            }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                  Customer Name *
                </label>
                <input
                  name="customerName"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                  Customer Phone *
                </label>
                <input
                  name="customerPhone"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                    Latitude *
                  </label>
                  <input
                    name="lat"
                    type="number"
                    step="0.000001"
                    defaultValue="32.7157"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: 6,
                      fontSize: 14
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                    Longitude *
                  </label>
                  <input
                    name="lng"
                    type="number"
                    step="0.000001"
                    defaultValue="-117.1611"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: 6,
                      fontSize: 14
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                  Priority
                </label>
                <select
                  name="priority"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium" selected>Medium</option>
                  <option value="high">High</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                >
                  <option value="light-duty">Light Duty</option>
                  <option value="flatbed">Flatbed</option>
                  <option value="heavy-duty">Heavy Duty</option>
                </select>
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14,
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 'bold'
                  }}
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
