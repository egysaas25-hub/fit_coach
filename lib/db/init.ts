import { database, initializeDatabase } from '@/lib/mock-db/database';
import { seedData } from '@/lib/mock-db/seed-data';

let isInitialized = false;

export const ensureDbInitialized = () => {
    if (!isInitialized) {
        initializeDatabase(seedData);
        isInitialized = true;
        console.log('Mock database initialized with seed data.');
    }
};
