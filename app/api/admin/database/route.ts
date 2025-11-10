import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/middleware/auth.middleware';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';
import { database } from '@/lib/mock-db/database';
import { 
  createBackup, 
  listBackups, 
  restoreFromBackup,
  exportToJSON,
  importFromJSON,
  flushPendingSave
} from '@/lib/mock-db/persistence';

/**
 * GET /api/admin/database
 * Get database management info (Admin only)
 */
export async function GET(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['admin', 'super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const backups = listBackups();
    const dbExport = database.export();
    
    // Calculate stats
    const stats = {
      users: dbExport.users.length,
      clients: dbExport.clients.length,
      trainers: dbExport.trainers.length,
      workouts: dbExport.workouts.length,
      workoutLogs: dbExport.workoutLogs.length,
      nutritionPlans: dbExport.nutritionPlans.length,
      nutritionLogs: dbExport.nutritionLogs.length,
      progressEntries: dbExport.progressEntries.length,
      appointments: dbExport.appointments.length,
      messages: dbExport.messages.length,
      messageThreads: dbExport.messageThreads.length,
      notifications: dbExport.notifications.length,
      webhooks: dbExport.webhooks.length,
      authAttempts: dbExport.authAttempts.length,
    };

    return success({
      stats,
      backups,
      backupCount: backups.length,
    });
  } catch (err) {
    console.error('Failed to get database info:', err);
    return error('Failed to get database info', 500);
  }
}

/**
 * POST /api/admin/database
 * Database management actions (Admin only)
 * Actions: backup, restore, export, import, reset
 */
export async function POST(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const roleCheck = requireRole(authResult.user, ['super-admin']);
  if (roleCheck) return roleCheck;

  try {
    const body = await req.json();
    const { action, backupFileName, data } = body;

    switch (action) {
      case 'backup':
        const backupSuccess = createBackup();
        if (!backupSuccess) {
          return error('Failed to create backup', 500);
        }
        return success({ 
          message: 'Backup created successfully',
          backups: listBackups()
        });

      case 'restore':
        if (!backupFileName) {
          return error('backupFileName is required for restore action', 400);
        }
        const restoreSuccess = restoreFromBackup(backupFileName);
        if (!restoreSuccess) {
          return error('Failed to restore from backup', 500);
        }
        // Reload the database
        database.load();
        return success({ 
          message: `Database restored from ${backupFileName}` 
        });

      case 'export':
        const dbExport = database.export();
        const jsonExport = exportToJSON(dbExport);
        return success({ 
          message: 'Database exported successfully',
          data: jsonExport
        });

      case 'import':
        if (!data) {
          return error('data is required for import action', 400);
        }
        const imported = importFromJSON(data);
        if (!imported) {
          return error('Failed to import database', 400);
        }
        // Create backup before import
        createBackup();
        // Initialize with imported data
        database.reset();
        database.init(imported);
        database.save();
        return success({ 
          message: 'Database imported successfully' 
        });

      case 'save':
        // Force immediate save
        flushPendingSave();
        const saveSuccess = database.save();
        if (!saveSuccess) {
          return error('Failed to save database', 500);
        }
        return success({ 
          message: 'Database saved successfully' 
        });

      case 'reset':
        // Create backup before reset
        createBackup();
        database.reset();
        database.save();
        return success({ 
          message: 'Database reset successfully (backup created)' 
        });

      default:
        return error('Invalid action. Supported actions: backup, restore, export, import, save, reset', 400);
    }
  } catch (err) {
    console.error('Database management action failed:', err);
    return error('Database management action failed', 500);
  }
}
