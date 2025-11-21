const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listTables() {
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%exercise%' 
      ORDER BY table_name
    `;
    
    console.log('Exercise-related tables:');
    tables.forEach(t => {
      console.log(`  - ${t.table_name}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listTables();
