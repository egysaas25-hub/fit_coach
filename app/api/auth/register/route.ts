import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth'
import { localDatabase } from '@/lib/db/local'
import { z } from 'zod'

// Validation schema
const registerSchema = z.object({
  phone: z.string().regex(/^\+[0-9]{1,3}[0-9]{6,14}$/, 'Invalid phone number format (E.164 required)'),
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format').optional(),
  workspaceName: z.string().min(2, 'Workspace name must be at least 2 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const { phone, code, name, email, workspaceName } = registerSchema.parse(body)

    // Verify OTP first - use development mode for testing
    let isValidOTP = false
    
    if (process.env.NODE_ENV === 'development' && code === '123456') {
      console.log(`🔓 Registration: accepting test code for ${phone}`)
      isValidOTP = true
    } else {
      isValidOTP = await localDatabase.verifyOTP(phone, code)
    }

    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP code. Please try again.' },
        { status: 401 }
      )
    }

    // Check if user already exists
    const existingUser = localDatabase.findUserByPhone(phone)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this phone number.' },
        { status: 409 }
      )
    }

    // Create new user in local database
    const newUserId = `550e8400-e29b-41d4-a716-${Date.now()}`
    const tenantId = '550e8400-e29b-41d4-a716-446655440000' // Demo tenant

    const newUser = {
      id: newUserId,
      tenant_id: tenantId,
      name: name,
      email: email || `${phone}@temp.com`,
      phone: phone,
      role: 'admin', // New registrations get admin role
      is_active: true
    }

    // Add to local database
    localDatabase.addUser(newUser)

    // Generate JWT token
    const token = await authService.signJWT({
      user_id: parseInt(newUserId.split('-').pop() || '0'),
      tenant_id: parseInt(tenantId.split('-').pop() || '0'),
      role: newUser.role,
      email: newUser.email,
    })

    console.log(`✅ New user registered: ${name} (${phone})`)

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        tenant: {
          id: tenantId,
          name: workspaceName,
          slug: workspaceName.toLowerCase().replace(/\s+/g, '-'),
        },
      },
      token,
      tenant_id: tenantId,
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
    console.error('Error registering user:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}