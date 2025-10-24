// Shared data store for dispatch system
// This ensures all API routes use the same data

interface Driver {
  id: string
  name: string
  phone: string
  email: string
  status: 'available' | 'busy' | 'offline'
  location: { lat: number; lng: number }
  rating: number
  totalJobs: number
  specialties: string[]
  vehicleType: string
  capacity: number
  lastActive: number
  priority: number
}

interface DispatchRequest {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  location: { lat: number; lng: number }
  destination?: { lat: number; lng: number }
  priority: 'low' | 'medium' | 'high' | 'emergency'
  vehicleType: string
  description: string
  estimatedDuration: number
  createdAt: number
  status: 'pending' | 'assigned' | 'accepted' | 'rejected' | 'completed'
  assignedDriver?: string
  expiresAt: number
  acceptedAt?: number
  rejectedAt?: number
  completedAt?: number
}

interface Notification {
  id: string
  driverId: string
  type: string
  title: string
  message: string
  data?: any
  timestamp: number
  read: boolean
  priority: string
  readAt?: number
}

// Shared data arrays
export let drivers: Driver[] = [
  {
    id: 'driver-1',
    name: 'Mike Johnson',
    phone: '+1-555-0101',
    email: 'mike@towops.com',
    status: 'available',
    location: { lat: 32.7157, lng: -117.1611 },
    rating: 4.8,
    totalJobs: 156,
    specialties: ['flatbed', 'heavy-duty'],
    vehicleType: 'flatbed',
    capacity: 10000,
    lastActive: Date.now(),
    priority: 95
  },
  {
    id: 'driver-2',
    name: 'Sarah Williams',
    phone: '+1-555-0102',
    email: 'sarah@towops.com',
    status: 'available',
    location: { lat: 32.7200, lng: -117.1600 },
    rating: 4.9,
    totalJobs: 203,
    specialties: ['light-duty', 'motorcycle'],
    vehicleType: 'light-duty',
    capacity: 5000,
    lastActive: Date.now(),
    priority: 98
  },
  {
    id: 'driver-3',
    name: 'Carlos Rodriguez',
    phone: '+1-555-0103',
    email: 'carlos@towops.com',
    status: 'busy',
    location: { lat: 32.7100, lng: -117.1700 },
    rating: 4.7,
    totalJobs: 89,
    specialties: ['heavy-duty', 'commercial'],
    vehicleType: 'heavy-duty',
    capacity: 15000,
    lastActive: Date.now() - 300000,
    priority: 92
  }
]

export let dispatchQueue: DispatchRequest[] = []
export let notifications: Notification[] = []
export let connectedDrivers: Set<string> = new Set()

// Utility functions
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export function findBestDriver(request: DispatchRequest): Driver | null {
  const availableDrivers = drivers.filter(driver => 
    driver.status === 'available' && 
    driver.vehicleType === request.vehicleType &&
    (Date.now() - driver.lastActive) < 300000 // Active within 5 minutes
  )

  if (availableDrivers.length === 0) {
    return null
  }

  // Score each driver based on multiple factors
  const scoredDrivers = availableDrivers.map(driver => {
    const distance = calculateDistance(
      driver.location.lat, driver.location.lng,
      request.location.lat, request.location.lng
    )

    // Uber-style scoring factors
    const distanceScore = Math.max(0, 100 - (distance * 10)) // Closer = higher score
    const ratingScore = driver.rating * 20 // Higher rating = higher score
    const priorityScore = driver.priority // Driver's priority level
    const experienceScore = Math.min(50, driver.totalJobs / 4) // More jobs = higher score
    const recencyScore = Math.max(0, 50 - ((Date.now() - driver.lastActive) / 60000)) // Recent activity

    // Priority multiplier based on request priority
    let priorityMultiplier = 1
    switch (request.priority) {
      case 'emergency': priorityMultiplier = 2.0; break
      case 'high': priorityMultiplier = 1.5; break
      case 'medium': priorityMultiplier = 1.2; break
      case 'low': priorityMultiplier = 1.0; break
    }

    const totalScore = (
      distanceScore * 0.3 +
      ratingScore * 0.25 +
      priorityScore * 0.2 +
      experienceScore * 0.15 +
      recencyScore * 0.1
    ) * priorityMultiplier

    return {
      driver,
      score: totalScore,
      distance,
      estimatedArrival: Math.round(distance * 2) // Rough estimate in minutes
    }
  })

  // Sort by score and return the best driver
  scoredDrivers.sort((a, b) => b.score - a.score)
  return scoredDrivers[0]?.driver || null
}

export function updateDriverStatus(driverId: string, status: 'available' | 'busy' | 'offline') {
  const driverIndex = drivers.findIndex(d => d.id === driverId)
  if (driverIndex !== -1) {
    drivers[driverIndex].status = status
    drivers[driverIndex].lastActive = Date.now()
  }
}

export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}`,
    timestamp: Date.now(),
    read: false
  }
  notifications.push(newNotification)
  return newNotification
}

export function markNotificationAsRead(notificationId: string) {
  const notification = notifications.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
    notification.readAt = Date.now()
  }
}

export function cleanupExpiredRequests() {
  const now = Date.now()
  dispatchQueue = dispatchQueue.filter(request => {
    // Remove expired requests that haven't been accepted
    if (request.status === 'assigned' && request.expiresAt < now) {
      // Reset driver status if request expired
      if (request.assignedDriver) {
        updateDriverStatus(request.assignedDriver, 'available')
      }
      return false
    }
    return true
  })
}

// Cleanup expired requests every minute
setInterval(cleanupExpiredRequests, 60000)
