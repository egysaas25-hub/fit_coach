import { database, initializeDatabase } from '@/lib/mock-db/database';
import { seedData } from '@/lib/mock-db/seed-data';
import { flushPendingSave } from '@/lib/mock-db/persistence';

let isInitialized = false;

export const ensureDbInitialized = () => {
    if (!isInitialized) {
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
        
        isInitialized = true;
    }
};

// Ensure database is saved on process exit
if (typeof process !== 'undefined') {
    process.on('SIGINT', () => {
        console.log('\nSaving database before exit...');
        flushPendingSave();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\nSaving database before exit...');
        flushPendingSave();
        process.exit(0);
    });

    process.on('exit', () => {
        flushPendingSave();
    });
}
