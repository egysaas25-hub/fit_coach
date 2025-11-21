import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * PATCH /api/automation/workflows/[id]
 * Update automation workflow status (enable/disable)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflowId = BigInt(params.id);
    const body = await request.json();
    const { is_active } = body;

    // Validate input
    if (typeof is_active !== 'boolean') {
      return NextResponse.json(
        { error: 'is_active must be a boolean' },
        { status: 400 }
      );
    }

    // Update workflow status
    const updatedWorkflow = await prisma.automation_workflows.update({
      where: { id: workflowId },
      data: {
        is_active,
        updated_at: new Date(),
      },
    });

    // Convert BigInt to string for JSON serialization
    const response = {
      ...updatedWorkflow,
      id: updatedWorkflow.id.toString(),
      tenant_id: updatedWorkflow.tenant_id.toString(),
      created_by: updatedWorkflow.created_by.toString(),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error updating workflow:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update workflow status' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/automation/workflows/[id]
 * Get a single automation workflow
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflowId = BigInt(params.id);

    const workflow = await prisma.automation_workflows.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    // Convert BigInt to string for JSON serialization
    const response = {
      ...workflow,
      id: workflow.id.toString(),
      tenant_id: workflow.tenant_id.toString(),
      created_by: workflow.created_by.toString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
      { status: 500 }
    );
  }
}
