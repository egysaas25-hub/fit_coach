import fs from 'fs';
import path from 'path';
import { Database } from './database';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

/**
 * Ensure data directories exist
 */
function ensureDataDirectories(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

/**
 * Load database from JSON file
 * @returns Database object or null if file doesn't exist
 */
export function loadDatabase(): Partial<Database> | null {
  try {
    ensureDataDirectories();
    
    if (!fs.existsSync(DB_FILE)) {
      console.log('No existing database file found');
      return null;
    }

    const rawData = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(rawData);

    // Parse dates from JSON strings
    const parsedData = parseDatesInDatabase(parsed);
    
    console.log('Database loaded from file successfully');
    return parsedData;
  } catch (err) {
    console.error('Failed to load database from file:', err);
    return null;
  }
}

/**
 * Save database to JSON file
 * @param db Database object to save
 */
export function saveDatabase(db: Database): boolean {
  try {
    ensureDataDirectories();

    // Create backup if file exists
    if (fs.existsSync(DB_FILE)) {
      createBackup();
    }

    // Write to file with pretty formatting
    const jsonData = JSON.stringify(db, null, 2);
    fs.writeFileSync(DB_FILE, jsonData, 'utf-8');
    
    console.log('Database saved to file successfully');
    return true;
  } catch (err) {
    console.error('Failed to save database to file:', err);
    return false;
  }
}

/**
 * Create a timestamped backup of the current database
 */
export function createBackup(): boolean {
  try {
    ensureDataDirectories();
    
    if (!fs.existsSync(DB_FILE)) {
      console.log('No database file to backup');
      return false;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `database-${timestamp}.json`);
    
    fs.copyFileSync(DB_FILE, backupFile);
    console.log(`Backup created: ${backupFile}`);

    // Keep only last 10 backups
    cleanOldBackups(10);
    
    return true;
  } catch (err) {
    console.error('Failed to create backup:', err);
    return false;
  }
}

/**
 * Restore database from a backup file
 * @param backupFileName Name of the backup file to restore
 */
export function restoreFromBackup(backupFileName: string): boolean {
  try {
    const backupFile = path.join(BACKUP_DIR, backupFileName);
    
    if (!fs.existsSync(backupFile)) {
      console.error(`Backup file not found: ${backupFileName}`);
      return false;
    }

    // Create a backup of current state before restoring
    if (fs.existsSync(DB_FILE)) {
      createBackup();
    }

    fs.copyFileSync(backupFile, DB_FILE);
    console.log(`Database restored from backup: ${backupFileName}`);
    return true;
  } catch (err) {
    console.error('Failed to restore from backup:', err);
    return false;
  }
}

/**
 * List all available backups
 */
export function listBackups(): string[] {
  try {
    ensureDataDirectories();
    
    if (!fs.existsSync(BACKUP_DIR)) {
      return [];
    }

    const files = fs.readdirSync(BACKUP_DIR);
    return files
      .filter(file => file.startsWith('database-') && file.endsWith('.json'))
      .sort()
      .reverse(); // Most recent first
  } catch (err) {
    console.error('Failed to list backups:', err);
    return [];
  }
}

/**
 * Delete old backups, keeping only the most recent N backups
 * @param keepCount Number of backups to keep
 */
function cleanOldBackups(keepCount: number = 10): void {
  try {
    const backups = listBackups();
    
    if (backups.length <= keepCount) {
      return;
    }

    // Delete oldest backups
    const toDelete = backups.slice(keepCount);
    toDelete.forEach(backup => {
      const backupPath = path.join(BACKUP_DIR, backup);
      fs.unlinkSync(backupPath);
      console.log(`Deleted old backup: ${backup}`);
    });
  } catch (err) {
    console.error('Failed to clean old backups:', err);
  }
}

/**
 * Auto-save database with debouncing
 */
let saveTimeout: NodeJS.Timeout | null = null;
let pendingData: Database | null = null;

export function scheduleSave(db: Database, delayMs: number = 1000): void {
  pendingData = db;
  
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    if (pendingData) {
      saveDatabase(pendingData);
      pendingData = null;
    }
    saveTimeout = null;
  }, delayMs);
}

/**
 * Force immediate save of pending data
 */
export function flushPendingSave(): boolean {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }

  if (pendingData) {
    const result = saveDatabase(pendingData);
    pendingData = null;
    return result;
  }

  return true;
}

/**
 * Parse date strings back to Date objects
 * @param data Raw parsed JSON data
 */
function parseDatesInDatabase(data: any): Partial<Database> {
  const dateFields = ['createdAt', 'updatedAt', 'date', 'dateCompleted', 'dateLogged'];
  
  // Helper to recursively parse dates in an object
  const parseDatesInObject = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => parseDatesInObject(item));
    }
    
    if (typeof obj === 'object') {
      const parsed: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (dateFields.includes(key) && typeof value === 'string') {
          parsed[key] = new Date(value);
        } else if (typeof value === 'object') {
          parsed[key] = parseDatesInObject(value);
        } else {
          parsed[key] = value;
        }
      }
      return parsed;
    }
    
    return obj;
  };
  
  return parseDatesInObject(data);
}

/**
 * Export database to JSON string
 * @param db Database object
 */
export function exportToJSON(db: Database): string {
  return JSON.stringify(db, null, 2);
}

/**
 * Import database from JSON string
 * @param jsonString JSON string containing database data
 */
export function importFromJSON(jsonString: string): Partial<Database> | null {
  try {
    const parsed = JSON.parse(jsonString);
    return parseDatesInDatabase(parsed);
  } catch (err) {
    console.error('Failed to import from JSON:', err);
    return null;
  }
}
