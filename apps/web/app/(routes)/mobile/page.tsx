'use client'
import { useState, useEffect } from 'react'
import { FREE_TIER_LIMITS, UsageTracker } from '../../../lib/free-tier'

interface MobileJob {
  id: string
  caller: string
  location: string
  reason: string
  plate: string
  vin: string
  priority: string
  status: string
  createdAt: any
}

export default function MobilePage() {
  const [jobs, setJobs] = useState<MobileJob[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [driverId] = useState('DRIVER-001') // In a real app, this would come from auth
  const [usage, setUsage] = useState<UsageTracker>({
    trucks: 0,
    dispatches_this_month: 0,
    sms_this_month: 0,
    storage_used_gb: 0,
    api_calls_this_month: 0,
    users: 1,
    reports_this_month: 0,
    nsv_documents_this_month: 0
  })

  useEffect(() => {
    const checkConnection = async () => {
      console.log('Using demo data mode')
      setIsConnected(false)
      // Demo data for when Firebase is not configured
      setJobs([
        { 
          id: '1', 
          location: '123 Main St', 
          status: 'assigned',
          caller: 'John Doe',
          reason: 'Accident',
          plate: 'ABC123',
          vin: '',
          priority: 'high',
          createdAt: new Date()
        },
        { 
          id: '2', 
          location: '456 Oak Ave', 
          status: 'enroute',
          caller: 'Jane Smith',
          reason: 'Breakdown',
          plate: 'XYZ789',
          vin: '',
          priority: 'normal',
          createdAt: new Date()
        }
      ])
    }
    checkConnection()
  }, [])

  const loadJobs = async () => {
    // Firebase not available, using demo data
    console.log('Using demo data')
  }

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    )
    setJobs(updatedJobs)
    
    // In a real app, you'd update Firebase here
    console.log(`Updated job ${jobId} to status: ${newStatus}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return '#f59e0b'
      case 'enroute': return '#8b5cf6'
      case 'on_scene': return '#ef4444'
      case 'complete': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return '#dc2626'
      case 'high': return '#ea580c'
      case 'normal': return '#2563eb'
      case 'low': return '#059669'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{maxWidth: 800, margin: '0 auto', padding: '0 16px'}}>
      <div style={{marginBottom: 20, padding: 12, background: isConnected ? '#f0fdf4' : '#fef3c7', borderRadius: 4}}>
        <span style={{fontSize: 14, fontWeight: 'bold'}}>
          {isConnected ? '🟢 Connected to Firebase' : '🟡 Demo Mode (Firebase not configured)'}
        </span>
      </div>

      <h2>Driver Mobile PWA</h2>
      <div style={{marginBottom: 20, padding: 16, background: '#f3f4f6', borderRadius: 4}}>
        <h3 style={{margin: '0 0 8px 0'}}>Driver: {driverId}</h3>
        <p style={{margin: 0, color: '#6b7280'}}>Active Jobs: {jobs.length}</p>
      </div>

      {jobs.length === 0 ? (
        <div style={{border: '1px solid #ddd', padding: 40, borderRadius: 4, textAlign: 'center', color: '#6b7280'}}>
          <h3>No Active Jobs</h3>
          <p>You'll see assigned jobs here when they become available.</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {jobs.map(job => (
            <div key={job.id} style={{
              border: '1px solid #ddd', 
              padding: 20, 
              borderRadius: 8,
              background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                <h3 style={{margin: 0, fontSize: 18}}>{job.reason}</h3>
                <div style={{display: 'flex', gap: 8}}>
                  <span style={{
                    background: getPriorityColor(job.priority),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}>
                    {job.priority.toUpperCase()}
                  </span>
                  <span style={{
                    background: getStatusColor(job.status),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}>
                    {job.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{marginBottom: 16}}>
                <div style={{marginBottom: 8}}>
                  <strong>📍 Location:</strong> {job.location}
                </div>
                <div style={{marginBottom: 8}}>
                  <strong>📞 Caller:</strong> {job.caller}
                </div>
                {(job.plate || job.vin) && (
                  <div style={{marginBottom: 8}}>
                    <strong>🚗 Vehicle:</strong> {job.plate || job.vin}
                  </div>
                )}
              </div>

              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                {job.status === 'assigned' && (
                  <button 
                    onClick={() => updateJobStatus(job.id, 'enroute')}
                    style={{
                      background: '#8b5cf6',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 'bold'
                    }}
                  >
                    🚛 Start En Route
                  </button>
                )}
                {job.status === 'enroute' && (
                  <button 
                    onClick={() => updateJobStatus(job.id, 'on_scene')}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 'bold'
                    }}
                  >
                    🎯 Arrive On Scene
                  </button>
                )}
                {job.status === 'on_scene' && (
                  <button 
                    onClick={() => updateJobStatus(job.id, 'complete')}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 'bold'
                    }}
                  >
                    ✅ Complete Job
                  </button>
                )}
                
                <button 
                  onClick={() => {/* Add photo upload functionality */}}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                >
                  📸 Add Photos
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{marginTop: 40, padding: 20, background: '#f9fafb', borderRadius: 4}}>
        <h3 style={{margin: '0 0 12px 0'}}>Quick Actions</h3>
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
          <button style={{
            background: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}>
            📍 Update Location
          </button>
          <button style={{
            background: '#059669',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}>
            ⏰ Break Time
          </button>
          <button style={{
            background: '#dc2626',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}>
            🚨 Emergency
          </button>
        </div>
      </div>
    </div>
  )
}
