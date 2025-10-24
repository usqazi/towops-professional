import { NextRequest, NextResponse } from 'next/server'
import { 
  drivers, 
  dispatchQueue, 
  updateDriverStatus, 
  findBestDriver,
  addNotification 
} from '../../../lib/dispatch-store'

export async function POST(request: NextRequest) {
  try {
    const { requestId, driverId, action } = await request.json()

    if (!requestId || !driverId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const dispatchRequest = dispatchQueue.find(req => req.id === requestId)
    if (!dispatchRequest) {
      return NextResponse.json(
        { error: 'Dispatch request not found' },
        { status: 404 }
      )
    }

    const driver = drivers.find(d => d.id === driverId)
    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      )
    }

    if (action === 'accept') {
      // Driver accepts the request
      dispatchRequest.status = 'accepted'
      dispatchRequest.acceptedAt = Date.now()
      
      // Update driver status
      updateDriverStatus(driverId, 'busy')

      return NextResponse.json({
        success: true,
        message: 'Request accepted successfully',
        dispatchRequest,
        driver: {
          id: driver.id,
          name: driver.name,
          phone: driver.phone,
          rating: driver.rating
        }
      })

    } else if (action === 'reject') {
      // Driver rejects the request
      dispatchRequest.status = 'rejected'
      dispatchRequest.rejectedAt = Date.now()
      dispatchRequest.assignedDriver = undefined

      // Find next best driver
      const nextDriver = findBestDriver(dispatchRequest)

      if (nextDriver) {
        // Assign to next best driver
        dispatchRequest.assignedDriver = nextDriver.id
        dispatchRequest.status = 'assigned'
        dispatchRequest.assignedAt = Date.now()

        // Update driver status
        updateDriverStatus(nextDriver.id, 'busy')

        // Send notification to new driver
        addNotification({
          driverId: nextDriver.id,
          type: 'dispatch_request',
          title: 'New Dispatch Request',
          message: `${dispatchRequest.priority.toUpperCase()} priority request from ${dispatchRequest.customerName}`,
          data: dispatchRequest,
          priority: dispatchRequest.priority
        })

        return NextResponse.json({
          success: true,
          message: 'Request reassigned to another driver',
          dispatchRequest,
          reassignedDriver: {
            id: nextDriver.id,
            name: nextDriver.name,
            phone: nextDriver.phone,
            rating: nextDriver.rating
          }
        })
      } else {
        // No more drivers available
        dispatchRequest.status = 'pending'
        dispatchRequest.assignedDriver = undefined

        return NextResponse.json({
          success: false,
          message: 'No other drivers available. Request added back to queue.',
          dispatchRequest
        })
      }

    } else if (action === 'complete') {
      // Driver completes the request
      dispatchRequest.status = 'completed'
      dispatchRequest.completedAt = Date.now()

      // Update driver status back to available
      updateDriverStatus(driverId, 'available')
      
      // Update driver job count
      const driverIndex = drivers.findIndex(d => d.id === driverId)
      if (driverIndex !== -1) {
        drivers[driverIndex].totalJobs += 1
      }

      return NextResponse.json({
        success: true,
        message: 'Request completed successfully',
        dispatchRequest,
        driver: {
          id: driver.id,
          name: driver.name,
          totalJobs: driver.totalJobs
        }
      })

    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Driver response error:', error)
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

    if (driverId) {
      // Get driver's current requests
      const driverRequests = dispatchQueue.filter(req => 
        req.assignedDriver === driverId && 
        ['assigned', 'accepted'].includes(req.status)
      )

      return NextResponse.json({
        success: true,
        requests: driverRequests,
        driver: drivers.find(d => d.id === driverId)
      })
    }

    // Get all driver responses
    return NextResponse.json({
      success: true,
      drivers: drivers.map(driver => ({
        id: driver.id,
        name: driver.name,
        status: driver.status,
        rating: driver.rating,
        location: driver.location,
        vehicleType: driver.vehicleType,
        totalJobs: driver.totalJobs,
        lastActive: driver.lastActive
      }))
    })

  } catch (error) {
    console.error('Get driver responses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
