import { NextRequest, NextResponse } from "next/server"
import { whatsappService } from "@/lib/services/whatsapp"

/**
 * Get QR code for WhatsApp session initialization
 * GET /api/whatsapp/qrcode
 */
export async function GET(request: NextRequest) {
  try {
    const qrCode = await whatsappService.getQRCode()

    if (!qrCode) {
      return NextResponse.json(
        { error: "Failed to generate QR code" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      qrcode: qrCode,
      message: "Scan this QR code with WhatsApp to connect",
    })
  } catch (error) {
    console.error("QR code generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    )
  }
}
