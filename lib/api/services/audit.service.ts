// lib/api/services/audit.service.ts
import { AuditLog, SystemEvent } from '@/types/domain/audit';

export class AuditService {
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const response = await fetch('/api/audit/logs');
      const data = await response.json();
      return data as AuditLog[];
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }
  }

  async getSystemEvents(): Promise<SystemEvent[]> {
    try {
      const response = await fetch('/api/audit/events');
      const data = await response.json();
      return data as SystemEvent[];
    } catch (error) {
      console.error('Error fetching system events:', error);
      throw new Error('Failed to fetch system events');
    }
  }
}