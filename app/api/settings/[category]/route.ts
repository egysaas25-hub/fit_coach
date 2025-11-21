import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'

// Simple in-memory cache for settings
const settingsCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * GET /api/settings/[category]
 * Fetch settings by category from database
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    // Get session
    const session = await getSession(request)
    const tenantId = session.user.tenant_id
    const category = params.category

    // Validate category
    const validCategories = ['email', 'branding', 'notifications', 'general', 'whatsapp']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category', message: `Category must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // Check cache first
    const cacheKey = `${tenantId}:${category}`
    const cached = settingsCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ settings: cached.data, cached: true })
    }

    // Fetch from database
    const settingsRecord = await prisma.system_settings.findUnique({
      where: {
        unique_tenant_category: {
          tenant_id: tenantId,
          category: category,
        },
      },
      select: {
        id: true,
        category: true,
        settings: true,
        updated_at: true,
      },
    })

    // If no settings found, return default empty settings
    if (!settingsRecord) {
      const defaultSettings = getDefaultSettings(category)
      return NextResponse.json({ 
        settings: defaultSettings,
        isDefault: true 
      })
    }

    // Cache the result
    settingsCache.set(cacheKey, {
      data: settingsRecord.settings,
      timestamp: Date.now(),
    })

    // Convert BigInt to string for JSON serialization
    const serializedSettings = {
      id: settingsRecord.id.toString(),
      category: settingsRecord.category,
      settings: settingsRecord.settings,
      updated_at: settingsRecord.updated_at.toISOString(),
    }

    return NextResponse.json({ 
      settings: serializedSettings.settings,
      updated_at: serializedSettings.updated_at 
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/settings/[category]
 * Validate and save settings to database
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    // Get session
    const session = await getSession(request)
    const tenantId = session.user.tenant_id
    const userId = session.user.id
    const category = params.category

    // Validate category
    const validCategories = ['email', 'branding', 'notifications', 'general', 'whatsapp']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category', message: `Category must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings format', message: 'Settings must be an object' },
        { status: 400 }
      )
    }

    // Validate settings based on category
    const validationError = validateSettings(category, settings)
    if (validationError) {
      return NextResponse.json(
        { error: 'Validation failed', message: validationError },
        { status: 400 }
      )
    }

    // Upsert settings in database
    const updatedSettings = await prisma.system_settings.upsert({
      where: {
        unique_tenant_category: {
          tenant_id: tenantId,
          category: category,
        },
      },
      update: {
        settings: settings,
        updated_by: userId,
        updated_at: new Date(),
      },
      create: {
        tenant_id: tenantId,
        category: category,
        settings: settings,
        updated_by: userId,
      },
      select: {
        id: true,
        category: true,
        settings: true,
        updated_at: true,
      },
    })

    // Invalidate cache
    const cacheKey = `${tenantId}:${category}`
    settingsCache.delete(cacheKey)

    // Convert BigInt to string for JSON serialization
    const serializedSettings = {
      id: updatedSettings.id.toString(),
      category: updatedSettings.category,
      settings: updatedSettings.settings,
      updated_at: updatedSettings.updated_at.toISOString(),
    }

    return NextResponse.json({
      message: `${category} settings saved successfully`,
      settings: serializedSettings.settings,
      updated_at: serializedSettings.updated_at,
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Get default settings for a category
 */
function getDefaultSettings(category: string): any {
  switch (category) {
    case 'email':
      return {
        provider: 'smtp',
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        fromEmail: '',
        fromName: '',
        replyToEmail: '',
      }
    case 'branding':
      return {
        logoUrl: '',
        faviconUrl: '',
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        accentColor: '#10b981',
        companyName: 'FitCoach',
        tagline: 'Transform Your Fitness Journey',
      }
    case 'notifications':
      return {
        newClientRegistration: { email: true, whatsapp: true, push: true },
        clientMilestoneAchieved: { email: true, whatsapp: false, push: true },
        clientMissedWorkout: { email: true, whatsapp: true, push: false },
        clientProgressUpdate: { email: true, whatsapp: false, push: true },
        appointmentBooked: { email: true, whatsapp: true, push: true },
        appointmentCancelled: { email: true, whatsapp: true, push: true },
        appointmentReminder: { email: true, whatsapp: true, push: false },
        paymentReceived: { email: true, whatsapp: false, push: true },
        paymentFailed: { email: true, whatsapp: true, push: true },
        subscriptionExpiring: { email: true, whatsapp: true, push: true },
        newTeamMemberAdded: { email: true, whatsapp: false, push: false },
        teamMemberAssigned: { email: true, whatsapp: false, push: true },
        systemAlerts: { email: true, whatsapp: false, push: true },
        weeklyReport: { email: true, whatsapp: false, push: false },
        monthlyReport: { email: true, whatsapp: false, push: false },
      }
    case 'general':
      return {
        siteName: 'FitCoach',
        timezone: 'Africa/Cairo',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
      }
    case 'whatsapp':
      return {
        phoneNumber: '',
        apiKey: '',
        webhookUrl: '',
        enabled: false,
      }
    default:
      return {}
  }
}

/**
 * Validate settings based on category
 */
function validateSettings(category: string, settings: any): string | null {
  switch (category) {
    case 'email':
      if (!settings.smtpHost || !settings.smtpPort || !settings.fromEmail) {
        return 'SMTP host, port, and from email are required'
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(settings.fromEmail)) {
        return 'Invalid from email format'
      }
      if (settings.replyToEmail && !emailRegex.test(settings.replyToEmail)) {
        return 'Invalid reply-to email format'
      }
      break

    case 'branding':
      if (!settings.companyName) {
        return 'Company name is required'
      }
      const colorRegex = /^#[0-9A-F]{6}$/i
      if (settings.primaryColor && !colorRegex.test(settings.primaryColor)) {
        return 'Invalid primary color format (must be hex code like #3b82f6)'
      }
      if (settings.secondaryColor && !colorRegex.test(settings.secondaryColor)) {
        return 'Invalid secondary color format (must be hex code like #8b5cf6)'
      }
      if (settings.accentColor && !colorRegex.test(settings.accentColor)) {
        return 'Invalid accent color format (must be hex code like #10b981)'
      }
      break

    case 'notifications':
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
          return `Missing notification setting: ${event}`
        }
        const channels = settings[event]
        if (
          typeof channels.email !== 'boolean' ||
          typeof channels.whatsapp !== 'boolean' ||
          typeof channels.push !== 'boolean'
        ) {
          return `Invalid channel settings for: ${event}`
        }
      }
      break

    case 'general':
      if (!settings.siteName) {
        return 'Site name is required'
      }
      break

    case 'whatsapp':
      if (settings.enabled && !settings.phoneNumber) {
        return 'Phone number is required when WhatsApp is enabled'
      }
      break
  }

  return null
}
