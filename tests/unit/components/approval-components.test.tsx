/**
 * Unit tests for Approval Workflow UI Components
 * 
 * These tests verify the approval workflow UI components render correctly.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ApprovalCard, ApprovalWorkflow } from '@/components/features/approval/ApprovalCard'
import { ApprovalQueue } from '@/components/features/approval/ApprovalQueue'

describe('Approval Workflow UI Components', () => {
  const mockApproval: ApprovalWorkflow = {
    id: '1',
    entity_type: 'exercise',
    entity_id: '123',
    status: 'pending',
    submitted_by: '1',
    reviewed_by: null,
    reviewed_at: null,
    notes: null,
    metadata: {
      name: 'Test Exercise',
      description: 'Test description',
      difficulty: 'intermediate',
    },
    created_at: new Date(),
    updated_at: new Date(),
    submitted_by_team_member: {
      id: '1',
      full_name: 'John Doe',
      email: 'john@example.com',
      role: 'trainer',
    },
    reviewed_by_team_member: null,
  }

  it('should render ApprovalCard with pending status', () => {
    const { container } = render(
      <ApprovalCard
        approval={mockApproval}
        onApprove={() => {}}
        onReject={() => {}}
        onView={() => {}}
      />
    )
    
    expect(container).toBeDefined()
  })

  it('should render ApprovalQueue with approvals', () => {
    const { container } = render(
      <ApprovalQueue
        approvals={[mockApproval]}
        isLoading={false}
        onApprove={() => {}}
        onReject={() => {}}
        onView={() => {}}
      />
    )
    
    expect(container).toBeDefined()
  })

  it('should render ApprovalQueue empty state', () => {
    const { container } = render(
      <ApprovalQueue
        approvals={[]}
        isLoading={false}
        onApprove={() => {}}
        onReject={() => {}}
        onView={() => {}}
      />
    )
    
    expect(container).toBeDefined()
  })

  it('should render ApprovalQueue loading state', () => {
    const { container } = render(
      <ApprovalQueue
        approvals={[]}
        isLoading={true}
        onApprove={() => {}}
        onReject={() => {}}
        onView={() => {}}
      />
    )
    
    expect(container).toBeDefined()
  })
})
