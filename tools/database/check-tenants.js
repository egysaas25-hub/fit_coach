// Check if there are existing tenants
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTenants() {
  console.log('Checking existing tenants...\n');
  
  try {
    const tenants = await prisma.tenants.findMany();
    console.log(`Found ${tenants.length} tenant(s):`);
    
    tenants.forEach(tenant => {
      console.log(`- ID: ${tenant.id}, Name: ${tenant.name}, Slug: ${tenant.slug}`);
    });
    
    if (tenants.length > 0) {
      console.log(`\n✅ Using tenant ID ${tenants[0].id} for testing`);
      return tenants[0].id;
    } else {
      console.log('\n❌ No tenants found. Creating a default tenant...');
      const defaultTenant = await prisma.tenants.create({
        data: {
          name: 'FitCoach Pro',
          slug: 'fitcoach-pro',
        }
      });
      console.log(`✅ Created default tenant with ID: ${defaultTenant.id}`);
      return defaultTenant.id;
    }
  } catch (error) {
    console.error('❌ Error checking tenants:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTenants();