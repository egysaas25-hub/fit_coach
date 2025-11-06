// types/domain/audit.ts
export interface AuditLog {
  id: string;
  action: AuditAction;
  userId?: string;
  message: string; // e.g., 'Database backup completed'
  status: 'success' | 'warning' | 'error';
  timestamp: string;
}

export interface SystemEvent {
  id: string;
  type: string; // e.g., 'DatabaseBackup', 'ServiceRestart'
  details: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: string;
}

export enum AuditAction {
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
  Login = 'Login',
  System = 'System',
}