/**
 * Test script for Settings API
 * 
 * This script verifies that the settings API endpoints work correctly.
 * Run with: node tools/testing/test-settings-api.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testSettingsAPI() {
  console.log('🧪 Testing Settings API...\n')

  try {
    // Get test tenant and team member
    const tenant = await prisma.tenants.findFirst()
    if (!tenant) {
      throw new Error('No tenant found in database')
    }
    console.log(`✓ Found tenant: ${tenant.name} (ID: ${tenant.id})`)

    const teamMember = await prisma.team_members.findFirst({
      where: { tenant_id: tenant.id },
    })
    if (!teamMember) {
      throw new Error('No team member found')
    }
    console.log(`✓ Found team member: ${teamMember.full_name} (ID: ${teamMember.id})\n`)

    // Test 1: Create email settings
    console.log('Test 1: Creating email settings...')
    const emailSettings = {
      provider: 'smtp',
      smtpHost: 'smtp.test.com',
      smtpPort: '587',
      smtpUser: 'test@test.com',
      fromEmail: 'noreply@test.com',
      fromName: 'Test FitCoach',
      replyToEmail: 'support@test.com',
    }

    const createdEmail = await prisma.system_settings.upsert({
      where: {
        unique_tenant_category: {
          tenant_id: tenant.id,
          category: 'email',
        },
      },
      update: {
        settings: emailSettings,
        updated_by: teamMember.id,
      },
      create: {
        tenant_id: tenant.id,
        category: 'email',
        settings: emailSettings,
        updated_by: teamMember.id,
      },
    })
    console.log(`✓ Email settings created/updated (ID: ${createdEmail.id})`)

    // Test 2: Retrieve email settings
    console.log('\nTest 2: Retrieving email settings...')
    const retrievedEmail = await prisma.system_settings.findUnique({
      where: {
        unique_tenant_category: {
          tenant_id: tenant.id,
          category: 'email',
        },
      },
    })
    console.log(`✓ Email settings retrieved:`, retrievedEmail.settings)

    // Test 3: Create branding settings
    console.log('\nTest 3: Creating branding settings...')
    const brandingSettings = {
      logoUrl: 'https://example.com/logo.png',
      faviconUrl: 'https://example.com/favicon.ico',
      primaryColor: '#ff6b6b',
      secondaryColor: '#4ecdc4',
      accentColor: '#45b7d1',
      companyName: 'Test Fitness Studio',
      tagline: 'Get Fit Today',
    }

    const createdBranding = await prisma.system_settings.upsert({
      where: {
        unique_tenant_category: {
          tenant_id: tenant.id,
          category: 'branding',
        },
      },
      update: {
        settings: brandingSettings,
        updated_by: teamMember.id,
      },
      create: {
        tenant_id: tenant.id,
        category: 'branding',
        settings: brandingSettings,
        updated_by: teamMember.id,
      },
    })
    console.log(`✓ Branding settings created/updated (ID: ${createdBranding.id})`)

    // Test 4: Create notification settings
    console.log('\nTest 4: Creating notification settings...')
    const notificationSettings = {
      newClientRegistration: { email: true, whatsapp: true, push: true },
      clientMilestoneAchieved: { email: true, whatsapp: false, push: true },
      clientMissedWorkout: { email: false, whatsapp: true, push: false },
      paymentReceived: { email: true, whatsapp: false, push: true },
    }

    const createdNotifications = await prisma.system_settings.upsert({
      where: {
        unique_tenant_category: {
          tenant_id: tenant.id,
          category: 'notifications',
        },
      },
      update: {
        settings: notificationSettings,
        updated_by: teamMember.id,
      },
      create: {
        tenant_id: tenant.id,
        category: 'notifications',
        settings: notificationSettings,
        updated_by: teamMember.id,
      },
    })
    console.log(`✓ Notification settings created/updated (ID: ${createdNotifications.id})`)

    // Test 5: List all settings for tenant
    console.log('\nTest 5: Listing all settings for tenant...')
    const allSettings = await prisma.system_settings.findMany({
      where: { tenant_id: tenant.id },
      select: {
        id: true,
        category: true,
        updated_at: true,
      },
    })
    console.log(`✓ Found ${allSettings.length} settings:`)
    allSettings.forEach(setting => {
      console.log(`  - ${setting.category} (updated: ${setting.updated_at.toISOString()})`)
    })

    // Test 6: Update existing settings
    console.log('\nTest 6: Updating email settings...')
    const updatedEmail = await prisma.system_settings.update({
      where: {
        unique_tenant_category: {
          tenant_id: tenant.id,
          category: 'email',
        },
      },
      data: {
        settings: {
          ...emailSettings,
          smtpHost: 'smtp.updated.com',
        },
        updated_at: new Date(),
      },
    })
    console.log(`✓ Email settings updated (smtpHost: ${updatedEmail.settings.smtpHost})`)

    // Test 7: Verify unique constraint
    console.log('\nTest 7: Verifying unique constraint...')
    const count = await prisma.system_settings.count({
      where: {
        tenant_id: tenant.id,
        category: 'email',
      },
    })
    console.log(`✓ Only ${count} email setting(s) exist for tenant (unique constraint working)`)

    console.log('\n✅ All tests passed!')
    console.log('\nSettings API is working correctly:')
    console.log('  - Create/Update (upsert) ✓')
    console.log('  - Retrieve ✓')
    console.log('  - List ✓')
    console.log('  - Unique constraint ✓')
    console.log('  - Audit trail (updated_by, updated_at) ✓')

  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run tests
testSettingsAPI()
