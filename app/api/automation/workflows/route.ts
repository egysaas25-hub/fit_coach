import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/automation/workflows
 * List all automation workflows for the tenant
 */
export async function GET(request: NextRequest) {
  try {
    // In a real app, get tenant_id from session/auth
    // For now, get the first tenant
    const tenant = await prisma.tenants.findFirst();
    
    if (!tenant) {
      return NextResponse.json(
        { error: 'No tenant found' },
        { status: 404 }
      );
    }

    const workflows = await prisma.automation_workflows.findMany({
      where: { tenant_id: tenant.id },
      orderBy: { created_at: 'desc' },
    });

    // Convert BigInt to string for JSON serialization
    const response = workflows.map(workflow => ({
      ...workflow,
      id: workflow.id.toString(),
      tenant_id: workflow.tenant_id.toString(),
      created_by: workflow.created_by.toString(),
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    );
  }
}
