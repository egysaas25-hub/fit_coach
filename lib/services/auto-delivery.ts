/**
 * Auto-Delivery Service
 * Handles automated plan delivery workflow
 */

import { prisma } from "@/lib/prisma"
import { pdfGenerator } from "./pdf-generator"
import { whatsappService } from "./whatsapp"

interface DeliveryParams {
  assignmentId: string
  tenantId: string
}

interface DeliveryResult {
  success: boolean
  pdfUrl?: string
  portalLink?: string
  error?: string
}

export class AutoDeliveryService {
  /**
   * Execute auto-delivery workflow for a plan assignment
   */
  async deliverPlan(params: DeliveryParams): Promise<DeliveryResult> {
    const { assignmentId, tenantId } = params

    try {
      // 1. Get assignment details
      const assignment = await this.getAssignmentDetails(assignmentId, tenantId)
      
      if (!assignment) {
        throw new Error("Assignment not found")
      }

      // 2. Generate PDF
      const pdfUrl = await this.generatePlanPDF(assignment)

      // 3. Generate portal link
      const portalLink = this.generatePortalLink(assignment.client_id, assignment.plan_id)

      // 4. Send via WhatsApp
      await this.sendViaWhatsApp(assignment, pdfUrl, portalLink)

      // 5. Update assignment status
      await this.updateAssignmentStatus(assignmentId, "delivered", pdfUrl)

      // 6. Auto-dismiss notification
      await this.dismissKYCNotification(assignment.client_id, tenantId)

      // 7. Create check-in schedule
      await this.createCheckInSchedule(assignment)

      return {
        success: true,
        pdfUrl,
        portalLink,
      }
    } catch (error) {
      console.error("Auto-delivery error:", error)
      
      // Update assignment with error
      await this.updateAssignmentStatus(assignmentId, "failed")

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Get full assignment details with related data
   */
  private async getAssignmentDetails(assignmentId: string, tenantId: string) {
    const result = await prisma.$queryRaw`
      SELECT 
        pa.assignment_id,
        pa.plan_id,
        pa.version_id,
        pa.client_id,
        pa.start_date,
        pa.delivery_channel,
        p.name as plan_name,
        p.plan_type,
        pv.content,
        pv.version_number,
        c.client_code,
        c.first_name || ' ' || c.last_name as client_name,
        c.phone as client_phone,
        c.email as client_email,
        tm.first_name || ' ' || tm.last_name as trainer_name,
        t.settings as tenant_settings
      FROM plan_assignments pa
      JOIN plans p ON pa.plan_id = p.plan_id
      JOIN plan_versions pv ON pa.version_id = pv.version_id
      JOIN clients c ON pa.client_id = c.client_id
      LEFT JOIN team_members tm ON pa.assigned_by = tm.member_id
      LEFT JOIN tenants t ON pa.tenant_id = t.tenant_id
      WHERE pa.assignment_id = ${assignmentId}::uuid
        AND pa.tenant_id = ${tenantId}::uuid
      LIMIT 1
    `

    return result[0] || null
  }

  /**
   * Generate PDF for the plan
   */
  private async generatePlanPDF(assignment: any): Promise<string> {
    const content = typeof assignment.content === "string" 
      ? JSON.parse(assignment.content) 
      : assignment.content

    const tenantSettings = typeof assignment.tenant_settings === "string"
      ? JSON.parse(assignment.tenant_settings)
      : assignment.tenant_settings || {}

    const pdfUrl = await pdfGenerator.generatePlanPDF({
      planId: assignment.plan_id,
      planName: assignment.plan_name,
      planType: assignment.plan_type,
      content,
      clientName: assignment.client_name,
      clientCode: assignment.client_code,
      trainerName: assignment.trainer_name || "Your Coach",
      tenantBranding: {
        logo: tenantSettings.branding?.logo,
        primaryColor: tenantSettings.branding?.primaryColor,
        companyName: tenantSettings.branding?.companyName,
      },
    })

    return pdfUrl
  }

  /**
   * Generate portal link for client
   */
  private generatePortalLink(clientId: string, planId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    return `${baseUrl}/client/plans/${planId}?client=${clientId}`
  }

  /**
   * Send plan via WhatsApp
   */
  private async sendViaWhatsApp(assignment: any, pdfUrl: string, portalLink: string) {
    if (assignment.delivery_channel !== "whatsapp") {
      console.log("Skipping WhatsApp delivery, channel:", assignment.delivery_channel)
      return
    }

    if (!assignment.client_phone) {
      throw new Error("Client phone number not found")
    }

    await whatsappService.sendPlanDelivery(
      assignment.client_phone,
      assignment.client_name,
      pdfUrl,
      portalLink
    )
  }

  /**
   * Update assignment delivery status
   */
  private async updateAssignmentStatus(
    assignmentId: string,
    deliveryStatus: string,
    pdfUrl?: string
  ) {
    await prisma.$executeRaw`
      UPDATE plan_assignments
      SET 
        delivery_status = ${deliveryStatus},
        delivered_at = ${deliveryStatus === "delivered" ? "NOW()" : null},
        updated_at = NOW()
      WHERE assignment_id = ${assignmentId}::uuid
    `

    // Store PDF URL in metadata if provided
    if (pdfUrl) {
      await prisma.$executeRaw`
        UPDATE plan_assignments
        SET metadata = jsonb_set(
          COALESCE(metadata, '{}'::jsonb),
          '{pdf_url}',
          to_jsonb(${pdfUrl}::text)
        )
        WHERE assignment_id = ${assignmentId}::uuid
      `
    }
  }

  /**
   * Auto-dismiss KYC notification after plan delivery
   */
  private async dismissKYCNotification(clientId: string, tenantId: string) {
    await prisma.$executeRaw`
      UPDATE persistent_notifications
      SET 
        is_dismissed = true,
        dismissed_at = NOW()
      WHERE tenant_id = ${tenantId}::uuid
        AND notification_type = 'kyc_ready'
        AND related_entity_id = ${clientId}::uuid
        AND is_dismissed = false
    `
  }

  /**
   * Create check-in schedule based on plan duration
   */
  private async createCheckInSchedule(assignment: any) {
    const content = typeof assignment.content === "string"
      ? JSON.parse(assignment.content)
      : assignment.content

    const durationWeeks = content.duration_weeks || 12
    const checkInsPerWeek = 1 // Default: weekly check-ins
    const totalCheckIns = durationWeeks * checkInsPerWeek

    const startDate = new Date(assignment.start_date)

    for (let i = 1; i <= totalCheckIns; i++) {
      const dueDate = new Date(startDate)
      dueDate.setDate(dueDate.getDate() + (i * 7)) // Weekly

      await prisma.$executeRaw`
        INSERT INTO checkin_schedules (
          tenant_id,
          assignment_id,
          client_id,
          round_number,
          due_date,
          status
        )
        SELECT 
          pa.tenant_id,
          pa.assignment_id,
          pa.client_id,
          ${i},
          ${dueDate.toISOString().split("T")[0]}::date,
          'pending'
        FROM plan_assignments pa
        WHERE pa.assignment_id = ${assignment.assignment_id}::uuid
      `
    }

    console.log(`Created ${totalCheckIns} check-in schedules for assignment ${assignment.assignment_id}`)
  }

  /**
   * Batch delivery for multiple assignments
   */
  async deliverBatch(assignmentIds: string[], tenantId: string): Promise<DeliveryResult[]> {
    const results: DeliveryResult[] = []

    for (const assignmentId of assignmentIds) {
      const result = await this.deliverPlan({ assignmentId, tenantId })
      results.push(result)

      // Add delay between deliveries to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    return results
  }

  /**
   * Retry failed delivery
   */
  async retryDelivery(assignmentId: string, tenantId: string): Promise<DeliveryResult> {
    // Reset status before retry
    await prisma.$executeRaw`
      UPDATE plan_assignments
      SET delivery_status = 'pending'
      WHERE assignment_id = ${assignmentId}::uuid
    `

    return this.deliverPlan({ assignmentId, tenantId })
  }
}

// Singleton instance
export const autoDelivery = new AutoDeliveryService()
