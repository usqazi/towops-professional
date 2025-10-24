import { NextRequest, NextResponse } from 'next/server'

// Mock user database (in production, use a real database)
let users: Array<{
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
  }
]

// Simple authentication for demo purposes

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, company, phone } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Simple password storage (in production, use proper hashing)
    const hashedPassword = password // In production, hash this

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      password: hashedPassword,
      name,
      role: role || 'customer',
      company,
      phone,
      createdAt: new Date().toISOString(),
      isActive: true
    }

    users.push(newUser)

    // Create simple token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })).toString('base64')

    // Return user data (without password)
    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      company: newUser.company,
      phone: newUser.phone,
      createdAt: newUser.createdAt
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
