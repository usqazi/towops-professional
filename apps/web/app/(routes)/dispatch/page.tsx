'use client'
import { useState, useEffect } from 'react'
import { FREE_TIER_LIMITS, UsageTracker } from '../../../lib/free-tier'

interface DispatchJob {
  id?: string
  caller: string
  location: string
  reason: string
  plate: string
  vin: string
  priority: string
  status: string
  createdAt?: any
}

export default function DispatchPage() {
  const [form, setForm] = useState<DispatchJob>({ 
    caller:'', 
    location:'', 
    reason:'', 
    plate:'', 
    vin:'', 
    priority:'normal',
    status: 'new'
  })
  const [queue, setQueue] = useState<DispatchJob[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Check Firebase connection and load usage
  useEffect(() => {
    const checkConnection = async () => {
      console.log('Using local storage mode')
      setIsConnected(false)
      // Load from localStorage if Firebase not available
      const savedQueue = localStorage.getItem('dispatchQueue')
      if (savedQueue) {
        setQueue(JSON.parse(savedQueue))
      }
      
      // Load usage tracking
      const savedUsage = localStorage.getItem('towops_usage')
      if (savedUsage) {
        setUsage(JSON.parse(savedUsage))
      }
    }
    checkConnection()
  }, [])

  // Load existing dispatches
  useEffect(() => {
    if (isConnected) {
      loadDispatches()
    }
  }, [isConnected])

  const loadDispatches = async () => {
    // Firebase not available, using localStorage
    console.log('Loading from localStorage')
  }

  const submit = async () => {
    if (!form.caller || !form.location || !form.reason) {
      alert('Please fill in caller, location, and reason')
      return
    }

    // Check free tier limits
    if (usage.dispatches_this_month >= FREE_TIER_LIMITS.MAX_DISPATCHES_PER_MONTH) {
      setShowUpgradeModal(true)
      return
    }

    setIsLoading(true)
    const job: DispatchJob = { 
      ...form, 
      id: Date.now().toString(), 
      status:'new',
      createdAt: new Date()
    }

    try {
      // Save to localStorage
      const newQueue = [job, ...queue]
      setQueue(newQueue)
      localStorage.setItem('dispatchQueue', JSON.stringify(newQueue))
      
      // Update usage tracking
      const newUsage = { ...usage, dispatches_this_month: usage.dispatches_this_month + 1 }
      setUsage(newUsage)
      localStorage.setItem('towops_usage', JSON.stringify(newUsage))
      
      setForm({ 
        caller:'', 
        location:'', 
        reason:'', 
        plate:'', 
        vin:'', 
        priority:'normal',
        status: 'new'
      })
    } catch (error) {
      console.error('Error saving dispatch:', error)
      alert('Failed to save dispatch')
    } finally {
      setIsLoading(false)
    }
  }

  const updateJobStatus = (jobId: string, newStatus: string) => {
    const updatedQueue = queue.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    )
    setQueue(updatedQueue)
    
    if (!isConnected) {
      localStorage.setItem('dispatchQueue', JSON.stringify(updatedQueue))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#3b82f6'
      case 'assigned': return '#f59e0b'
      case 'enroute': return '#8b5cf6'
      case 'on_scene': return '#ef4444'
      case 'complete': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{maxWidth: 1200, margin: '0 auto'}}>
      <div style={{marginBottom: 20, padding: 12, background: isConnected ? '#f0fdf4' : '#fef3c7', borderRadius: 4}}>
        <span style={{fontSize: 14, fontWeight: 'bold'}}>
          {isConnected ? '🟢 Connected to Firebase' : '🟡 Using Local Storage (Firebase not configured)'}
        </span>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
        <section>
          <h2>Call Intake</h2>
          <div style={{border: '1px solid #ddd', padding: 20, borderRadius: 4}}>
            {['caller','location','reason','plate','vin'].map(k => (
              <div key={k} style={{marginBottom:16}}>
                <label style={{display:'block', fontSize:14, fontWeight:'bold', marginBottom:4}}>
                  {k === 'caller' ? 'Caller Name' :
                   k === 'location' ? 'Location' :
                   k === 'reason' ? 'Reason' :
                   k === 'plate' ? 'License Plate' :
                   'VIN'}
                </label>
                <input 
                  value={(form as any)[k] ?? ''} 
                  onChange={e=>setForm({...form, [k]:e.target.value})} 
                  style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:4}}
                  placeholder={k === 'plate' ? 'ABC123' : k === 'vin' ? '17-character VIN' : ''}
                />
              </div>
            ))}
            
            <div style={{marginBottom:16}}>
              <label style={{display:'block', fontSize:14, fontWeight:'bold', marginBottom:4}}>Priority</label>
              <select 
                value={form.priority} 
                onChange={e=>setForm({...form, priority:e.target.value})}
                style={{width:'100%', padding:8, border:'1px solid #ddd', borderRadius:4}}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <button 
              onClick={submit}
              disabled={isLoading}
              style={{
                width:'100%',
                background: '#2563eb',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: 4,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                fontSize: 16,
                fontWeight: 'bold'
              }}
            >
              {isLoading ? 'Creating...' : 'Create Dispatch'}
            </button>
          </div>
        </section>

        <section>
          <h2>Dispatch Queue ({queue.length})</h2>
          <div style={{maxHeight: '500px', overflowY: 'auto'}}>
            {queue.length === 0 ? (
              <div style={{border: '1px solid #ddd', padding: 20, borderRadius: 4, textAlign: 'center', color: '#6b7280'}}>
                No dispatches yet
              </div>
            ) : (
              queue.map(job => (
                <div key={job.id} style={{
                  border:'1px solid #ddd', 
                  padding:16, 
                  marginBottom:12, 
                  borderRadius:4,
                  background: '#f9fafb'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                    <h4 style={{margin: 0, fontSize: 16}}>{job.reason}</h4>
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
                  
                  <div style={{fontSize: 14, color: '#374151', marginBottom: 8}}>
                    <div><strong>Location:</strong> {job.location}</div>
                    <div><strong>Caller:</strong> {job.caller}</div>
                    {(job.plate || job.vin) && (
                      <div><strong>Vehicle:</strong> {job.plate || job.vin}</div>
                    )}
                    <div><strong>Priority:</strong> {job.priority}</div>
                  </div>

                  <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                    {job.status === 'new' && (
                      <button 
                        onClick={() => updateJobStatus(job.id!, 'assigned')}
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          padding: '4px 8px',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        Assign
                      </button>
                    )}
                    {job.status === 'assigned' && (
                      <button 
                        onClick={() => updateJobStatus(job.id!, 'enroute')}
                        style={{
                          background: '#8b5cf6',
                          color: 'white',
                          padding: '4px 8px',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        En Route
                      </button>
                    )}
                    {job.status === 'enroute' && (
                      <button 
                        onClick={() => updateJobStatus(job.id!, 'on_scene')}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          padding: '4px 8px',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        On Scene
                      </button>
                    )}
                    {job.status === 'on_scene' && (
                      <button 
                        onClick={() => updateJobStatus(job.id!, 'complete')}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          padding: '4px 8px',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Free Tier Usage Display */}
      <div style={{marginTop: 20, padding: 16, background: '#f9fafb', borderRadius: 4}}>
        <h4 style={{margin: '0 0 8px 0'}}>Free Tier Usage</h4>
        <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
          <span>Dispatches this month: <strong>{usage.dispatches_this_month}/{FREE_TIER_LIMITS.MAX_DISPATCHES_PER_MONTH}</strong></span>
          <div style={{
            width: 200,
            height: 8,
            background: '#e5e7eb',
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(usage.dispatches_this_month / FREE_TIER_LIMITS.MAX_DISPATCHES_PER_MONTH) * 100}%`,
              height: '100%',
              background: usage.dispatches_this_month >= FREE_TIER_LIMITS.MAX_DISPATCHES_PER_MONTH * 0.9 ? '#ef4444' : '#10b981',
              transition: 'width 0.3s ease'
            }} />
          </div>
          {usage.dispatches_this_month >= FREE_TIER_LIMITS.MAX_DISPATCHES_PER_MONTH * 0.9 && (
            <span style={{color: '#ef4444', fontSize: 12}}>⚠️ Approaching limit</span>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
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
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: 30,
            borderRadius: 8,
            maxWidth: 500,
            width: '90%'
          }}>
            <h3 style={{margin: '0 0 16px 0'}}>🚀 Free Tier Limit Reached</h3>
            <p>You've used all {FREE_TIER_LIMITS.MAX_DISPATCHES_PER_MONTH} dispatches for this month. Upgrade to continue!</p>
            
            <div style={{margin: '20px 0'}}>
              <h4>Professional Plan - $99/month</h4>
              <ul>
                <li>✅ Unlimited dispatches</li>
                <li>✅ Up to 25 trucks</li>
                <li>✅ Advanced analytics</li>
                <li>✅ API access</li>
                <li>✅ Priority support</li>
              </ul>
            </div>
            
            <div style={{display: 'flex', gap: 12}}>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Maybe Later
              </button>
              <button 
                onClick={() => {
                  setShowUpgradeModal(false)
                  window.open('/upgrade', '_blank')
                }}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
