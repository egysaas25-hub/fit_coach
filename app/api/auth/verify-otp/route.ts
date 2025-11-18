import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth'
import { localDatabase } from '@/lib/db/local'
import { z } from 'zod'

// Validation schema
const verifyOTPSchema = z.object({
  phone: z.string().regex(/^\+[0-9]{1,3}[0-9]{6,14}$/, 'Invalid phone number format'),
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const { phone, code } = verifyOTPSchema.parse(body)

    // Verify OTP and get JWT token
    const token = await authService.verifyOTP(phone, code)

    // Decode token to get user info
    const payload = await authService.verifyJWT(token)

    // Get full user details from local database
    const user = localDatabase.findUserByPhone(phone)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant: {
          id: user.tenant_id,
          name: 'Demo Tenant',
          slug: 'demo-tenant',
        },
      },
      token,
      tenant_id: user.tenant_id,
    })

    // Set HttpOnly cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('❌ Error verifying OTP:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
