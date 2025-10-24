'use client'
import { useState, useEffect } from 'react'
import GPSTracker from '../../../components/GPSTracker'
import MobileLayout from '../../../components/MobileLayout'

interface LiveIncident {
  call_id: string
  unit_id: string
  status: string
  progress: number
  current_location: { lat: number; lng: number }
  destination: { lat: number; lng: number }
  estimated_arrival: string
  distance_remaining: string
  last_updated: number
}

export default function LiveTrackingPage() {
  const [incidents, setIncidents] = useState<LiveIncident[]>([])
  const [selectedIncident, setSelectedIncident] = useState<LiveIncident | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('Connecting...')

  // Real-time data fetching with GPS simulation
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch('http://localhost:8000/live-tracking')
        const data = await response.json()
        
        if (data.active_assignments) {
          setIncidents(data.active_assignments)
          setIsConnected(true)
          setConnectionStatus('Connected to FastAPI')
        } else {
          // No active assignments, create demo data
          createDemoIncidents()
        }
      } catch (error) {
        console.error('Failed to fetch live data:', error)
        setIsConnected(false)
        setConnectionStatus('Disconnected - Using Demo Data')
        createDemoIncidents()
      }
    }

    const createDemoIncidents = () => {
      setIncidents([
        {
          call_id: 'DEMO-001',
          unit_id: 'TRUCK-001',
          status: 'enroute',
          progress: 65,
          current_location: { lat: 32.7185, lng: -117.1605 },
          destination: { lat: 32.7157, lng: -117.1611 },
          estimated_arrival: '8 min',
          distance_remaining: '2.3 km',
          last_updated: Date.now() / 1000
        },
        {
          call_id: 'DEMO-002',
          unit_id: 'TRUCK-002',
          status: 'assigned',
          progress: 0,
          current_location: { lat: 32.7200, lng: -117.1600 },
          destination: { lat: 32.7140, lng: -117.1620 },
          estimated_arrival: '15 min',
          distance_remaining: '4.1 km',
          last_updated: Date.now() / 1000
        }
      ])
    }

    // Initial fetch
    fetchLiveData()

    // Set up polling for real-time updates
    const interval = setInterval(fetchLiveData, 2000) // Update every 2 seconds like Uber
    return () => clearInterval(interval)
  }, [])

  // Simulate real-time GPS updates like Uber
  useEffect(() => {
    if (!isConnected && incidents.length > 0) {
      const interval = setInterval(() => {
        setIncidents(prev => prev.map(incident => {
          if (incident.status === 'enroute' && incident.progress < 95) {
            // More realistic progress simulation
            const progressIncrement = Math.random() * 2 + 0.5 // 0.5-2.5% per update
            const newProgress = Math.min(incident.progress + progressIncrement, 95)
            
            // Calculate new location based on progress
            const newLocation = interpolateLocation(
              incident.current_location,
              incident.destination,
              newProgress / 100
            )
            
            // Add realistic GPS "jitter" (small random movements)
            const jitterLat = (Math.random() - 0.5) * 0.0001
            const jitterLng = (Math.random() - 0.5) * 0.0001
            
            return {
              ...incident,
              progress: newProgress,
              current_location: {
                lat: newLocation.lat + jitterLat,
                lng: newLocation.lng + jitterLng
              },
              estimated_arrival: calculateETA(newProgress),
              last_updated: Date.now() / 1000
            }
          } else if (incident.status === 'assigned' && Math.random() < 0.1) {
            // Randomly start some assigned trucks
            return {
              ...incident,
              status: 'enroute',
              progress: 0
            }
          }
          return incident
        }))
      }, 2000) // Update every 2 seconds like Uber

      return () => clearInterval(interval)
    }
  }, [isConnected, incidents.length])

  const interpolateLocation = (start: {lat: number, lng: number}, end: {lat: number, lng: number}, progress: number) => {
    return {
      lat: start.lat + (end.lat - start.lat) * progress,
      lng: start.lng + (end.lng - start.lng) * progress
    }
  }

  const calculateETA = (progress: number) => {
    const remainingProgress = 100 - progress
    const estimatedMinutes = Math.max(1, Math.round(remainingProgress / 10))
    return `${estimatedMinutes} min`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enroute': return '#3b82f6'
      case 'assigned': return '#f59e0b'
      case 'arrived': return '#10b981'
      case 'completed': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return '🚛'
      case 'enroute': return '🚗'
      case 'on_scene': return '📍'
      case 'complete': return '✅'
      default: return '⏳'
    }
  }

  const createTestIncident = async () => {
    try {
      // Create a CAD event
      const callId = `TEST-${Date.now()}`
      await fetch('http://localhost:8000/cad/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call_id: callId,
          lat: 32.7157 + (Math.random() - 0.5) * 0.02,
          lon: -117.1611 + (Math.random() - 0.5) * 0.02,
          reason: 'Test Incident',
          priority: 2
        })
      })

      // Assign a truck
      await fetch('http://localhost:8000/dispatch/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call_id: callId,
          unit_id: 'TRUCK-001'
        })
      })

      // Update status to enroute
      await fetch('http://localhost:8000/live-tracking/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call_id: callId,
          unit_id: 'TRUCK-001',
          status: 'enroute',
          progress: 0
        })
      })
    } catch (error) {
      console.error('Failed to create test incident:', error)
    }
  }

  return (
    <MobileLayout title="Live Tow Tracking">
      <div style={{marginBottom: 20}}>
        <h1 style={{margin: 0, fontSize: 24, fontWeight: 'bold'}}>Live Tow Tracking</h1>
        <p style={{margin: '8px 0 0 0', color: '#6b7280'}}>
          Real-time GPS tracking of tow incidents - just like Uber!
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 12,
          padding: '8px 12px',
          background: isConnected ? '#dcfce7' : '#fef3c7',
          borderRadius: 6,
          fontSize: 14
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: isConnected ? '#10b981' : '#f59e0b'
          }} />
          {connectionStatus}
        </div>
        <button 
          onClick={createTestIncident}
          style={{
            background: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            marginTop: 12,
            fontSize: 14,
            fontWeight: 'bold'
          }}
        >
          🚛 Create Test Incident
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: 20,
        height: '600px'
      }}>
        {/* GPS Tracker */}
        <div style={{
          background: '#f3f4f6',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <GPSTracker
            incidents={incidents}
            onIncidentSelect={setSelectedIncident}
            selectedIncident={selectedIncident}
            height="100%"
          />
        </div>

        {/* Incident List */}
        <div>
          <h3 style={{margin: '0 0 16px 0', fontSize: 18, fontWeight: 'bold'}}>Active Tow Incidents</h3>
          <div style={{maxHeight: 600, overflowY: 'auto'}}>
            {incidents.length === 0 ? (
              <div style={{
                padding: 40,
                textAlign: 'center',
                background: '#f9fafb',
                borderRadius: 8,
                color: '#6b7280',
                border: '1px solid #e5e7eb'
              }}>
                <p style={{margin: 0, fontSize: 16}}>No active incidents</p>
                <p style={{margin: '8px 0 0 0', fontSize: 14}}>Create a test incident to see live tracking</p>
              </div>
            ) : (
              incidents.map(incident => (
                <div 
                  key={incident.call_id}
                  onClick={() => setSelectedIncident(incident)}
                  style={{
                    border: selectedIncident?.call_id === incident.call_id ? '2px solid #2563eb' : '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 12,
                    cursor: 'pointer',
                    background: selectedIncident?.call_id === incident.call_id ? '#eff6ff' : 'white',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedIncident?.call_id === incident.call_id ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                    <h4 style={{margin: 0, fontSize: 16, fontWeight: 'bold'}}>{incident.call_id}</h4>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                      <span style={{fontSize: 20}}>{getStatusIcon(incident.status)}</span>
                      <span style={{
                        background: getStatusColor(incident.status),
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}>
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{marginBottom: 8}}>
                    <p style={{margin: '4px 0', fontSize: 14}}><strong>Truck:</strong> {incident.unit_id}</p>
                    <p style={{margin: '4px 0', fontSize: 14}}><strong>ETA:</strong> {incident.estimated_arrival}</p>
                    <p style={{margin: '4px 0', fontSize: 14}}><strong>Distance:</strong> {incident.distance_remaining}</p>
                  </div>

                  {incident.status === 'enroute' && (
                    <div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
                        <span style={{fontSize: 12, fontWeight: 'bold'}}>Progress</span>
                        <span style={{fontSize: 12, fontWeight: 'bold'}}>{incident.progress.toFixed(0)}%</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: 6,
                        background: '#e5e7eb',
                        borderRadius: 3,
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${incident.progress}%`,
                          height: '100%',
                          background: '#3b82f6',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  )}

                  <div style={{
                    marginTop: 8,
                    padding: '8px',
                    background: '#f9fafb',
                    borderRadius: 4,
                    fontSize: 11,
                    color: '#6b7280'
                  }}>
                    <p style={{margin: '2px 0'}}>📍 GPS: {incident.current_location.lat.toFixed(6)}, {incident.current_location.lng.toFixed(6)}</p>
                    <p style={{margin: '2px 0'}}>🎯 Dest: {incident.destination.lat.toFixed(6)}, {incident.destination.lng.toFixed(6)}</p>
                    <p style={{margin: '2px 0'}}>🕒 Updated: {new Date(incident.last_updated * 1000).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .gps-tracker {
            height: 400px !important;
          }
        }
      `}</style>
    </MobileLayout>
  )
}