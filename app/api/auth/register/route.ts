import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth'
import { prisma } from '@/lib/prisma'
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

    // Verify OTP using Prisma database
    let isValidOTP = false
    
    if (process.env.NODE_ENV === 'development' && code === '123456') {
      console.log(`🔓 Registration: accepting test code for ${phone}`)
      isValidOTP = true
    } else {
      // Use the auth service to verify OTP (it handles the database lookup)
      try {
        await authService.verifyOTP(phone, code)
        isValidOTP = true
      } catch (error) {
        isValidOTP = false
      }
    }

    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP code. Please try again.' },
        { status: 401 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.team_members.findFirst({
      where: { email: email || `${phone}@temp.com` },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email.' },
        { status: 409 }
      )
    }

    // Create or get tenant
    let tenant = await prisma.tenants.findFirst({
      where: { slug: workspaceName.toLowerCase().replace(/\s+/g, '-') },
    })

    if (!tenant) {
      tenant = await prisma.tenants.create({
        data: {
          name: workspaceName,
          slug: workspaceName.toLowerCase().replace(/\s+/g, '-'),
          country: 'US', // Default country
          timezone: 'America/New_York', // Default timezone
        },
      })
    }

    // Create new team member
    const newUser = await prisma.team_members.create({
      data: {
        tenant_id: tenant.id,
        full_name: name,
        email: email || `${phone}@temp.com`,
        role: 'admin', // New registrations get admin role
        active: true,
      },
    })

    // Generate JWT token
    const token = await authService.signJWT({
      user_id: Number(newUser.id),
      tenant_id: Number(tenant.id),
      role: newUser.role,
      email: newUser.email,
    })

    console.log(`✅ New user registered: ${name} (${phone})`)

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id.toString(),
        name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        tenant: {
          id: tenant.id.toString(),
          name: tenant.name,
          slug: tenant.slug,
        },
      },
      token,
      tenant_id: tenant.id.toString(),
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