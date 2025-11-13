// Test setup file
import { prisma } from '@/lib/prisma';

// Clean up database before each test
beforeEach(async () => {
  // Clean up test data before each test
  // Note: In a real test environment, you would truncate tables or use transactions
});

// Clean up database after each test
afterEach(async () => {
  // Clean up test data after each test
});

// Close database connection after all tests
afterAll(async () => {
  await prisma.$disconnect();
});