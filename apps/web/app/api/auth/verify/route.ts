import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      )
    }

    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
      
      // Check if token is expired
      if (decoded.exp && Date.now() > decoded.exp) {
        return NextResponse.json(
          { error: 'Token expired' },
          { status: 401 }
        )
      }
      
      return NextResponse.json({
        success: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role
        }
      })
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
