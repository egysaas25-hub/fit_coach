import { database, initializeDatabase } from '../lib/mock-db/database';
import { seedData } from '../lib/mock-db/seed-data';

console.log('Initializing database with seed data...');

// Initialize with seed data
initializeDatabase(seedData);

// Save to file
const success = database.save();

if (success) {
  console.log('Database initialized and saved successfully!');
  console.log('Users created:');
  const users = database.getAll('users');
  users.forEach((user: any) => {
    console.log(`- ${user.email} (${user.role})`);
  });
} else {
  console.error('Failed to save database');
  process.exit(1);
}