import { PrismaClient, customer_status, subscription_status, payment_gateway, payment_status, region, language, gender, role, source, ticket_category, ticket_priority, ticket_status, integration_type, auth_type, webhook_status, outbound_message_status, job_status, media_type } from '@prisma/client'
import { faker } from '@faker-js/faker'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export function resetMockDbFiles() {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    if (fs.existsSync(dataDir)) {
      fs.rmSync(dataDir, { recursive: true, force: true })
      console.log('🧹 Mock DB files removed (data directory cleared)')
    } else {
      console.log('ℹ️ No mock DB data directory found to reset')
    }
  } catch (err) {
    console.error('Failed to reset mock DB files', err)
  }
}

async function main() {
  console.log('🌱 Starting full seed...')

  // ---- Currencies ----
  const usd = await prisma.currencies.create({
    data: { code: 'USD', name: 'US Dollar', fx_rate_to_usd: 1.0 }
  })
  const egp = await prisma.currencies.create({
    data: { code: 'EGP', name: 'Egyptian Pound', fx_rate_to_usd: 0.020 }
  })

  // ---- Tenant ----
  const tenant = await prisma.tenants.create({
    data: {
      name: 'FitLife Co.',
      slug: 'fitlife',
      country: 'Egypt',
      timezone: 'Africa/Cairo',
      currency_id: egp.id,
      default_language: language.en,
    },
  })

  await prisma.tenant_branding.create({
    data: {
      tenant_id: tenant.id,
      logo_url: 'https://example.com/logo.png',
      primary_color: '#00b894',
      whatsapp_number: '+201234567890',
      template_config: { theme: 'dark' },
    },
  })

  // ---- Team Members ----
  const admin = await prisma.team_members.create({
    data: { tenant_id: tenant.id, full_name: 'Admin User', email: 'admin@fitlife.com', role: role.admin },
  })
  const coach = await prisma.team_members.create({
    data: { tenant_id: tenant.id, full_name: 'Coach Mike', email: 'mike@fitlife.com', role: role.coach },
  })
  const support = await prisma.team_members.create({
    data: { tenant_id: tenant.id, full_name: 'Support Sarah', email: 'support@fitlife.com', role: role.support },
  })

  // ---- Customers ----
  const customers = await Promise.all(
    Array.from({ length: 5 }).map(async (_, i) => {
      return prisma.customers.create({
        data: {
          tenant_id: tenant.id,
          phone_e164: `+20100000${100 + i}`,
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          gender: i % 2 ? gender.male : gender.female,
          age: faker.number.int({ min: 20, max: 40 }),
          height_cm: faker.number.int({ min: 155, max: 185 }),
          start_weight_kg: faker.number.float({ min: 60, max: 90, fractionDigits: 1 }),
          region: region.MENA,
          source: source.social,
          status: customer_status.active,
          preferred_currency_id: egp.id,
          language: language.en,
        },
      })
    })
  )

  // ---- Customer Profiles & Health ----
  await Promise.all(customers.map(async (c) => {
    await prisma.customer_profiles.create({
      data: {
        customer_id: c.id,
        notes: faker.lorem.paragraph(),
        lifestyle: { smoker: false, activity: 'moderate' },
        medical_json: { allergies: ['nuts'], conditions: ['asthma'] },
      },
    })
    await prisma.customer_health_conditions.create({
      data: {
        customer_id: c.id,
        condition_text: 'High cholesterol',
      },
    })
  }))

  // ---- Subscriptions & Payments ----
  const subs = await Promise.all(customers.map(async (c) =>
    prisma.subscriptions.create({
      data: {
        tenant_id: tenant.id,
        customer_id: c.id,
        plan_code: 'MONTHLY',
        price_cents: 5000,
        currency_id: egp.id,
        status: subscription_status.active,
        start_at: faker.date.past(),
        renew_at: faker.date.future(),
        sales_owner_id: admin.id,
        coach_owner_id: coach.id,
      },
    })
  ))

  await Promise.all(subs.map(async (s) =>
    prisma.payments.create({
      data: {
        tenant_id: tenant.id,
        customer_id: s.customer_id,
        subscription_id: s.id,
        gateway: payment_gateway.stripe,
        provider_region: region.MENA,
        amount_cents: 5000,
        currency_id: egp.id,
        status: payment_status.paid,
        paid_at: faker.date.recent(),
      },
    })
  ))

  // ---- Nutrition & Training Content ----
  const type = await prisma.training_types.create({
    data: { tenant_id: tenant.id, name: { en: 'Strength' } },
  })
  const muscle = await prisma.muscle_groups.create({
    data: { tenant_id: tenant.id, name: { en: 'Chest' } },
  })
  const exercise = await prisma.exercises.create({
    data: {
      tenant_id: tenant.id,
      name: { en: 'Bench Press' },
      training_type_id: type.id,
      muscle_group_id: muscle.id,
      equipment_needed: 'Barbell',
      calories_burned_per_min: 6.5,
    },
  })

  const plan = await prisma.training_plans.create({
    data: {
      tenant_id: tenant.id,
      customer_id: customers[0].id,
      version: 1,
      created_by: coach.id,
    },
  })

  await prisma.training_plan_exercises.create({
    data: {
      plan_id: plan.id,
      exercise_id: exercise.id,
      sets: 3,
      reps: 10,
      order_index: 1,
    },
  })

  // ---- Nutrition Facts & Plans ----
  const food = await prisma.nutrition_facts.create({
    data: {
      tenant_id: tenant.id,
      food_name: { en: 'Chicken Breast' },
      portion_size: '100g',
      calories: 165,
      protein_g: 31,
      carbs_g: 0,
      fat_g: 3.6,
    },
  })

  const nPlan = await prisma.nutrition_plans.create({
    data: {
      tenant_id: tenant.id,
      customer_id: customers[0].id,
      version: 1,
      created_by: coach.id,
      calories_target: 2000,
    },
  })

  const meal = await prisma.nutrition_meals.create({
    data: { tenant_id: tenant.id, plan_id: nPlan.id, meal_name: 'Lunch', order_index: 1 },
  })

  await prisma.nutrition_meal_items.create({
    data: {
      tenant_id: tenant.id,
      meal_id: meal.id,
      food_id: food.id,
      food_name: 'Chicken Breast',
      portion_size: '100g',
      calories: 165,
      protein_g: 31,
      order_index: 1,
    },
  })

  // ---- Progress & Check-ins ----
  await prisma.checkins.create({
    data: {
      tenant_id: tenant.id,
      customer_id: customers[0].id,
      period: 'monthly',
      checkin_date: new Date(),
      reviewed_by: coach.id,
      action_taken: 'adjust_training',
    },
  })

  await prisma.progress_tracking.create({
    data: {
      tenant_id: tenant.id,
      customer_id: customers[0].id,
      weight_kg: 67.5,
      workout_done: true,
      sleep_hours: 7.5,
    },
  })

  // ---- Tickets ----
  await prisma.tickets.create({
    data: {
      tenant_id: tenant.id,
      customer_id: customers[0].id,
      category: ticket_category.support,
      subject: 'App not loading',
      priority: ticket_priority.P1,
      status: ticket_status.open,
      assigned_to: support.id,
    },
  })

  // ---- Integrations & Webhooks ----
  const integration = await prisma.integrations.create({
    data: {
      tenant_id: tenant.id,
      name: 'Twilio',
      provider: 'twilio',
      type: integration_type.messaging,
      base_url: 'https://api.twilio.com',
    },
  })

  const account = await prisma.integration_accounts.create({
    data: {
      tenant_id: tenant.id,
      integration_id: integration.id,
      account_name: 'main',
      auth_type: auth_type.api_key,
      is_default: true,
    },
  })

  const webhook = await prisma.webhook_subscriptions.create({
    data: {
      integration_account_id: account.id,
      topic: 'message.received',
      callback_url: 'https://fitlife.com/webhooks/twilio',
    },
  })

  await prisma.webhook_events.create({
    data: {
      subscription_id: webhook.id,
      topic: 'message.received',
      payload: { body: 'Test message' },
      status: webhook_status.received,
    },
  })

  // ---- Jobs & Media ----
  const scheduler = await prisma.scheduler_jobs.create({
    data: {
      tenant_id: tenant.id,
      name: 'daily-report',
      cron_expr: '0 0 * * *',
      handler: 'generateDailyReport',
    },
  })
  await prisma.job_runs.create({
    data: {
      job_id: scheduler.id,
      status: job_status.success,
      items_processed: 20,
    },
  })

  await prisma.background_jobs.create({
    data: {
      tenant_id: tenant.id,
      name: 'syncContacts',
      status: job_status.queued,
    },
  })

  const media = await prisma.media_library.create({
    data: {
      tenant_id: tenant.id,
      title: { en: 'Welcome Video' },
      type: 'video/mp4',
    },
  })

  await prisma.media_references.create({
    data: {
      tenant_id: tenant.id,
      entity_type: 'training_plans',
      entity_id: plan.id,
      url: 'https://cdn.fitlife.com/video1.mp4',
      type: media_type.video,
    },
  })

  console.log('✅ Seed complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
