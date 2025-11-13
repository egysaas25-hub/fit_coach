const { database, initializeDatabase } = require('../lib/mock-db/database.ts');
const { seedData } = require('../lib/mock-db/seed-data.ts');

console.log('Testing database initialization...');

try {
  // Try to initialize the database
  console.log('Initializing database...');
  initializeDatabase(seedData);
  
  // Try to save the database
  console.log('Saving database...');
  const success = database.save();
  
  if (success) {
    console.log('Database test successful!');
  } else {
    console.log('Database save failed');
  }
} catch (error) {
  console.error('Database test failed:', error);
}