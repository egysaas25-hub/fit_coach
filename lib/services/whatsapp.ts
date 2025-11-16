/**
 * WhatsApp Integration Service (WPPConnect Self-Hosted)
 * Handles OTP delivery, message sending, and webhook processing
 */

interface WPPConnectConfig {
  apiUrl: string
  secretKey: string
  sessionName: string
}

interface SendMessageParams {
  phone: string
  message: string
  templateId?: string
  templateParams?: Record<string, string>
}

interface SendOTPParams {
  phone: string
  code: string
}

interface SendFileParams {
  phone: string
  fileUrl: string
  fileName: string
  caption?: string
}

export class WhatsAppService {
  private config: WPPConnectConfig

  constructor() {
    this.config = {
      apiUrl: process.env.WPPCONNECT_API_URL || "http://localhost:21465",
      secretKey: process.env.WPPCONNECT_SECRET_KEY || "",
      sessionName: process.env.WPPCONNECT_SESSION_NAME || "default",
    }
  }

  /**
   * Send OTP via WhatsApp
   */
  async sendOTP({ phone, code }: SendOTPParams): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhone(phone)

      const message = `🔐 Your verification code is: *${code}*\n\nValid for 2 minutes.\n\nDo not share this code with anyone.`

      const response = await fetch(
        `${this.config.apiUrl}/api/${this.config.sessionName}/send-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.secretKey}`,
          },
          body: JSON.stringify({
            phone: formattedPhone,
            message,
            isGroup: false,
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        console.error("WPPConnect OTP send failed:", error)
        return false
      }

      const result = await response.json()
      console.log("OTP sent successfully:", result)
      return true
    } catch (error) {
      console.error("WhatsApp OTP send error:", error)
      return false
    }
  }

  /**
   * Send regular message via WhatsApp
   */
  async sendMessage({ phone, message, templateId, templateParams }: SendMessageParams): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhone(phone)

      // Apply template if provided
      let finalMessage = message
      if (templateId && templateParams) {
        finalMessage = this.applyTemplate(message, templateParams)
      }

      const response = await fetch(
        `${this.config.apiUrl}/api/${this.config.sessionName}/send-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.secretKey}`,
          },
          body: JSON.stringify({
            phone: formattedPhone,
            message: finalMessage,
            isGroup: false,
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        console.error("WPPConnect message send failed:", error)
        return false
      }

      const result = await response.json()
      console.log("Message sent successfully:", result)
      return true
    } catch (error) {
      console.error("WhatsApp message send error:", error)
      return false
    }
  }

  /**
   * Send plan delivery message with PDF attachment
   */
  async sendPlanDelivery(phone: string, clientName: string, pdfUrl: string, portalLink: string): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhone(phone)

      // Send welcome message
      const welcomeMessage = `Hi ${clientName}! 🎉\n\nYour personalized plan is ready!\n\nAccess your portal here:\n${portalLink}\n\nLet's crush those goals together! 💪`

      await this.sendMessage({
        phone: formattedPhone,
        message: welcomeMessage,
      })

      // Send PDF document
      await this.sendFile({
        phone: formattedPhone,
        fileUrl: pdfUrl,
        fileName: `${clientName.replace(/\s+/g, "_")}_Plan.pdf`,
        caption: "📋 Your Personalized Plan",
      })

      return true
    } catch (error) {
      console.error("Plan delivery error:", error)
      return false
    }
  }

  /**
   * Send file (PDF, image, video) via WhatsApp
   */
  async sendFile({ phone, fileUrl, fileName, caption }: SendFileParams): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhone(phone)

      const response = await fetch(
        `${this.config.apiUrl}/api/${this.config.sessionName}/send-file-base64`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.secretKey}`,
          },
          body: JSON.stringify({
            phone: formattedPhone,
            path: fileUrl,
            filename: fileName,
            caption: caption || "",
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        console.error("WPPConnect file send failed:", error)
        return false
      }

      const result = await response.json()
      console.log("File sent successfully:", result)
      return true
    } catch (error) {
      console.error("WhatsApp file send error:", error)
      return false
    }
  }

  /**
   * Process incoming webhook from WPPConnect
   */
  async processWebhook(payload: any): Promise<void> {
    try {
      const { event, data } = payload

      switch (event) {
        case "onmessage":
          await this.handleIncomingMessage(data)
          break
        case "onack":
          await this.handleAck(data)
          break
        case "onstatechange":
          await this.handleStateChange(data)
          break
        default:
          console.log("Unhandled webhook event:", event)
      }
    } catch (error) {
      console.error("Webhook processing error:", error)
    }
  }

  /**
   * Check connection status
   */
  async checkStatus(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.config.apiUrl}/api/${this.config.sessionName}/check-connection-session`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.config.secretKey}`,
          },
        }
      )

      if (!response.ok) {
        return false
      }

      const result = await response.json()
      return result.status === "CONNECTED"
    } catch (error) {
      console.error("Status check error:", error)
      return false
    }
  }

  /**
   * Get QR code for session initialization
   */
  async getQRCode(): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.config.apiUrl}/api/${this.config.sessionName}/start-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.secretKey}`,
          },
          body: JSON.stringify({
            webhook: process.env.WPPCONNECT_WEBHOOK_URL || "",
            waitQrCode: true,
          }),
        }
      )

      if (!response.ok) {
        return null
      }

      const result = await response.json()
      return result.qrcode || null
    } catch (error) {
      console.error("QR code generation error:", error)
      return null
    }
  }

  /**
   * Private helper methods
   */

  private formatPhone(phone: string): string {
    // WPPConnect expects format: 5511999999999@c.us (country+area+number@c.us)
    let cleaned = phone.replace(/\D/g, "")

    // Remove leading + if present
    if (cleaned.startsWith("+")) {
      cleaned = cleaned.substring(1)
    }

    // Add @c.us suffix if not present
    if (!cleaned.includes("@")) {
      cleaned = `${cleaned}@c.us`
    }

    return cleaned
  }

  private applyTemplate(template: string, params: Record<string, string>): string {
    let result = template
    for (const [key, value] of Object.entries(params)) {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), value)
    }
    return result
  }

  private async handleIncomingMessage(data: any): Promise<void> {
    try {
      // Extract message data
      const {
        id,
        from,
        body,
        type,
        timestamp,
        isGroupMsg,
        chatId,
      } = data

      if (isGroupMsg) {
        console.log("Ignoring group message")
        return
      }

      // Store message in database
      // TODO: Implement database storage
      console.log("Incoming message:", {
        messageId: id,
        from,
        content: body,
        type,
        timestamp,
      })

      // Update thread unread count
      // Trigger notifications to assigned trainer
    } catch (error) {
      console.error("Error handling incoming message:", error)
    }
  }

  private async handleAck(data: any): Promise<void> {
    try {
      // ACK levels in WPPConnect:
      // 1 = sent
      // 2 = received
      // 3 = read
      // 4 = played (for audio)
      const { id, ack } = data

      console.log("Message ACK:", { messageId: id, ackLevel: ack })

      // Update message status in database
      // TODO: Implement database update
    } catch (error) {
      console.error("Error handling ACK:", error)
    }
  }

  private async handleStateChange(data: any): Promise<void> {
    try {
      const { state } = data
      console.log("Connection state changed:", state)

      // States: CONFLICT, CONNECTED, DEPRECATED_VERSION, OPENING, PAIRING, PROXYBLOCK, SMB_TOS_BLOCK, TIMEOUT, TOS_BLOCK, UNLAUNCHED, UNPAIRED, UNPAIRED_IDLE
      
      if (state === "CONNECTED") {
        console.log("✅ WhatsApp connected successfully")
      } else if (state === "UNPAIRED") {
        console.log("⚠️ WhatsApp session unpaired - QR code scan required")
      }
    } catch (error) {
      console.error("Error handling state change:", error)
    }
  }
}

// Singleton instance
export const whatsappService = new WhatsAppService()
