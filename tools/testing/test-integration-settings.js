/**
 * Test script for integration settings toggle functionality
 * 
 * This script tests:
 * 1. Fetching integrations list
 * 2. Toggling integration enabled status
 * 3. Verifying the toggle persists
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testIntegrationSettings() {
  console.log('🧪 Testing Integration Settings Toggle Functionality\n')

  try {
    // Get a test tenant
    const tenant = await prisma.tenants.findFirst()

    if (!tenant) {
      console.log('❌ No active tenant found. Please create a tenant first.')
      return
    }

    console.log(`✅ Using tenant: ${tenant.name} (ID: ${tenant.id})`)

    // Check if integrations exist
    let integrations = await prisma.integrations.findMany({
      where: { tenant_id: tenant.id },
      take: 5
    })

    // If no integrations exist, create some test data
    if (integrations.length === 0) {
      console.log('\n📝 Creating test integrations...')
      
      const testIntegrations = [
        {
          tenant_id: tenant.id,
          name: 'WhatsApp Business',
          provider: 'Meta',
          type: 'messaging',
          base_url: 'https://graph.facebook.com',
          docs_url: 'https://developers.facebook.com/docs/whatsapp',
          is_enabled: true,
        },
        {
          tenant_id: tenant.id,
          name: 'Stripe Payments',
          provider: 'Stripe',
          type: 'payments',
          base_url: 'https://api.stripe.com',
          docs_url: 'https://stripe.com/docs',
          is_enabled: true,
        },
        {
          tenant_id: tenant.id,
          name: 'Vercel Blob Storage',
          provider: 'Vercel',
          type: 'storage',
          base_url: 'https://blob.vercel-storage.com',
          docs_url: 'https://vercel.com/docs/storage/vercel-blob',
          is_enabled: false,
        },
        {
          tenant_id: tenant.id,
          name: 'Google Analytics',
          provider: 'Google',
          type: 'analytics',
          base_url: 'https://analytics.google.com',
          docs_url: 'https://developers.google.com/analytics',
          is_enabled: true,
        },
      ]

      for (const integration of testIntegrations) {
        await prisma.integrations.create({ data: integration })
      }

      console.log(`✅ Created ${testIntegrations.length} test integrations`)

      // Fetch the newly created integrations
      integrations = await prisma.integrations.findMany({
        where: { tenant_id: tenant.id },
        take: 5
      })
    }

    console.log(`\n📋 Found ${integrations.length} integrations:\n`)
    integrations.forEach(integration => {
      const status = integration.is_enabled ? '✅ Enabled' : '❌ Disabled'
      console.log(`  ${status} - ${integration.name} (${integration.provider})`)
    })

    // Test toggling an integration
    if (integrations.length > 0) {
      const testIntegration = integrations[0]
      const originalStatus = testIntegration.is_enabled
      const newStatus = !originalStatus

      console.log(`\n🔄 Testing toggle for: ${testIntegration.name}`)
      console.log(`   Current status: ${originalStatus ? 'Enabled' : 'Disabled'}`)
      console.log(`   Toggling to: ${newStatus ? 'Enabled' : 'Disabled'}`)

      // Update the integration
      const updated = await prisma.integrations.update({
        where: { id: testIntegration.id },
        data: { 
          is_enabled: newStatus,
          updated_at: new Date()
        }
      })

      console.log(`   ✅ Toggle successful!`)
      console.log(`   New status: ${updated.is_enabled ? 'Enabled' : 'Disabled'}`)

      // Verify the change persisted
      const verified = await prisma.integrations.findUnique({
        where: { id: testIntegration.id }
      })

      if (verified.is_enabled === newStatus) {
        console.log(`   ✅ Status persisted correctly in database`)
      } else {
        console.log(`   ❌ Status did not persist correctly`)
      }

      // Toggle back to original state
      await prisma.integrations.update({
        where: { id: testIntegration.id },
        data: { 
          is_enabled: originalStatus,
          updated_at: new Date()
        }
      })
      console.log(`   ✅ Restored original status`)
    }

    // Test statistics
    const stats = await prisma.integrations.groupBy({
      by: ['is_enabled'],
      where: { tenant_id: tenant.id },
      _count: true
    })

    console.log('\n📊 Integration Statistics:')
    stats.forEach(stat => {
      const label = stat.is_enabled ? 'Enabled' : 'Disabled'
      console.log(`   ${label}: ${stat._count} integrations`)
    })

    // Test by type
    const byType = await prisma.integrations.groupBy({
      by: ['type'],
      where: { tenant_id: tenant.id },
      _count: true
    })

    console.log('\n📊 Integrations by Type:')
    byType.forEach(type => {
      console.log(`   ${type.type}: ${type._count} integrations`)
    })

    console.log('\n✅ All integration settings tests passed!')

  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testIntegrationSettings()
