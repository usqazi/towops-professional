import { NextRequest, NextResponse } from 'next/server'

// Mock user database (in production, use a real database)
const users: Array<{
  id: string
  email: string
  password: string
  name: string
  role: 'admin' | 'dispatcher' | 'driver' | 'customer'
  company?: string
  phone?: string
  createdAt: string
  isActive: boolean
}> = [
  {
    id: '1',
    email: 'admin@towops.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Admin User',
    role: 'admin',
    company: 'TowOps',
    phone: '+1-555-0123',
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: '2',
    email: 'dispatcher@towops.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'John Dispatcher',
    role: 'dispatcher',
    company: 'TowOps',
    phone: '+1-555-0124',
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: '3',
    email: 'driver@towops.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Mike Driver',
    role: 'driver',
    company: 'TowOps',
    phone: '+1-555-0125',
    createdAt: new Date().toISOString(),
    isActive: true
  }
]

// Simple authentication for demo purposes

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = users.find(u => u.email === email && u.isActive)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Simple password verification (in production, use proper hashing)
    if (password !== 'password') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create simple token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })).toString('base64')

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
      phone: user.phone,
      createdAt: user.createdAt
    }

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: userData,
      token
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
