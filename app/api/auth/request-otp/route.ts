import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth'
import { z } from 'zod'

// Validation schema
const requestOTPSchema = z.object({
  phone: z.string().regex(/^\+[0-9]{1,3}[0-9]{6,14}$/, 'Invalid phone number format (E.164 required)'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const { phone } = requestOTPSchema.parse(body)

    // Get IP address for rate limiting
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Request OTP via AuthService
    await authService.requestOTP(phone, ipAddress)

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully via WhatsApp',
      sent: true,
      medium: 'whatsapp',
    })
  } catch (error) {
    console.error('Error sending OTP:', error)

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
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
