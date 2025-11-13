const fs = require('fs');
const path = require('path');

// Create data directory if it doesn't exist
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Seed data for users
const seedData = {
  users: [
    {
      id: 'user-c1',
      email: 'client1@example.com',
      name: 'Alice Client',
      role: 'client',
      passwordHash: 'mock-hashed-password123', // correct hash
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'user-c2',
      email: 'client2@example.com',
      name: 'Bob Client',
      role: 'client',
      passwordHash: 'mock-hashed-password123', // correct hash
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'user-a1',
      email: 'admin1@example.com',
      name: 'Admin User',
      role: 'admin',
      passwordHash: 'mock-hashed-password123', // correct hash
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]
};

// Database file path
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Save seed data to database file
const jsonData = JSON.stringify(seedData, null, 2);
fs.writeFileSync(DB_FILE, jsonData, 'utf-8');

console.log('Database initialized with seed data successfully!');
console.log('Users created:');
seedData.users.forEach(user => {
  console.log(`- ${user.email} (${user.role})`);
});