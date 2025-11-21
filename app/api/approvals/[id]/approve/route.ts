import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/approvals/[id]/approve - Approve an approval workflow
 * Body:
 * - reviewed_by: ID of the reviewer (team member)
 * - notes: Optional approval notes
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { reviewed_by, notes } = body

    if (!reviewed_by) {
      return NextResponse.json(
        { error: "reviewed_by is required" },
        { status: 400 }
      )
    }

    // Check if approval workflow exists
    const existingApproval = await prisma.approval_workflows.findUnique({
      where: { id: BigInt(id) },
    })

    if (!existingApproval) {
      return NextResponse.json(
        { error: "Approval workflow not found" },
        { status: 404 }
      )
    }

    // Check if already reviewed
    if (existingApproval.status !== "pending") {
      return NextResponse.json(
        {
          error: `Approval workflow already ${existingApproval.status}`,
        },
        { status: 400 }
      )
    }

    // Update approval workflow to approved
    const updatedApproval = await prisma.approval_workflows.update({
      where: { id: BigInt(id) },
      data: {
        status: "approved",
        reviewed_by: BigInt(reviewed_by),
        reviewed_at: new Date(),
        notes: notes || null,
        updated_at: new Date(),
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
    })

    // Update the entity status based on entity type
    if (existingApproval.entity_type === 'exercise') {
      // Update exercise status to approved
      await prisma.$queryRaw`
        UPDATE exercises
        SET status = 'approved', updated_at = NOW()
        WHERE exercise_id = ${existingApproval.entity_id.toString()}::uuid
      `
    } else if (existingApproval.entity_type === 'nutrition') {
      // Update nutrition plan status to approved and make it active
      await prisma.nutrition_plans.update({
        where: { id: existingApproval.entity_id },
        data: {
          status: 'approved',
          is_active: true,
          updated_at: new Date(),
        },
      })
    } else if (existingApproval.entity_type === 'workout') {
      // Update workout status to approved (if workout table has status field)
      // This can be implemented when workout approval is needed
    }

    // Convert BigInt to string for JSON serialization
    const serializedApproval = {
      ...updatedApproval,
      id: updatedApproval.id.toString(),
      tenant_id: updatedApproval.tenant_id.toString(),
      entity_id: updatedApproval.entity_id.toString(),
      submitted_by: updatedApproval.submitted_by.toString(),
      reviewed_by: updatedApproval.reviewed_by?.toString() || null,
      submitted_by_team_member: updatedApproval.submitted_by_team_member
        ? {
            ...updatedApproval.submitted_by_team_member,
            id: updatedApproval.submitted_by_team_member.id.toString(),
          }
        : null,
      reviewed_by_team_member: updatedApproval.reviewed_by_team_member
        ? {
            ...updatedApproval.reviewed_by_team_member,
            id: updatedApproval.reviewed_by_team_member.id.toString(),
          }
        : null,
    }

    return NextResponse.json({
      success: true,
      approval: serializedApproval,
      message: "Approval workflow approved successfully",
    })
  } catch (error) {
    console.error("Error approving workflow:", error)
    return NextResponse.json(
      { error: "Failed to approve workflow" },
      { status: 500 }
    )
  }
}
