'use client'
import { useState } from 'react'
import { useAuth } from '../../../lib/auth'
import MobileLayout from '../../../components/MobileLayout'

interface RequestForm {
  customerName: string
  customerPhone: string
  location: {
    lat: number
    lng: number
  }
  destination?: {
    lat: number
    lng: number
  }
  priority: 'low' | 'medium' | 'high' | 'emergency'
  vehicleType: string
  description: string
}

export default function CustomerRequestPage() {
  const { user } = useAuth()
  const [form, setForm] = useState<RequestForm>({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    location: { lat: 32.7157, lng: -117.1611 }, // Default San Diego
    destination: undefined,
    priority: 'medium',
    vehicleType: 'light-duty',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/dispatch/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user?.id || 'customer-1',
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          location: form.location,
          destination: form.destination,
          priority: form.priority,
          vehicleType: form.vehicleType,
          description: form.description
        })
      })

      const data = await response.json()

      if (data.success) {
        setRequestId(data.dispatchRequest.id)
        // Reset form
        setForm({
          customerName: '',
          customerPhone: '',
          location: { lat: 32.7157, lng: -117.1611 },
          destination: undefined,
          priority: 'medium',
          vehicleType: 'light-duty',
          description: ''
        })
      } else {
        setError(data.error || 'Failed to create request')
      }
    } catch (error) {
      setError('Network error. Please try again.')
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

  if (requestId) {
    return (
      <MobileLayout title="Request Submitted">
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 24,
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ margin: '0 0 16px 0', fontSize: 24, fontWeight: 'bold', color: '#059669' }}>
            Request Submitted Successfully!
          </h2>
          <p style={{ margin: '0 0 16px 0', color: '#6b7280' }}>
            Your tow request has been submitted and we're finding the best driver for you.
          </p>
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: 8,
            padding: 16,
            marginBottom: 20
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 'bold' }}>
              Request ID: {requestId}
            </p>
            <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>
              You can use this ID to track your request
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setRequestId(null)}
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
              New Request
            </button>
            <button
              onClick={() => window.location.href = `/track?requestId=${requestId}`}
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
              Track Request
            </button>
          </div>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout title="Request Tow Service">
      <form onSubmit={handleSubmit}>
        {/* Customer Information */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 'bold' }}>
            📋 Customer Information
          </h3>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
              Full Name *
            </label>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 16
              }}
            />
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
              Phone Number *
            </label>
            <input
              type="tel"
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 16
              }}
            />
          </div>
        </div>

        {/* Service Details */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 'bold' }}>
            🚛 Service Details
          </h3>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
              Priority Level
            </label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 16
              }}
            >
              <option value="low">📋 Low - Routine service</option>
              <option value="medium">📞 Medium - Standard service</option>
              <option value="high">⚡ High - Urgent service</option>
              <option value="emergency">🚨 Emergency - Immediate response</option>
            </select>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
              Vehicle Type
            </label>
            <select
              value={form.vehicleType}
              onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 16
              }}
            >
              <option value="light-duty">🚗 Light Duty (Cars, SUVs)</option>
              <option value="flatbed">🚛 Flatbed (Trucks, Vans)</option>
              <option value="heavy-duty">🚚 Heavy Duty (Commercial)</option>
            </select>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
              Service Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Describe the issue (e.g., engine won't start, flat tire, accident...)"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: 8,
                fontSize: 16,
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Location */}
        <div style={{
          background: 'white',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 'bold' }}>
            📍 Location
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                Latitude *
              </label>
              <input
                type="number"
                step="0.000001"
                value={form.location.lat}
                onChange={(e) => setForm({ 
                  ...form, 
                  location: { ...form.location, lat: parseFloat(e.target.value) || 0 }
                })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 16
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>
                Longitude *
              </label>
              <input
                type="number"
                step="0.000001"
                value={form.location.lng}
                onChange={(e) => setForm({ 
                  ...form, 
                  location: { ...form.location, lng: parseFloat(e.target.value) || 0 }
                })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: 16
                }}
              />
            </div>
          </div>
          
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16
          }}>
            <p style={{ margin: 0, fontSize: 14, color: '#0c4a6e' }}>
              💡 <strong>Tip:</strong> Use your phone's GPS or Google Maps to get exact coordinates
            </p>
          </div>
        </div>

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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: loading 
              ? '#9ca3af' 
              : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? '⏳ Submitting Request...' : '🚛 Submit Tow Request'}
        </button>
      </form>
    </MobileLayout>
  )
}
