// Import the database module
import('./lib/mock-db/database.mjs').then(({ database, initializeDatabase }) => {
  // Import seed data
  import('./lib/mock-db/seed-data.ts').then(({ seedData }) => {
    console.log('Initializing database with seed data...');

    // Initialize with seed data
    initializeDatabase(seedData);

    // Save to file
    const success = database.save();

    if (success) {
      console.log('Database initialized and saved successfully!');
      console.log('Users created:');
      const users = database.getAll('users');
      users.forEach((user) => {
        console.log(`- ${user.email} (${user.role})`);
      });
    } else {
      console.error('Failed to save database');
      process.exit(1);
    }
  }).catch(err => {
    console.error('Error importing seed data:', err);
    process.exit(1);
  });
}).catch(err => {
  console.error('Error importing database module:', err);
  process.exit(1);
});