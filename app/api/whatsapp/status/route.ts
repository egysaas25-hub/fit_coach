import { NextRequest, NextResponse } from "next/server"
import { whatsappService } from "@/lib/services/whatsapp"

/**
 * Check WhatsApp connection status
 * GET /api/whatsapp/status
 */
export async function GET(request: NextRequest) {
  try {
    const isConnected = await whatsappService.checkStatus()

    return NextResponse.json({
      connected: isConnected,
      status: isConnected ? "CONNECTED" : "DISCONNECTED",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    )
  }
}
