const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...');

    // Create a tenant first
    const tenant = await prisma.tenants.upsert({
      where: { slug: 'demo-tenant' },
      update: {},
      create: {
        name: 'Demo Tenant',
        slug: 'demo-tenant',
        country: 'EG',
        timezone: 'Africa/Cairo',
        default_language: 'en',
      },
    });

    console.log('✅ Tenant created:', tenant.name);

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const trainerPassword = await bcrypt.hash('trainer123', 10);

    // Create admin user
    const admin = await prisma.team_members.upsert({
      where: { 
        tenant_id_email: {
          tenant_id: tenant.id,
          email: 'admin@demo.com'
        }
      },
      update: {},
      create: {
        tenant_id: tenant.id,
        full_name: 'Admin User',
        email: 'admin@demo.com',
        role: 'admin',
        active: true,
        max_caseload: 0,
      },
    });

    // Create trainer user
    const trainer = await prisma.team_members.upsert({
      where: { 
        tenant_id_email: {
          tenant_id: tenant.id,
          email: 'trainer@demo.com'
        }
      },
      update: {},
      create: {
        tenant_id: tenant.id,
        full_name: 'John Trainer',
        email: 'trainer@demo.com',
        role: 'coach',
        active: true,
        max_caseload: 50,
      },
    });

    console.log('✅ Users created:');
    console.log('- Admin: admin@demo.com (password: admin123)');
    console.log('- Trainer: trainer@demo.com (password: trainer123)');

    console.log('🎉 Database setup complete!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();