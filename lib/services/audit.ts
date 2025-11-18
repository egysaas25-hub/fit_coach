import { prisma } from '@/lib/prisma'

export interface AuditLogEntry {
  tenant_id: number
  actor_id?: number
  entity: string
  entity_id?: number
  action: string
  changes?: any
}

class AuditService {
  /**
   * Log an action to the audit log
   */
  async logAction(entry: AuditLogEntry): Promise<void> {
    try {
      await prisma.audit_log.create({
        data: {
          tenant_id: BigInt(entry.tenant_id),
          actor_team_member_id: entry.actor_id ? BigInt(entry.actor_id) : null,
          entity: entry.entity,
          entity_id: entry.entity_id ? BigInt(entry.entity_id) : null,
          action: entry.action,
          diff: entry.changes || {},
        },
      })
    } catch (error) {
      // Log error but don't throw - audit logging failure shouldn't break the main operation
      console.error('Failed to log audit entry:', error)
    }
  }

  /**
   * Log a create action
   */
  async logCreate(
    tenantId: number,
    actorId: number,
    entity: string,
    entityId: number,
    data: any
  ): Promise<void> {
    await this.logAction({
      tenant_id: tenantId,
      actor_id: actorId,
      entity,
      entity_id: entityId,
      action: 'create',
      changes: { new: data },
    })
  }

  /**
   * Log an update action
   */
  async logUpdate(
    tenantId: number,
    actorId: number,
    entity: string,
    entityId: number,
    oldData: any,
    newData: any
  ): Promise<void> {
    await this.logAction({
      tenant_id: tenantId,
      actor_id: actorId,
      entity,
      entity_id: entityId,
      action: 'update',
      changes: { old: oldData, new: newData },
    })
  }

  /**
   * Log a delete action
   */
  async logDelete(
    tenantId: number,
    actorId: number,
    entity: string,
    entityId: number,
    data: any
  ): Promise<void> {
    await this.logAction({
      tenant_id: tenantId,
      actor_id: actorId,
      entity,
      entity_id: entityId,
      action: 'delete',
      changes: { deleted: data },
    })
  }

  /**
   * Log a custom action
   */
  async logCustomAction(
    tenantId: number,
    actorId: number | undefined,
    entity: string,
    action: string,
    details?: any
  ): Promise<void> {
    await this.logAction({
      tenant_id: tenantId,
      actor_id: actorId,
      entity,
      action,
      changes: details,
    })
  }

  /**
   * Get audit log for an entity
   */
  async getEntityAuditLog(
    tenantId: number,
    entity: string,
    entityId: number,
    limit: number = 50
  ) {
    return await prisma.audit_log.findMany({
      where: {
        tenant_id: BigInt(tenantId),
        entity,
        entity_id: BigInt(entityId),
      },
      include: {
        actor_team_member: {
          select: {
            id: true,
            full_name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    })
  }

  /**
   * Get recent audit log for a tenant
   */
  async getRecentAuditLog(tenantId: number, limit: number = 100) {
    return await prisma.audit_log.findMany({
      where: {
        tenant_id: BigInt(tenantId),
      },
      include: {
        actor_team_member: {
          select: {
            id: true,
            full_name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    })
  }
}

export const auditService = new AuditService()
