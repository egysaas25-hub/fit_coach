const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTenants() {
  const tenants = await prisma.tenants.findMany();
  console.log('Tenants:', JSON.stringify(tenants, null, 2));
  await prisma.$disconnect();
}

checkTenants();
