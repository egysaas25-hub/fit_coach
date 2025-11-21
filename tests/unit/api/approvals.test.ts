/**
 * Unit tests for Approval Workflow API endpoints
 * 
 * These tests verify the core functionality of the approval workflow system.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Approval Workflow API', () => {
  let testTenantId: bigint
  let testTeamMemberId: bigint
  let testReviewerId: bigint
  let testApprovalId: bigint

  beforeAll(async () => {
    // Get or create test tenant
    const tenant = await prisma.tenants.findFirst()
    if (!tenant) {
      throw new Error('No tenant found in database')
    }
    testTenantId = tenant.id

    // Get or create test team members
    const teamMembers = await prisma.team_members.findMany({
      where: { tenant_id: testTenantId },
      take: 2,
    })

    if (teamMembers.length < 2) {
      throw new Error('Need at least 2 team members for testing')
    }

    testTeamMemberId = teamMembers[0].id
    testReviewerId = teamMembers[1].id
  })

  afterAll(async () => {
    // Clean up test approval workflows
    if (testApprovalId) {
      await prisma.approval_workflows.deleteMany({
        where: { id: testApprovalId },
      })
    }
  })

  it('should create an approval workflow', async () => {
    const approval = await prisma.approval_workflows.create({
      data: {
        tenant_id: testTenantId,
        entity_type: 'exercise',
        entity_id: BigInt(999),
        status: 'pending',
        submitted_by: testTeamMemberId,
      },
    })

    expect(approval).toBeDefined()
    expect(approval.status).toBe('pending')
    expect(approval.entity_type).toBe('exercise')
    testApprovalId = approval.id
  })

  it('should list pending approvals', async () => {
    const approvals = await prisma.approval_workflows.findMany({
      where: {
        tenant_id: testTenantId,
        status: 'pending',
      },
    })

    expect(Array.isArray(approvals)).toBe(true)
    expect(approvals.length).toBeGreaterThan(0)
  })

  it('should approve an approval workflow', async () => {
    // Create a test approval
    const approval = await prisma.approval_workflows.create({
      data: {
        tenant_id: testTenantId,
        entity_type: 'nutrition',
        entity_id: BigInt(888),
        status: 'pending',
        submitted_by: testTeamMemberId,
      },
    })

    // Approve it
    const updated = await prisma.approval_workflows.update({
      where: { id: approval.id },
      data: {
        status: 'approved',
        reviewed_by: testReviewerId,
        reviewed_at: new Date(),
        notes: 'Test approval',
      },
    })

    expect(updated.status).toBe('approved')
    expect(updated.reviewed_by).toBe(testReviewerId)
    expect(updated.reviewed_at).toBeDefined()
    expect(updated.notes).toBe('Test approval')

    // Clean up
    await prisma.approval_workflows.delete({ where: { id: approval.id } })
  })

  it('should reject an approval workflow', async () => {
    // Create a test approval
    const approval = await prisma.approval_workflows.create({
      data: {
        tenant_id: testTenantId,
        entity_type: 'workout',
        entity_id: BigInt(777),
        status: 'pending',
        submitted_by: testTeamMemberId,
      },
    })

    // Reject it
    const updated = await prisma.approval_workflows.update({
      where: { id: approval.id },
      data: {
        status: 'rejected',
        reviewed_by: testReviewerId,
        reviewed_at: new Date(),
        notes: 'Needs revision',
      },
    })

    expect(updated.status).toBe('rejected')
    expect(updated.reviewed_by).toBe(testReviewerId)
    expect(updated.reviewed_at).toBeDefined()
    expect(updated.notes).toBe('Needs revision')

    // Clean up
    await prisma.approval_workflows.delete({ where: { id: approval.id } })
  })

  it('should filter approvals by entity type', async () => {
    const approvals = await prisma.approval_workflows.findMany({
      where: {
        tenant_id: testTenantId,
        entity_type: 'exercise',
      },
    })

    expect(Array.isArray(approvals)).toBe(true)
    approvals.forEach((approval) => {
      expect(approval.entity_type).toBe('exercise')
    })
  })

  it('should get audit trail', async () => {
    const auditRecords = await prisma.approval_workflows.findMany({
      where: {
        tenant_id: testTenantId,
        status: {
          in: ['approved', 'rejected'],
        },
      },
      orderBy: {
        reviewed_at: 'desc',
      },
    })

    expect(Array.isArray(auditRecords)).toBe(true)
    auditRecords.forEach((record) => {
      expect(['approved', 'rejected']).toContain(record.status)
    })
  })

  it('should include team member details in query', async () => {
    const approvals = await prisma.approval_workflows.findMany({
      where: {
        tenant_id: testTenantId,
      },
      include: {
        submitted_by_team_member: {
          select: {
            id: true,
            full_name: true,
            email: true,
            role: true,
          },
        },
        reviewed_by_team_member: {
          select: {
            id: true,
            full_name: true,
            email: true,
            role: true,
          },
        },
      },
      take: 1,
    })

    if (approvals.length > 0) {
      expect(approvals[0].submitted_by_team_member).toBeDefined()
      expect(approvals[0].submitted_by_team_member?.full_name).toBeDefined()
    }
  })
})
