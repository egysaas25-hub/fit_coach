// Check available Prisma models
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

console.log('Available Prisma models:');
console.log(Object.keys(prisma));

// Check specifically for the models we need
const requiredModels = [
  'customers',
  'team_members',
  'workouts',
  'nutrition_plans',
  'subscriptions'
];

console.log('\nChecking required models:');
requiredModels.forEach(model => {
  const exists = model in prisma;
  console.log(`${model}: ${exists ? '✅ Available' : '❌ Missing'}`);
});

// Let's also check the Prisma client version
console.log('\nPrisma client version:', prisma._clientVersion);

prisma.$disconnect();