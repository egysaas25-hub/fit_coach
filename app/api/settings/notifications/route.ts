import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

/**
 * GET /api/settings/notifications
 * Get notification settings
 */
export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getSession(request)
    
    // In a real implementation, fetch from database
    // For now, return default settings
    const settings = {
      // Client Events
      newClientRegistration: { email: true, whatsapp: true, push: true },
      clientMilestoneAchieved: { email: true, whatsapp: false, push: true },
      clientMissedWorkout: { email: true, whatsapp: true, push: false },
      clientProgressUpdate: { email: true, whatsapp: false, push: true },
      
      // Appointment Events
      appointmentBooked: { email: true, whatsapp: true, push: true },
      appointmentCancelled: { email: true, whatsapp: true, push: true },
      appointmentReminder: { email: true, whatsapp: true, push: false },
      
      // Payment Events
      paymentReceived: { email: true, whatsapp: false, push: true },
      paymentFailed: { email: true, whatsapp: true, push: true },
      subscriptionExpiring: { email: true, whatsapp: true, push: true },
      
      // Team Events
      newTeamMemberAdded: { email: true, whatsapp: false, push: false },
      teamMemberAssigned: { email: true, whatsapp: false, push: true },
      
      // System Events
      systemAlerts: { email: true, whatsapp: false, push: true },
      weeklyReport: { email: true, whatsapp: false, push: false },
      monthlyReport: { email: true, whatsapp: false, push: false },
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch notification settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/settings/notifications
 * Update notification settings
 */
export async function PUT(request: NextRequest) {
  try {
    // Get session
    const session = await getSession(request)
    
    // Parse request body
    const body = await request.json()
    const { settings } = body

    // Validate settings structure
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings format' },
        { status: 400 }
      )
    }

    // Validate each notification setting has the correct structure
    const requiredEvents = [
      'newClientRegistration',
      'clientMilestoneAchieved',
      'clientMissedWorkout',
      'clientProgressUpdate',
      'appointmentBooked',
      'appointmentCancelled',
      'appointmentReminder',
      'paymentReceived',
      'paymentFailed',
      'subscriptionExpiring',
      'newTeamMemberAdded',
      'teamMemberAssigned',
      'systemAlerts',
      'weeklyReport',
      'monthlyReport',
    ]

    for (const event of requiredEvents) {
      if (!settings[event]) {
        return NextResponse.json(
          { error: `Missing notification setting: ${event}` },
          { status: 400 }
        )
      }

      const channels = settings[event]
      if (typeof channels.email !== 'boolean' || 
          typeof channels.whatsapp !== 'boolean' || 
          typeof channels.push !== 'boolean') {
        return NextResponse.json(
          { error: `Invalid channel settings for: ${event}` },
          { status: 400 }
        )
      }
    }

    // In a real implementation, save to database
    // await prisma.systemSettings.upsert({
    //   where: { category: 'notifications' },
    //   update: { settings: settings, updated_by: session.user.id },
    //   create: { category: 'notifications', settings: settings, updated_by: session.user.id }
    // })

    return NextResponse.json({
      message: 'Notification settings saved successfully',
      settings
    })
  } catch (error) {
    console.error('Error updating notification settings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update notification settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
