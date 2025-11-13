// Simple database connection test
const { PrismaClient } = require('@prisma/client');

// Check if PrismaClient is available
console.log('PrismaClient:', typeof PrismaClient);

// Try to create an instance
try {
  const prisma = new PrismaClient();
  console.log('Prisma client created successfully');
  
  // Check if prisma is properly initialized
  console.log('Prisma client keys:', Object.keys(prisma));
} catch (error) {
  console.error('Error creating Prisma client:', error.message);
}