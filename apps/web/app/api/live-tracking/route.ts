import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { incidentId, truckId, status } = await request.json()
    
    // Simulate real-time incident tracking
    const trackingData = {
      incident_id: incidentId,
      truck_id: truckId,
      status: status,
      timestamp: new Date().toISOString(),
      location: {
        lat: 32.7157 + (Math.random() - 0.5) * 0.01,
        lng: -117.1611 + (Math.random() - 0.5) * 0.01
      },
      progress: Math.floor(Math.random() * 100),
      estimated_arrival: `${Math.floor(Math.random() * 15) + 5} min`,
      speed: Math.floor(Math.random() * 30) + 25, // mph
      distance_remaining: `${Math.floor(Math.random() * 5) + 1} miles`
    }

    // In production, this would:
    // 1. Connect to FastAPI backend
    // 2. Get real GPS coordinates
    // 3. Calculate actual ETA
    // 4. Update database
    // 5. Send real-time updates via WebSocket

    return NextResponse.json({
      success: true,
      tracking: trackingData,
      message: 'Live tracking updated'
    })

  } catch (error) {
    console.error('Live tracking error:', error)
    return NextResponse.json({ 
      error: 'Failed to update tracking' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const incidentId = searchParams.get('incident_id')
    
    if (!incidentId) {
      return NextResponse.json({ 
        error: 'Incident ID required' 
      }, { status: 400 })
    }

    // Simulate getting live tracking data
    const liveData = {
      incident_id: incidentId,
      truck_id: 'TRUCK-001',
      status: 'enroute',
      current_location: {
        lat: 32.7200,
        lng: -117.1600
      },
      destination: {
        lat: 32.7157,
        lng: -117.1611
      },
      progress: 65,
      estimated_arrival: '8 min',
      speed: 35,
      distance_remaining: '2.3 miles',
      route: [
        { lat: 32.7200, lng: -117.1600 },
        { lat: 32.7185, lng: -117.1605 },
        { lat: 32.7170, lng: -117.1610 },
        { lat: 32.7157, lng: -117.1611 }
      ],
      last_updated: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: liveData
    })

  } catch (error) {
    console.error('Get tracking error:', error)
    return NextResponse.json({ 
      error: 'Failed to get tracking data' 
    }, { status: 500 })
  }
}
