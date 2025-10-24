'use client'
import { useState, useEffect, useRef } from 'react'

interface GPSTrackerProps {
  incidents: any[]
  onIncidentSelect?: (incident: any) => void
  selectedIncident?: any
  height?: string
}

export default function GPSTracker({ 
  incidents, 
  onIncidentSelect, 
  selectedIncident,
  height = '400px'
}: GPSTrackerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<{[key: string]: any}>({})

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstance.current) {
      // Load Leaflet CSS and JS dynamically
      const loadLeaflet = async () => {
        if (!window.L) {
          // Load CSS
          const cssLink = document.createElement('link')
          cssLink.rel = 'stylesheet'
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(cssLink)

          // Load JS
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          script.onload = initializeMap
          document.head.appendChild(script)
        } else {
          initializeMap()
        }
      }

      const initializeMap = () => {
        if (!window.L) return

        // Initialize map centered on San Diego
        mapInstance.current = window.L.map(mapRef.current).setView([32.7157, -117.1611], 12)

        // Add OpenStreetMap tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance.current)

        console.log('🗺️ GPS Tracker map initialized')
      }

      loadLeaflet()
    }
  }, [])

  useEffect(() => {
    if (mapInstance.current && window.L && incidents.length > 0) {
      updateMapMarkers()
    }
  }, [incidents, selectedIncident])

  const updateMapMarkers = () => {
    if (!mapInstance.current || !window.L) return

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker: any) => {
      mapInstance.current.removeLayer(marker)
    })
    markersRef.current = {}

    incidents.forEach(incident => {
      const isSelected = selectedIncident?.call_id === incident.call_id
      
      // Create truck marker with real-time GPS indicator
      const truckIcon = window.L.divIcon({
        className: 'custom-truck-marker',
        html: `<div style="
          background: ${getStatusColor(incident.status)};
          color: white;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ${isSelected ? 'animation: pulse 2s infinite;' : ''}
          position: relative;
        ">
          🚛
          <div style="
            position: absolute;
            top: -5px;
            right: -5px;
            width: 12px;
            height: 12px;
            background: #10b981;
            border-radius: 50%;
            border: 2px solid white;
            animation: pulse 1s infinite;
          "></div>
        </div>`,
        iconSize: [35, 35],
        iconAnchor: [17, 17]
      })

      const truckMarker = window.L.marker(
        [incident.current_location.lat, incident.current_location.lng],
        { icon: truckIcon }
      ).addTo(mapInstance.current)

      // Create destination marker
      const destIcon = window.L.divIcon({
        className: 'custom-dest-marker',
        html: `<div style="
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">📍</div>`,
        iconSize: [25, 25],
        iconAnchor: [12, 12]
      })

      const destMarker = window.L.marker(
        [incident.destination.lat, incident.destination.lng],
        { icon: destIcon }
      ).addTo(mapInstance.current)

      // Create route line
      const routeLine = window.L.polyline([
        [incident.current_location.lat, incident.current_location.lng],
        [incident.destination.lat, incident.destination.lng]
      ], {
        color: getStatusColor(incident.status),
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 5'
      }).addTo(mapInstance.current)

      // Bind popup with real-time info
      truckMarker.bindPopup(`
        <div style="min-width: 220px;">
          <h4 style="margin: 0 0 8px 0; color: #1f2937;">${incident.call_id}</h4>
          <div style="display: flex; gap: 12px; margin-bottom: 8px;">
            <div>
              <p style="margin: 2px 0; font-size: 12px;"><strong>Truck:</strong> ${incident.unit_id}</p>
              <p style="margin: 2px 0; font-size: 12px;"><strong>Status:</strong> ${incident.status}</p>
            </div>
            <div>
              <p style="margin: 2px 0; font-size: 12px;"><strong>Progress:</strong> ${incident.progress}%</p>
              <p style="margin: 2px 0; font-size: 12px;"><strong>ETA:</strong> ${incident.estimated_arrival}</p>
            </div>
          </div>
          <div style="background: #f3f4f6; padding: 8px; border-radius: 4px; margin-top: 8px;">
            <p style="margin: 0; font-size: 11px; color: #6b7280;">
              📍 Live GPS: ${incident.current_location.lat.toFixed(6)}, ${incident.current_location.lng.toFixed(6)}
            </p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #6b7280;">
              🎯 Destination: ${incident.destination.lat.toFixed(6)}, ${incident.destination.lng.toFixed(6)}
            </p>
          </div>
        </div>
      `)

      // Store markers for cleanup
      markersRef.current[`truck-${incident.call_id}`] = truckMarker
      markersRef.current[`dest-${incident.call_id}`] = destMarker
      markersRef.current[`route-${incident.call_id}`] = routeLine

      // Add click handler
      truckMarker.on('click', () => {
        if (onIncidentSelect) {
          onIncidentSelect(incident)
        }
      })
    })

    // Fit map to show all markers
    if (incidents.length > 0) {
      const group = new window.L.featureGroup(Object.values(markersRef.current))
      mapInstance.current.fitBounds(group.getBounds().pad(0.1))
    }
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

  return (
    <div style={{ position: 'relative' }}>
      {/* Map Container */}
      <div
        ref={mapRef}
        style={{
          height,
          width: '100%',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      />

      {/* GPS Status Overlay */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(255,255,255,0.95)',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#1f2937',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#10b981',
          animation: 'pulse 2s infinite'
        }} />
        Live GPS Tracking
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(255,255,255,0.95)',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '11px',
        color: '#1f2937',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Legend:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '50%' }} />
            <span>En Route</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '50%' }} />
            <span>Assigned</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '50%' }} />
            <span>Arrived</span>
          </div>
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
