const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSchema() {
  try {
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'exercises' 
      ORDER BY ordinal_position
    `;
    
    console.log('Exercises table columns:');
    columns.forEach(c => {
      console.log(`  - ${c.column_name} (${c.data_type})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
