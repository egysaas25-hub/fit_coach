// lib/hooks/api/useAudit.ts
import { useQuery } from '@tanstack/react-query';
import { AuditService } from '@/lib/api/services/audit.service';
import { AuditLog, SystemEvent } from '@/types/domain/audit';

const auditService = new AuditService();

/**
 * Hook for audit logs
 * Rule 1: Component calls hook
 * Rule 2: Hook calls service
 */
export function useAuditLogs() {
  return useQuery({
    queryKey: ['audit', 'logs'],
    queryFn: () => auditService.getAuditLogs(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook for system events
 */
export function useSystemEvents() {
  return useQuery({
    queryKey: ['audit', 'events'],
    queryFn: () => auditService.getSystemEvents(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}