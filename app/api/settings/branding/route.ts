import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

/**
 * GET /api/settings/branding
 * Get branding settings
 */
export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getSession(request)
    
    // In a real implementation, fetch from database
    // For now, return mock data
    const settings = {
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      accentColor: '#10b981',
      companyName: 'FitCoach',
      tagline: 'Transform Your Fitness Journey',
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching branding settings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch branding settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/settings/branding
 * Update branding settings
 */
export async function PUT(request: NextRequest) {
  try {
    // Get session
    const session = await getSession(request)
    
    // Parse request body
    const body = await request.json()
    const { settings } = body

    // Validate required fields
    if (!settings.companyName) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      )
    }

    // Validate color formats
    const colorRegex = /^#[0-9A-F]{6}$/i
    if (!colorRegex.test(settings.primaryColor) || 
        !colorRegex.test(settings.secondaryColor) || 
        !colorRegex.test(settings.accentColor)) {
      return NextResponse.json(
        { error: 'Invalid color format', message: 'Colors must be valid hex codes (e.g., #3b82f6)' },
        { status: 400 }
      )
    }

    // In a real implementation, save to database
    // await prisma.systemSettings.upsert({
    //   where: { category: 'branding' },
    //   update: { settings: settings, updated_by: session.user.id },
    //   create: { category: 'branding', settings: settings, updated_by: session.user.id }
    // })

    return NextResponse.json({
      message: 'Branding settings saved successfully',
      settings
    })
  } catch (error) {
    console.error('Error updating branding settings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update branding settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
