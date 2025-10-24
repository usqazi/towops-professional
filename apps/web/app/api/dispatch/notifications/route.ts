import { NextRequest, NextResponse } from 'next/server'
import { 
  notifications, 
  connectedDrivers, 
  addNotification, 
  markNotificationAsRead 
} from '../../../lib/dispatch-store'

export async function POST(request: NextRequest) {
  try {
    const { driverId, action, data } = await request.json()

    if (action === 'connect') {
      // Driver connects for real-time updates
      connectedDrivers.add(driverId)
      
      return NextResponse.json({
        success: true,
        message: 'Connected to real-time updates',
        driverId
      })

    } else if (action === 'disconnect') {
      // Driver disconnects
      connectedDrivers.delete(driverId)
      
      return NextResponse.json({
        success: true,
        message: 'Disconnected from real-time updates',
        driverId
      })

    } else if (action === 'send_notification') {
      // Send notification to specific driver
      const { targetDriverId, type, title, message, data: notificationData } = data

      const notification = addNotification({
        driverId: targetDriverId,
        type,
        title,
        message,
        data: notificationData,
        priority: data.priority || 'normal'
      })

      return NextResponse.json({
        success: true,
        message: 'Notification sent',
        notification
      })

    } else if (action === 'mark_read') {
      // Mark notification as read
      const { notificationId } = data
      markNotificationAsRead(notificationId)

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read'
      })

    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Notification error:', error)
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
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    if (driverId) {
      // Get notifications for specific driver
      let driverNotifications = notifications.filter(n => n.driverId === driverId)
      
      if (unreadOnly) {
        driverNotifications = driverNotifications.filter(n => !n.read)
      }

      // Sort by timestamp (newest first)
      driverNotifications.sort((a, b) => b.timestamp - a.timestamp)

      return NextResponse.json({
        success: true,
        notifications: driverNotifications,
        unreadCount: notifications.filter(n => n.driverId === driverId && !n.read).length
      })
    }

    // Get all notifications
    return NextResponse.json({
      success: true,
      notifications: notifications.sort((a, b) => b.timestamp - a.timestamp),
      connectedDrivers: Array.from(connectedDrivers),
      totalNotifications: notifications.length
    })

  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Server-Sent Events endpoint for real-time updates
export async function GET_SSE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const driverId = searchParams.get('driverId')

    if (!driverId) {
      return NextResponse.json(
        { error: 'Driver ID required' },
        { status: 400 }
      )
    }

    // Set up SSE headers
    const headers = new Headers({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    })

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const data = JSON.stringify({
          type: 'connected',
          message: 'Connected to real-time updates',
          timestamp: Date.now()
        })
        
        controller.enqueue(`data: ${data}\n\n`)

        // Keep connection alive with periodic pings
        const pingInterval = setInterval(() => {
          try {
            const pingData = JSON.stringify({
              type: 'ping',
              timestamp: Date.now()
            })
            controller.enqueue(`data: ${pingData}\n\n`)
          } catch (error) {
            clearInterval(pingInterval)
            controller.close()
          }
        }, 30000) // Ping every 30 seconds

        // Clean up on close
        request.signal.addEventListener('abort', () => {
          clearInterval(pingInterval)
          connectedDrivers.delete(driverId)
          controller.close()
        })
      }
    })

    return new Response(stream, { headers })

  } catch (error) {
    console.error('SSE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
