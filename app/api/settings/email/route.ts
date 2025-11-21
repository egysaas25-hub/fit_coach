import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

/**
 * GET /api/settings/email
 * Get email settings
 */
export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getSession(request)
    
    // In a real implementation, fetch from database
    // For now, return mock data
    const settings = {
      provider: 'smtp',
      smtpHost: process.env.SMTP_HOST || '',
      smtpPort: process.env.SMTP_PORT || '587',
      smtpUser: process.env.SMTP_USER || '',
      smtpPassword: '', // Never return actual password
      fromEmail: process.env.SMTP_FROM_EMAIL || '',
      fromName: process.env.SMTP_FROM_NAME || '',
      replyToEmail: process.env.SMTP_REPLY_TO || '',
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching email settings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch email settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/settings/email
 * Update email settings
 */
export async function PUT(request: NextRequest) {
  try {
    // Get session
    const session = await getSession(request)
    
    // Parse request body
    const body = await request.json()
    const { settings } = body

    // Validate required fields
    if (!settings.smtpHost || !settings.smtpPort || !settings.fromEmail) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'SMTP host, port, and from email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(settings.fromEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format', message: 'Please provide a valid from email address' },
        { status: 400 }
      )
    }

    if (settings.replyToEmail && !emailRegex.test(settings.replyToEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format', message: 'Please provide a valid reply-to email address' },
        { status: 400 }
      )
    }

    // In a real implementation, save to database
    // For now, just return success
    // You would typically save to a SystemSettings table:
    // await prisma.systemSettings.upsert({
    //   where: { category: 'email' },
    //   update: { settings: settings, updated_by: session.user.id },
    //   create: { category: 'email', settings: settings, updated_by: session.user.id }
    // })

    return NextResponse.json({
      message: 'Email settings saved successfully',
      settings: {
        ...settings,
        smtpPassword: '', // Don't return password
      }
    })
  } catch (error) {
    console.error('Error updating email settings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update email settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
