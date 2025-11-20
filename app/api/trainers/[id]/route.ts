import { NextRequest, NextResponse } from 'next/server';
import { getSession, requireRole } from '@/lib/auth/session';
import { success, error, notFound } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/trainers/:id
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession(req);
    const trainerId = BigInt(params.id);

    const trainer = await prisma.team_members.findUnique({
      where: { 
        id: trainerId,
        role: 'coach', // Only get coaches/trainers
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        max_caseload: true,
        active: true,
        created_at: true,
        tenant_id: true,
      },
    });

    if (!trainer) return notFound('Trainer');

    // Transform to expected format
    const trainerResponse = {
      id: trainer.id.toString(),
      name: trainer.full_name,
      email: trainer.email,
      role: trainer.role,
      maxCaseload: trainer.max_caseload,
      active: trainer.active,
      createdAt: trainer.created_at,
      tenantId: trainer.tenant_id.toString(),
    };

    return success(trainerResponse);
  } catch (err) {
    console.error('Failed to fetch trainer:', err);
    return error('Failed to fetch trainer', 500);
  }
}

/**
 * PATCH /api/trainers/:id
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireRole(req, ['admin']);
    const trainerId = BigInt(params.id);

    // Check if trainer exists
    const existingTrainer = await prisma.team_members.findUnique({
      where: { 
        id: trainerId,
        role: 'coach',
      },
    });

    if (!existingTrainer) return notFound('Trainer');

    const body = await req.json();
    
    // Update trainer
    const updated = await prisma.team_members.update({
      where: { id: trainerId },
      data: {
        full_name: body.name || body.full_name,
        email: body.email,
        max_caseload: body.maxCaseload || body.max_caseload,
        active: body.active,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        max_caseload: true,
        active: true,
        created_at: true,
        tenant_id: true,
      },
    });

    // Transform to expected format
    const trainerResponse = {
      id: updated.id.toString(),
      name: updated.full_name,
      email: updated.email,
      role: updated.role,
      maxCaseload: updated.max_caseload,
      active: updated.active,
      createdAt: updated.created_at,
      tenantId: updated.tenant_id.toString(),
    };

    return success(trainerResponse);
  } catch (err) {
    console.error('Failed to update trainer:', err);
    return error('Failed to update trainer', 500);
  }
}

/**
 * DELETE /api/trainers/:id
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireRole(req, ['admin']);
    const trainerId = BigInt(params.id);

    // Check if trainer exists
    const existingTrainer = await prisma.team_members.findUnique({
      where: { 
        id: trainerId,
        role: 'coach',
      },
    });

    if (!existingTrainer) return notFound('Trainer');

    // Soft delete by setting active to false
    await prisma.team_members.update({
      where: { id: trainerId },
      data: { active: false },
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Failed to delete trainer:', err);
    return error('Failed to delete trainer', 500);
  }
}