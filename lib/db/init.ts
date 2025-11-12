// Temporary workaround for database import issue
let database: any = null;
let initializeDatabase: any = null;

try {
  const dbModule = require('@/lib/mock-db/database');
  database = dbModule.database;
  initializeDatabase = dbModule.initializeDatabase;
} catch (e) {
  console.warn('Database module not available, using mock implementation');
  // Create mock database implementation
  database = {
    load: () => false,
    save: () => true,
    init: () => {},
  };
  
  initializeDatabase = () => {};
}

import { seedData } from '@/lib/mock-db/seed-data';
import { flushPendingSave } from '@/lib/mock-db/persistence';

let isInitialized = false;

export const ensureDbInitialized = () => {
    if (!isInitialized) {
        try {
          // Try to load from file first
          const loaded = database.load();
          
          // If no file exists, initialize with seed data
          if (!loaded) {
              console.log('No existing database found, initializing with seed data');
              initializeDatabase(seedData);
              database.save();
          } else {
              console.log('Database loaded from persistent storage');
          }
        } catch (e) {
          console.warn('Database initialization failed, using mock database');
        }
        
        isInitialized = true;
    }
};

// Ensure database is saved on process exit
if (typeof process !== 'undefined') {
    process.on('SIGINT', () => {
        console.log('\nSaving database before exit...');
        try {
          flushPendingSave();
        } catch (e) {
          console.warn('Failed to save database on exit');
        }
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\nSaving database before exit...');
        try {
          flushPendingSave();
        } catch (e) {
          console.warn('Failed to save database on exit');
        }
        process.exit(0);
    });

    process.on('exit', () => {
        try {
          flushPendingSave();
        } catch (e) {
          console.warn('Failed to save database on exit');
        }
    });
}