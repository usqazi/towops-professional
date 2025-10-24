import { NextRequest, NextResponse } from 'next/server'
import { 
  drivers, 
  dispatchQueue, 
  findBestDriver, 
  updateDriverStatus, 
  addNotification,
  calculateDistance 
} from '../../../lib/dispatch-store'

export async function POST(request: NextRequest) {
  try {
    const { customerId, customerName, customerPhone, location, destination, priority, vehicleType, description } = await request.json()

    if (!customerId || !location || !vehicleType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create dispatch request
    const dispatchRequest: DispatchRequest = {
      id: `dispatch-${Date.now()}`,
      customerId,
      customerName: customerName || 'Unknown Customer',
      customerPhone: customerPhone || 'N/A',
      location,
      destination,
      priority: priority || 'medium',
      vehicleType,
      description: description || 'Tow service requested',
      estimatedDuration: 60, // Default 60 minutes
      createdAt: Date.now(),
      status: 'pending',
      expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes to accept
    }

    // Find best driver using Uber-style algorithm
    const bestDriver = findBestDriver(dispatchRequest)

    if (bestDriver) {
      // Assign to best driver
      dispatchRequest.assignedDriver = bestDriver.id
      dispatchRequest.status = 'assigned'
      
      // Update driver status
      updateDriverStatus(bestDriver.id, 'busy')

      dispatchQueue.push(dispatchRequest)

      // Send notification to driver
      addNotification({
        driverId: bestDriver.id,
        type: 'dispatch_request',
        title: 'New Dispatch Request',
        message: `${dispatchRequest.priority.toUpperCase()} priority request from ${dispatchRequest.customerName}`,
        data: dispatchRequest,
        priority: dispatchRequest.priority
      })

      return NextResponse.json({
        success: true,
        dispatchRequest,
        assignedDriver: {
          id: bestDriver.id,
          name: bestDriver.name,
          phone: bestDriver.phone,
          rating: bestDriver.rating,
          estimatedArrival: Math.round(calculateDistance(
            bestDriver.location.lat, bestDriver.location.lng,
            location.lat, location.lng
          ) * 2)
        },
        message: 'Driver assigned successfully'
      })
    } else {
      // No available drivers, add to queue
      dispatchQueue.push(dispatchRequest)

      return NextResponse.json({
        success: false,
        dispatchRequest,
        message: 'No drivers available. Added to queue.',
        estimatedWaitTime: 15 // minutes
      })
    }

  } catch (error) {
    console.error('Dispatch request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const driverId = searchParams.get('driverId')
    const status = searchParams.get('status')

    if (driverId) {
      // Get requests for specific driver
      const driverRequests = dispatchQueue.filter(req => req.assignedDriver === driverId)
      return NextResponse.json({
        success: true,
        requests: driverRequests
      })
    }

    if (status) {
      // Get requests by status
      const filteredRequests = dispatchQueue.filter(req => req.status === status)
      return NextResponse.json({
        success: true,
        requests: filteredRequests
      })
    }

    // Get all requests
    return NextResponse.json({
      success: true,
      requests: dispatchQueue,
      drivers: drivers.map(driver => ({
        id: driver.id,
        name: driver.name,
        status: driver.status,
        rating: driver.rating,
        location: driver.location,
        vehicleType: driver.vehicleType,
        lastActive: driver.lastActive
      }))
    })

  } catch (error) {
    console.error('Get dispatch requests error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
