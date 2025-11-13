const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    
    // Try to fetch team members
    const teamMembers = await prisma.team_members.findMany();
    console.log('Team members found:', teamMembers.length);
    
    if (teamMembers.length > 0) {
      console.log('First team member:', teamMembers[0]);
    }
    
    // Try to fetch customers
    const customers = await prisma.customers.findMany();
    console.log('Customers found:', customers.length);
    
    if (customers.length > 0) {
      console.log('First customer:', customers[0]);
    }
    
  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();