// lib/mappers/audit.mapper.ts
import { AuditLog, SystemEvent, AuditAction } from '@/types/domain/audit';

interface RawAuditLog {
  log_id: string;
  action: string;
  user_id?: string;
  message: string;
  status: string;
  timestamp: string;
}

interface RawSystemEvent {
  event_id: string;
  type: string;
  details: string;
  severity: string;
  timestamp: string;
}

export class AuditMapper {
  static toDomainAuditLog(raw: RawAuditLog): AuditLog {
    return {
      id: raw.log_id,
      action: raw.action as AuditAction,
      userId: raw.user_id,
      message: raw.message,
      status: raw.status as AuditLog['status'],
      timestamp: raw.timestamp,
    };
  }

  static toDomainAuditLogs(rawLogs: RawAuditLog[]): AuditLog[] {
    return rawLogs.map(this.toDomainAuditLog);
  }

  static toDomainSystemEvent(raw: RawSystemEvent): SystemEvent {
    return {
      id: raw.event_id,
      type: raw.type,
      details: raw.details,
      severity: raw.severity as SystemEvent['severity'],
      timestamp: raw.timestamp,
    };
  }

  static toDomainSystemEvents(rawEvents: RawSystemEvent[]): SystemEvent[] {
    return rawEvents.map(this.toDomainSystemEvent);
  }
}