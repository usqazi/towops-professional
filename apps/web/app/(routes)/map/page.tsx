'use client'
import { useState, useEffect, useRef } from 'react'

declare global {
  interface Window {
    L: any
  }
}

export default function InteractiveMapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [trucks, setTrucks] = useState<any[]>([])
  const [incidents, setIncidents] = useState<any[]>([])

  // Load Leaflet.js
  useEffect(() => {
    const loadLeaflet = () => {
      if (typeof window !== 'undefined' && !window.L) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)

        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => {
          initializeMap()
          loadDemoData()
        }
        document.head.appendChild(script)
      } else if (window.L) {
        initializeMap()
        loadDemoData()
      }
    }

    loadLeaflet()
  }, [])

  const initializeMap = () => {
    if (mapRef.current && window.L && !mapInstance.current) {
      // Initialize map centered on San Diego
      mapInstance.current = window.L.map(mapRef.current).setView([32.7157, -117.1611], 11)
      
      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current)

      setIsMapLoaded(true)
      console.log('🗺️ Interactive map initialized successfully')
    }
  }

  const loadDemoData = () => {
    // Demo truck data
    const demoTrucks = [
      {
        id: 'TRUCK-001',
        lat: 32.7200,
        lng: -117.1600,
        status: 'available',
        driver: 'John Smith',
        capacity: 'Heavy Duty'
      },
      {
        id: 'TRUCK-002',
        lat: 32.7140,
        lng: -117.1620,
        status: 'enroute',
        driver: 'Jane Doe',
        capacity: 'Standard'
      },
      {
        id: 'TRUCK-003',
        lat: 32.7180,
        lng: -117.1580,
        status: 'busy',
        driver: 'Mike Johnson',
        capacity: 'Light Duty'
      }
    ]

    // Demo incident data
    const demoIncidents = [
      {
        id: 'INC-001',
        lat: 32.7157,
        lng: -117.1611,
        status: 'assigned',
        reason: 'Accident',
        priority: 'high',
        caller: 'Emergency Services'
      },
      {
        id: 'INC-002',
        lat: 32.7120,
        lng: -117.1630,
        status: 'new',
        reason: 'Breakdown',
        priority: 'normal',
        caller: 'John Doe'
      }
    ]

    setTrucks(demoTrucks)
    setIncidents(demoIncidents)
  }

  // Update map markers when data changes
  useEffect(() => {
    if (mapInstance.current && window.L && isMapLoaded) {
      updateMapMarkers()
    }
  }, [trucks, incidents, isMapLoaded])

  const updateMapMarkers = () => {
    if (!mapInstance.current || !window.L) return

    // Clear existing markers
    mapInstance.current.eachLayer((layer: any) => {
      if (layer instanceof window.L.Marker || layer instanceof window.L.Polyline) {
        mapInstance.current.removeLayer(layer)
      }
    })

    // Add truck markers
    trucks.forEach(truck => {
      const truckIcon = window.L.divIcon({
        className: 'custom-truck-marker',
        html: `<div style="
          background: ${getTruckStatusColor(truck.status)};
          color: white;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
        ">🚛</div>`,
        iconSize: [35, 35],
        iconAnchor: [17, 17]
      })

      const truckMarker = window.L.marker(
        [truck.lat, truck.lng],
        { icon: truckIcon }
      ).addTo(mapInstance.current)

      truckMarker.bindPopup(`
        <div style="min-width: 250px;">
          <h4 style="margin: 0 0 8px 0;">${truck.id}</h4>
          <p style="margin: 4px 0;"><strong>Driver:</strong> ${truck.driver}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> ${truck.status.toUpperCase()}</p>
          <p style="margin: 4px 0;"><strong>Capacity:</strong> ${truck.capacity}</p>
          <div style="margin-top: 8px;">
            <button onclick="alert('Assigning ${truck.id} to nearest incident')" 
                    style="background: #2563eb; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
              Assign to Incident
            </button>
          </div>
        </div>
      `)
    })

    // Add incident markers
    incidents.forEach(incident => {
      const incidentIcon = window.L.divIcon({
        className: 'custom-incident-marker',
        html: `<div style="
          background: ${getIncidentStatusColor(incident.status)};
          color: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
        ">🚨</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })

      const incidentMarker = window.L.marker(
        [incident.lat, incident.lng],
        { icon: incidentIcon }
      ).addTo(mapInstance.current)

      incidentMarker.bindPopup(`
        <div style="min-width: 250px;">
          <h4 style="margin: 0 0 8px 0;">${incident.id}</h4>
          <p style="margin: 4px 0;"><strong>Caller:</strong> ${incident.caller}</p>
          <p style="margin: 4px 0;"><strong>Reason:</strong> ${incident.reason}</p>
          <p style="margin: 4px 0;"><strong>Priority:</strong> ${incident.priority.toUpperCase()}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> ${incident.status.toUpperCase()}</p>
          <div style="margin-top: 8px;">
            <button onclick="alert('Dispatching nearest truck to ${incident.id}')" 
                    style="background: #10b981; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
              Dispatch Truck
            </button>
          </div>
        </div>
      `)
    })

    // Draw routes for enroute trucks
    trucks.forEach(truck => {
      if (truck.status === 'enroute') {
        const nearestIncident = incidents.find(incident => incident.status === 'assigned')
        if (nearestIncident) {
          const routeLine = window.L.polyline([
            [truck.lat, truck.lng],
            [nearestIncident.lat, nearestIncident.lng]
          ], {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 10'
          }).addTo(mapInstance.current)
        }
      }
    })
  }

  const getTruckStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10b981'
      case 'enroute': return '#3b82f6'
      case 'busy': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#f59e0b'
      case 'assigned': return '#8b5cf6'
      case 'enroute': return '#3b82f6'
      case 'on_scene': return '#ef4444'
      case 'complete': return '#10b981'
      default: return '#6b7280'
    }
  }

  const simulateDispatch = () => {
    // Simulate dispatching trucks to incidents
    const updatedTrucks = trucks.map(truck => {
      if (truck.status === 'available') {
        return { ...truck, status: 'enroute' }
      }
      return truck
    })

    const updatedIncidents = incidents.map(incident => {
      if (incident.status === 'new') {
        return { ...incident, status: 'assigned' }
      }
      return incident
    })

    setTrucks(updatedTrucks)
    setIncidents(updatedIncidents)
  }

  return (
    <div style={{maxWidth: 1200, margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
        <h2>🗺️ Interactive Dispatch Map</h2>
        <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: isMapLoaded ? '#10b981' : '#ef4444',
            animation: isMapLoaded ? 'pulse 2s infinite' : 'none'
          }} />
          <span style={{fontSize: 14, color: '#6b7280'}}>
            {isMapLoaded ? 'Map Loaded' : 'Loading Map...'}
          </span>
          <button 
            onClick={simulateDispatch}
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Simulate Dispatch
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div style={{marginBottom: 20}}>
        <div 
          ref={mapRef}
          style={{
            height: 600,
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#f3f4f6'
          }}
        />
      </div>

      {/* Legend */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 20
      }}>
        <div style={{
          padding: 16,
          background: '#f9fafb',
          borderRadius: 4,
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{margin: '0 0 12px 0'}}>🚛 Truck Status</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <div style={{width: 12, height: 12, borderRadius: '50%', background: '#10b981'}} />
              <span style={{fontSize: 14}}>Available</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <div style={{width: 12, height: 12, borderRadius: '50%', background: '#3b82f6'}} />
              <span style={{fontSize: 14}}>En Route</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <div style={{width: 12, height: 12, borderRadius: '50%', background: '#ef4444'}} />
              <span style={{fontSize: 14}}>Busy</span>
            </div>
          </div>
        </div>

        <div style={{
          padding: 16,
          background: '#f9fafb',
          borderRadius: 4,
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{margin: '0 0 12px 0'}}>🚨 Incident Status</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <div style={{width: 12, height: 12, borderRadius: '50%', background: '#f59e0b'}} />
              <span style={{fontSize: 14}}>New</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <div style={{width: 12, height: 12, borderRadius: '50%', background: '#8b5cf6'}} />
              <span style={{fontSize: 14}}>Assigned</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <div style={{width: 12, height: 12, borderRadius: '50%', background: '#3b82f6'}} />
              <span style={{fontSize: 14}}>En Route</span>
            </div>
          </div>
        </div>

        <div style={{
          padding: 16,
          background: '#f9fafb',
          borderRadius: 4,
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{margin: '0 0 12px 0'}}>📊 Statistics</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{fontSize: 14}}>Total Trucks:</span>
              <span style={{fontSize: 14, fontWeight: 'bold'}}>{trucks.length}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{fontSize: 14}}>Active Incidents:</span>
              <span style={{fontSize: 14, fontWeight: 'bold'}}>{incidents.length}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{fontSize: 14}}>Available Trucks:</span>
              <span style={{fontSize: 14, fontWeight: 'bold'}}>
                {trucks.filter(t => t.status === 'available').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Feature Notice */}
      <div style={{
        padding: 16,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 8,
        color: 'white'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h4 style={{margin: '0 0 8px 0'}}>🗺️ Premium Feature: Interactive Dispatch Maps</h4>
            <p style={{margin: 0, opacity: 0.9}}>
              Real-time map visualization with truck tracking, incident management, and route optimization
            </p>
          </div>
          <button style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '8px 16px',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 4,
            cursor: 'pointer'
          }}>
            Upgrade to Professional
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
    </div>
  )
}
