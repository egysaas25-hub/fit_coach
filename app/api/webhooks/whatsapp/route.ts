import { NextRequest, NextResponse } from "next/server"
import { whatsappService } from "@/lib/services/whatsapp"
import { prisma } from "@/lib/prisma"

/**
 * WPPConnect Webhook Handler
 * Receives events from self-hosted WPPConnect server
 */

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    
    // Log webhook for debugging
    console.log("WPPConnect webhook received:", {
      event: payload.event,
      session: payload.session,
      timestamp: new Date().toISOString(),
    })

    // Store webhook log in database
    await storeWebhookLog(payload)

    // Process the webhook
    await whatsappService.processWebhook(payload)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

async function storeWebhookLog(payload: any) {
  try {
    await prisma.$executeRaw`
      INSERT INTO webhook_logs (
        webhook_type,
        payload,
        processed_at
      ) VALUES (
        'wppconnect',
        ${JSON.stringify(payload)}::jsonb,
        NOW()
      )
    `
  } catch (error) {
    console.error("Failed to store webhook log:", error)
  }
}
