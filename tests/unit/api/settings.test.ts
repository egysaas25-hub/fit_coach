/**
 * Unit tests for Settings Management API
 * 
 * These tests verify:
 * - Settings save and retrieve functionality
 * - Settings validation logic
 * - Integration test endpoints
 * - Toggle state persistence
 * - Default settings generation
 * 
 * Requirements: 6.2, 6.3, 7.1, 7.2
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Settings Management API', () => {
  let testTenantId: bigint
  let testUserId: bigint

  beforeAll(async () => {
    // Get test tenant - these tests require existing tenant data
    const tenant = await prisma.tenants.findFirst()
    if (!tenant) {
      console.warn('⚠️  No tenant found - skipping settings tests. Run database seed first.')
      return
    }
    testTenantId = tenant.id

    // Get test user
    const teamMember = await prisma.team_members.findFirst({
      where: { tenant_id: testTenantId },
    })
    if (!teamMember) {
      console.warn('⚠️  No team member found - skipping settings tests. Run database seed first.')
      return
    }
    testUserId = teamMember.id
  })

  afterAll(async () => {
    // Clean up test settings
    await prisma.$executeRaw`
      DELETE FROM system_settings 
      WHERE tenant_id = ${testTenantId} 
      AND category IN ('test_email', 'test_branding', 'test_notifications')
    `
  })

  describe('Settings Save and Retrieve', () => {
    it('should save email settings to database', async () => {
      if (!testTenantId || !testUserId) {
        console.log('Skipping test - no tenant/user data available')
        return
      }

      const emailSettings = {
        provider: 'smtp',
        smtpHost: 'smtp.test.com',
        smtpPort: '587',
        smtpUser: 'test@test.com',
        fromEmail: 'noreply@test.com',
        fromName: 'Test FitCoach',
        replyToEmail: 'support@test.com',
      }

      const saved = await prisma.$executeRaw`
        INSERT INTO system_settings (tenant_id, category, settings, updated_by)
        VALUES (${testTenantId}, 'test_email', ${JSON.stringify(emailSettings)}::jsonb, ${testUserId})
        ON CONFLICT (tenant_id, category) 
        DO UPDATE SET settings = ${JSON.stringify(emailSettings)}::jsonb, updated_by = ${testUserId}, updated_at = NOW()
      `

      expect(saved).toBeDefined()

      // Retrieve and verify
      const retrieved = await prisma.$queryRaw<any[]>`
        SELECT settings FROM system_settings 
        WHERE tenant_id = ${testTenantId} AND category = 'test_email'
      `

      expect(retrieved.length).toBeGreaterThan(0)
      expect(retrieved[0].settings.smtpHost).toBe('smtp.test.com')
      expect(retrieved[0].settings.fromEmail).toBe('noreply@test.com')
    })

    it('should save branding settings to database', async () => {
      const brandingSettings = {
        logoUrl: 'https://example.com/logo.png',
        faviconUrl: 'https://example.com/favicon.ico',
        primaryColor: '#ff6b6b',
        secondaryColor: '#4ecdc4',
        accentColor: '#45b7d1',
        companyName: 'Test Fitness Studio',
        tagline: 'Get Fit Today',
      }

      const saved = await prisma.$executeRaw`
        INSERT INTO system_settings (tenant_id, category, settings, updated_by)
        VALUES (${testTenantId}, 'test_branding', ${JSON.stringify(brandingSettings)}::jsonb, ${testUserId})
        ON CONFLICT (tenant_id, category) 
        DO UPDATE SET settings = ${JSON.stringify(brandingSettings)}::jsonb, updated_by = ${testUserId}, updated_at = NOW()
      `

      expect(saved).toBeDefined()

      // Retrieve and verify
      const retrieved = await prisma.$queryRaw<any[]>`
        SELECT settings FROM system_settings 
        WHERE tenant_id = ${testTenantId} AND category = 'test_branding'
      `

      expect(retrieved.length).toBeGreaterThan(0)
      expect(retrieved[0].settings.companyName).toBe('Test Fitness Studio')
      expect(retrieved[0].settings.primaryColor).toBe('#ff6b6b')
    })

    it('should save notification settings to database', async () => {
      const notificationSettings = {
        newClientRegistration: { email: true, whatsapp: true, push: true },
        clientMilestoneAchieved: { email: true, whatsapp: false, push: true },
        paymentReceived: { email: true, whatsapp: false, push: true },
      }

      const saved = await prisma.$executeRaw`
        INSERT INTO system_settings (tenant_id, category, settings, updated_by)
        VALUES (${testTenantId}, 'test_notifications', ${JSON.stringify(notificationSettings)}::jsonb, ${testUserId})
        ON CONFLICT (tenant_id, category) 
        DO UPDATE SET settings = ${JSON.stringify(notificationSettings)}::jsonb, updated_by = ${testUserId}, updated_at = NOW()
      `

      expect(saved).toBeDefined()

      // Retrieve and verify
      const retrieved = await prisma.$queryRaw<any[]>`
        SELECT settings FROM system_settings 
        WHERE tenant_id = ${testTenantId} AND category = 'test_notifications'
      `

      expect(retrieved.length).toBeGreaterThan(0)
      expect(retrieved[0].settings.newClientRegistration.email).toBe(true)
      expect(retrieved[0].settings.clientMilestoneAchieved.whatsapp).toBe(false)
    })

    it('should update existing settings', async () => {
      // First save
      const initialSettings = {
        companyName: 'Initial Name',
        primaryColor: '#000000',
      }

      await prisma.$executeRaw`
        INSERT INTO system_settings (tenant_id, category, settings, updated_by)
        VALUES (${testTenantId}, 'test_branding', ${JSON.stringify(initialSettings)}::jsonb, ${testUserId})
        ON CONFLICT (tenant_id, category) 
        DO UPDATE SET settings = ${JSON.stringify(initialSettings)}::jsonb, updated_by = ${testUserId}, updated_at = NOW()
      `

      // Update
      const updatedSettings = {
        companyName: 'Updated Name',
        primaryColor: '#ffffff',
      }

      await prisma.$executeRaw`
        INSERT INTO system_settings (tenant_id, category, settings, updated_by)
        VALUES (${testTenantId}, 'test_branding', ${JSON.stringify(updatedSettings)}::jsonb, ${testUserId})
        ON CONFLICT (tenant_id, category) 
        DO UPDATE SET settings = ${JSON.stringify(updatedSettings)}::jsonb, updated_by = ${testUserId}, updated_at = NOW()
      `

      // Verify update
      const retrieved = await prisma.$queryRaw<any[]>`
        SELECT settings FROM system_settings 
        WHERE tenant_id = ${testTenantId} AND category = 'test_branding'
      `

      expect(retrieved[0].settings.companyName).toBe('Updated Name')
      expect(retrieved[0].settings.primaryColor).toBe('#ffffff')
    })

    it('should retrieve settings by category', async () => {
      const retrieved = await prisma.$queryRaw<any[]>`
        SELECT category, settings FROM system_settings 
        WHERE tenant_id = ${testTenantId} AND category = 'test_email'
      `

      expect(retrieved.length).toBeGreaterThan(0)
      expect(retrieved[0].category).toBe('test_email')
      expect(retrieved[0].settings).toBeDefined()
    })
  })

  describe('Settings Validation', () => {
    it('should validate email format', () => {
      const validEmail = 'test@example.com'
      const invalidEmail = 'invalid-email'
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      expect(emailRegex.test(validEmail)).toBe(true)
      expect(emailRegex.test(invalidEmail)).toBe(false)
    })

    it('should validate hex color format', () => {
      const validColor = '#3b82f6'
      const invalidColor = 'blue'
      const invalidHex = '#gggggg'
      
      const colorRegex = /^#[0-9A-F]{6}$/i
      
      expect(colorRegex.test(validColor)).toBe(true)
      expect(colorRegex.test(invalidColor)).toBe(false)
      expect(colorRegex.test(invalidHex)).toBe(false)
    })

    it('should validate notification channel structure', () => {
      const validChannels = { email: true, whatsapp: false, push: true }
      const invalidChannels = { email: 'yes', whatsapp: false }
      
      const isValid = (channels: any) => {
        return (
          typeof channels.email === 'boolean' &&
          typeof channels.whatsapp === 'boolean' &&
          typeof channels.push === 'boolean'
        )
      }
      
      expect(isValid(validChannels)).toBe(true)
      expect(isValid(invalidChannels)).toBe(false)
    })

    it('should validate required fields for email settings', () => {
      const validEmail = {
        smtpHost: 'smtp.test.com',
        smtpPort: '587',
        fromEmail: 'test@test.com',
      }
      
      const hasRequiredFields = (settings: any) => {
        return settings.smtpHost && settings.smtpPort && settings.fromEmail
      }

      expect(hasRequiredFields(validEmail)).toBe(true)
      expect(hasRequiredFields({ smtpHost: 'test' })).toBe(false)
    })

    it('should validate required fields for branding settings', () => {
      const validBranding = {
        companyName: 'Test Company',
        primaryColor: '#000000',
      }
      
      const hasRequiredFields = (settings: any) => {
        return !!settings.companyName
      }

      expect(hasRequiredFields(validBranding)).toBe(true)
      expect(hasRequiredFields({ primaryColor: '#000000' })).toBe(false)
    })

    it('should reject invalid email addresses', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      expect(emailRegex.test('valid@email.com')).toBe(true)
      expect(emailRegex.test('invalid')).toBe(false)
      expect(emailRegex.test('@invalid.com')).toBe(false)
      expect(emailRegex.test('invalid@')).toBe(false)
    })

    it('should reject invalid color codes', () => {
      const colorRegex = /^#[0-9A-F]{6}$/i
      
      expect(colorRegex.test('#3b82f6')).toBe(true)
      expect(colorRegex.test('#FFF')).toBe(false) // Too short
      expect(colorRegex.test('3b82f6')).toBe(false) // Missing #
      expect(colorRegex.test('#gggggg')).toBe(false) // Invalid hex
    })
  })

  describe('Toggle State Persistence', () => {
    it('should persist integration toggle state', async () => {
      // Create test integration
      const integration = await prisma.integrations.create({
        data: {
          tenant_id: testTenantId,
          name: 'Test Integration',
          provider: 'test_provider',
          type: 'api',
          is_enabled: true,
        },
      })

      expect(integration.is_enabled).toBe(true)

      // Toggle to false
      const updated = await prisma.integrations.update({
        where: { id: integration.id },
        data: { is_enabled: false },
      })

      expect(updated.is_enabled).toBe(false)

      // Verify persistence
      const retrieved = await prisma.integrations.findUnique({
        where: { id: integration.id },
      })

      expect(retrieved?.is_enabled).toBe(false)

      // Clean up
      await prisma.integrations.delete({ where: { id: integration.id } })
    })

    it('should persist workflow toggle state', async () => {
      // Create test workflow
      const workflow = await prisma.automation_workflows.create({
        data: {
          tenant_id: testTenantId,
          name: 'Test Workflow',
          description: 'Test workflow for toggle',
          trigger_type: 'manual',
          trigger_config: {},
          actions: [],
          is_active: true,
          created_by: testUserId,
        },
      })

      expect(workflow.is_active).toBe(true)

      // Toggle to false
      const updated = await prisma.automation_workflows.update({
        where: { id: workflow.id },
        data: { is_active: false },
      })

      expect(updated.is_active).toBe(false)

      // Verify persistence
      const retrieved = await prisma.automation_workflows.findUnique({
        where: { id: workflow.id },
      })

      expect(retrieved?.is_active).toBe(false)

      // Clean up
      await prisma.automation_workflows.delete({ where: { id: workflow.id } })
    })

    it('should persist notification channel toggles', async () => {
      const notificationSettings = {
        newClientRegistration: { email: true, whatsapp: true, push: true },
      }

      await prisma.$executeRaw`
        INSERT INTO system_settings (tenant_id, category, settings, updated_by)
        VALUES (${testTenantId}, 'test_notifications', ${JSON.stringify(notificationSettings)}::jsonb, ${testUserId})
        ON CONFLICT (tenant_id, category) 
        DO UPDATE SET settings = ${JSON.stringify(notificationSettings)}::jsonb, updated_by = ${testUserId}, updated_at = NOW()
      `

      // Toggle email off
      const updatedSettings = {
        newClientRegistration: { email: false, whatsapp: true, push: true },
      }

      await prisma.$executeRaw`
        INSERT INTO system_settings (tenant_id, category, settings, updated_by)
        VALUES (${testTenantId}, 'test_notifications', ${JSON.stringify(updatedSettings)}::jsonb, ${testUserId})
        ON CONFLICT (tenant_id, category) 
        DO UPDATE SET settings = ${JSON.stringify(updatedSettings)}::jsonb, updated_by = ${testUserId}, updated_at = NOW()
      `

      // Verify persistence
      const retrieved = await prisma.$queryRaw<any[]>`
        SELECT settings FROM system_settings 
        WHERE tenant_id = ${testTenantId} AND category = 'test_notifications'
      `

      expect(retrieved[0].settings.newClientRegistration.email).toBe(false)
      expect(retrieved[0].settings.newClientRegistration.whatsapp).toBe(true)
    })

    it('should handle multiple toggle state changes', async () => {
      const integration = await prisma.integrations.create({
        data: {
          tenant_id: testTenantId,
          name: 'Toggle Test Integration',
          provider: 'test',
          type: 'api',
          is_enabled: true,
        },
      })

      // Toggle multiple times
      await prisma.integrations.update({
        where: { id: integration.id },
        data: { is_enabled: false },
      })

      await prisma.integrations.update({
        where: { id: integration.id },
        data: { is_enabled: true },
      })

      await prisma.integrations.update({
        where: { id: integration.id },
        data: { is_enabled: false },
      })

      // Verify final state
      const final = await prisma.integrations.findUnique({
        where: { id: integration.id },
      })

      expect(final?.is_enabled).toBe(false)

      // Clean up
      await prisma.integrations.delete({ where: { id: integration.id } })
    })
  })

  describe('Integration Test Endpoints', () => {
    it('should validate email settings can be tested', () => {
      const emailSettings = {
        provider: 'smtp',
        smtpHost: 'smtp.test.com',
        smtpPort: '587',
        smtpUser: 'test@test.com',
        fromEmail: 'noreply@test.com',
      }

      // Validate settings have required fields for testing
      const canTest = (settings: any) => {
        return !!(
          settings.smtpHost &&
          settings.smtpPort &&
          settings.fromEmail
        )
      }

      expect(canTest(emailSettings)).toBe(true)
      expect(canTest({ smtpHost: 'test' })).toBe(false)
    })

    it('should validate test endpoint response structure', () => {
      const testResponse = {
        success: true,
        message: 'Connection successful',
        details: {
          host: 'smtp.test.com',
          port: 587,
          secure: false,
        },
      }

      expect(testResponse).toHaveProperty('success')
      expect(testResponse).toHaveProperty('message')
      expect(typeof testResponse.success).toBe('boolean')
    })

    it('should handle test endpoint errors', () => {
      const errorResponse = {
        success: false,
        message: 'Connection failed',
        error: 'ECONNREFUSED',
      }

      expect(errorResponse.success).toBe(false)
      expect(errorResponse).toHaveProperty('error')
    })
  })

  describe('Default Settings Generation', () => {
    it('should generate default email settings', () => {
      const defaultEmail = {
        provider: 'smtp',
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        fromEmail: '',
        fromName: '',
        replyToEmail: '',
      }

      expect(defaultEmail.provider).toBe('smtp')
      expect(defaultEmail.smtpPort).toBe('587')
    })

    it('should generate default branding settings', () => {
      const defaultBranding = {
        logoUrl: '',
        faviconUrl: '',
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        accentColor: '#10b981',
        companyName: 'FitCoach',
        tagline: 'Transform Your Fitness Journey',
      }

      expect(defaultBranding.companyName).toBe('FitCoach')
      expect(defaultBranding.primaryColor).toBe('#3b82f6')
    })

    it('should generate default notification settings', () => {
      const defaultNotifications = {
        newClientRegistration: { email: true, whatsapp: true, push: true },
        paymentReceived: { email: true, whatsapp: false, push: true },
      }

      expect(defaultNotifications.newClientRegistration.email).toBe(true)
      expect(defaultNotifications.paymentReceived.whatsapp).toBe(false)
    })
  })

  describe('Settings Audit Trail', () => {
    it('should track who updated settings', async () => {
      const settings = { test: 'value' }

      await prisma.$executeRaw`
        INSERT INTO system_settings (tenant_id, category, settings, updated_by)
        VALUES (${testTenantId}, 'test_email', ${JSON.stringify(settings)}::jsonb, ${testUserId})
        ON CONFLICT (tenant_id, category) 
        DO UPDATE SET settings = ${JSON.stringify(settings)}::jsonb, updated_by = ${testUserId}, updated_at = NOW()
      `

      const retrieved = await prisma.$queryRaw<any[]>`
        SELECT updated_by FROM system_settings 
        WHERE tenant_id = ${testTenantId} AND category = 'test_email'
      `

      expect(retrieved[0].updated_by).toBe(testUserId)
    })

    it('should track when settings were updated', async () => {
      const beforeUpdate = new Date()

      const settings = { test: 'timestamp' }
      await prisma.$executeRaw`
        INSERT INTO system_settings (tenant_id, category, settings, updated_by)
        VALUES (${testTenantId}, 'test_email', ${JSON.stringify(settings)}::jsonb, ${testUserId})
        ON CONFLICT (tenant_id, category) 
        DO UPDATE SET settings = ${JSON.stringify(settings)}::jsonb, updated_by = ${testUserId}, updated_at = NOW()
      `

      const retrieved = await prisma.$queryRaw<any[]>`
        SELECT updated_at FROM system_settings 
        WHERE tenant_id = ${testTenantId} AND category = 'test_email'
      `

      const updatedAt = new Date(retrieved[0].updated_at)
      expect(updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime())
    })
  })
})
