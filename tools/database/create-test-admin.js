const { PrismaClient } = require('@prisma/client');

async function createTestAdmin() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Creating test admin user...');
    
    // Check if the test admin already exists
    const existingAdmin = await prisma.team_members.findUnique({
      where: {
        uq_team_email: {
          tenant_id: 1n,
          email: 'admin1@example.com'
        }
      }
    });
    
    if (existingAdmin) {
      console.log('Test admin user already exists:', existingAdmin);
      return;
    }
    
    // Create the test admin user
    const adminUser = await prisma.team_members.create({
      data: {
        tenant_id: 1n,
        full_name: 'Test Admin',
        email: 'admin1@example.com',
        role: 'admin',
        active: true,
        created_at: new Date(),
      }
    });
    
    console.log('Test admin user created successfully:', adminUser);
    
  } catch (error) {
    console.error('Error creating test admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAdmin();