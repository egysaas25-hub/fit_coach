import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProduction() {
  console.log('🌱 Seeding production database...\n');

  try {
    // Create default currency
    console.log('Creating default currency...');
    const currency = await prisma.currencies.upsert({
      where: { code: 'USD' },
      update: {
        fx_rate_to_usd: 1.0,
      },
      create: {
        code: 'USD',
        name: 'US Dollar',
        fx_rate_to_usd: 1.0,
      },
    });
    console.log('✅ Created/updated currency:', currency.code);

    // Create additional common currencies
    const currencies = [
      { code: 'EUR', name: 'Euro', rate: 0.92 },
      { code: 'GBP', name: 'British Pound', rate: 0.79 },
      { code: 'EGP', name: 'Egyptian Pound', rate: 30.90 },
      { code: 'AED', name: 'UAE Dirham', rate: 3.67 },
      { code: 'SAR', name: 'Saudi Riyal', rate: 3.75 },
    ];

    for (const curr of currencies) {
      await prisma.currencies.upsert({
        where: { code: curr.code },
        update: { fx_rate_to_usd: curr.rate },
        create: {
          code: curr.code,
          name: curr.name,
          fx_rate_to_usd: curr.rate,
        },
      });
      console.log(`✅ Created/updated currency: ${curr.code}`);
    }

    // Create default tenant
    console.log('\nCreating default tenant...');
    const tenant = await prisma.tenants.upsert({
      where: { slug: 'default' },
      update: {},
      create: {
        name: 'FitCoach Pro',
        slug: 'default',
        country: 'US',
        timezone: 'America/New_York',
        default_language: 'en',
        currency_id: currency.id,
      },
    });
    console.log('✅ Created default tenant:', tenant.name);

    // Create admin user
    console.log('\nCreating admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@fitcoach.com';
    const adminName = process.env.ADMIN_NAME || 'Admin User';
    
    const admin = await prisma.team_members.upsert({
      where: { 
        tenant_id_email: {
          tenant_id: tenant.id,
          email: adminEmail,
        }
      },
      update: {
        active: true,
      },
      create: {
        tenant_id: tenant.id,
        full_name: adminName,
        email: adminEmail,
        role: 'admin',
        active: true,
        max_caseload: 100,
      },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create default training types
    console.log('\nCreating default training types...');
    const trainingTypes = [
      { name: { en: 'Strength Training', ar: 'تدريب القوة' }, description: { en: 'Build muscle and strength', ar: 'بناء العضلات والقوة' } },
      { name: { en: 'Cardio', ar: 'كارديو' }, description: { en: 'Improve cardiovascular health', ar: 'تحسين صحة القلب' } },
      { name: { en: 'HIIT', ar: 'تدريب عالي الكثافة' }, description: { en: 'High-intensity interval training', ar: 'تدريب متقطع عالي الكثافة' } },
      { name: { en: 'Flexibility', ar: 'المرونة' }, description: { en: 'Improve flexibility and mobility', ar: 'تحسين المرونة والحركة' } },
    ];

    for (const type of trainingTypes) {
      await prisma.training_types.upsert({
        where: {
          tenant_id_name: {
            tenant_id: tenant.id,
            name: type.name,
          },
        },
        update: {},
        create: {
          tenant_id: tenant.id,
          name: type.name,
          description: type.description,
        },
      });
      console.log(`✅ Created training type: ${type.name.en}`);
    }

    // Create default muscle groups
    console.log('\nCreating default muscle groups...');
    const muscleGroups = [
      { name: { en: 'Chest', ar: 'الصدر' }, description: { en: 'Pectoral muscles', ar: 'عضلات الصدر' } },
      { name: { en: 'Back', ar: 'الظهر' }, description: { en: 'Back muscles', ar: 'عضلات الظهر' } },
      { name: { en: 'Legs', ar: 'الساقين' }, description: { en: 'Leg muscles', ar: 'عضلات الساقين' } },
      { name: { en: 'Shoulders', ar: 'الأكتاف' }, description: { en: 'Deltoid muscles', ar: 'عضلات الكتف' } },
      { name: { en: 'Arms', ar: 'الذراعين' }, description: { en: 'Biceps and triceps', ar: 'البايسبس والترايسبس' } },
      { name: { en: 'Core', ar: 'الجذع' }, description: { en: 'Abdominal and core muscles', ar: 'عضلات البطن والجذع' } },
    ];

    for (const group of muscleGroups) {
      await prisma.muscle_groups.upsert({
        where: {
          tenant_id_name: {
            tenant_id: tenant.id,
            name: group.name,
          },
        },
        update: {},
        create: {
          tenant_id: tenant.id,
          name: group.name,
          description: group.description,
        },
      });
      console.log(`✅ Created muscle group: ${group.name.en}`);
    }

    // Create default metric definitions
    console.log('\nCreating default metric definitions...');
    const metrics = [
      { name: 'Weight', unit: 'kg', description: 'Body weight in kilograms' },
      { name: 'Body Fat %', unit: '%', description: 'Body fat percentage' },
      { name: 'Muscle Mass', unit: 'kg', description: 'Muscle mass in kilograms' },
      { name: 'BMI', unit: '', description: 'Body Mass Index' },
      { name: 'Waist', unit: 'cm', description: 'Waist circumference' },
      { name: 'Chest', unit: 'cm', description: 'Chest circumference' },
      { name: 'Arms', unit: 'cm', description: 'Arm circumference' },
      { name: 'Thighs', unit: 'cm', description: 'Thigh circumference' },
    ];

    for (const metric of metrics) {
      await prisma.metric_definitions.upsert({
        where: {
          tenant_id_name: {
            tenant_id: tenant.id,
            name: metric.name,
          },
        },
        update: {},
        create: {
          tenant_id: tenant.id,
          name: metric.name,
          unit: metric.unit,
          description: metric.description,
        },
      });
      console.log(`✅ Created metric: ${metric.name}`);
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🎉 Production database seeded successfully!');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📊 Summary:');
    console.log(`   - Currencies: ${currencies.length + 1} created`);
    console.log(`   - Tenant: ${tenant.name}`);
    console.log(`   - Admin: ${admin.email}`);
    console.log(`   - Training types: ${trainingTypes.length} created`);
    console.log(`   - Muscle groups: ${muscleGroups.length} created`);
    console.log(`   - Metrics: ${metrics.length} created\n`);
    
    console.log('🔐 Next Steps:');
    console.log('   1. Update admin user phone number for WhatsApp login');
    console.log('   2. Configure system settings via admin panel');
    console.log('   3. Set up integrations (WhatsApp, OpenAI, etc.)');
    console.log('   4. Create additional team members as needed\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

seedProduction()
  .catch((e) => {
    console.error('Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
