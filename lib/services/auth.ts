import { prisma } from '@/lib/prisma'
import { localDatabase } from '@/lib/db/local'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { whatsappService } from './whatsapp'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export interface JWTPayload {
  user_id: number
  tenant_id: number
  role: string
  email: string
  exp?: number
  iat?: number
}

export interface SessionContext {
  user: {
    id: number
    tenant_id: number
    role: string
    email: string
    full_name: string
  }
}

class AuthService {
  /**
   * Generate a random 6-digit OTP code
   */
  private generateSixDigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * Request OTP - Generate and send OTP via WhatsApp
   */
  async requestOTP(phone: string, ipAddress?: string): Promise<void> {
    // For development, use a fixed test code
    const code = process.env.NODE_ENV === 'development' ? '123456' : this.generateSixDigitCode()

    // Hash the code
    const hash = await bcrypt.hash(code, 12)

    // Store in local database with 2-minute expiration
    const expiresAt = Date.now() + 2 * 60 * 1000 // 2 minutes
    localDatabase.storeOTP(phone, hash, expiresAt)

    // For development: Log the OTP to console
    console.log(`🔐 OTP for ${phone}: ${code}`)

    // Send via WhatsApp (mock for development)
    try {
      // In development, we'll just log instead of actually sending
      console.log(`📱 WhatsApp OTP sent to ${phone}: ${code}`)
      
      // Uncomment this when you have WhatsApp service configured
      // await whatsappService.sendOTP({ phone, code })
    } catch (error) {
      console.error('Failed to send OTP via WhatsApp:', error)
      throw new Error('Failed to send OTP. Please try again.')
    }

    // Log to audit (without sensitive data)
    console.log(`📋 Auth attempt logged: ${phone} - otp_requested`)
  }

  /**
   * Verify OTP and issue JWT token
   */
  async verifyOTP(phone: string, code: string): Promise<string> {
    console.log(`🔍 AuthService.verifyOTP called with phone: ${phone}, code: ${code}`)
    
    // For development, accept the fixed test code directly
    if (process.env.NODE_ENV === 'development' && code === '123456') {
      console.log(`🔓 Development mode: accepting test code for ${phone}`)
      
      // Get user from local database
      const user = localDatabase.findUserByPhone(phone)

      if (!user) {
        console.log(`❌ User not found for phone: ${phone}`)
        throw new Error('User not found or inactive.')
      }

      // Generate JWT token
      const token = await this.signJWT({
        user_id: parseInt(user.id.split('-').pop() || '1'),
        tenant_id: parseInt(user.tenant_id.split('-').pop() || '1'),
        role: user.role,
        email: user.email,
      })

      console.log(`✅ Login successful for ${user.name} (${phone})`)
      return token
    }

    // Verify OTP using local database (for production)
    const isValidOTP = await localDatabase.verifyOTP(phone, code)

    if (!isValidOTP) {
      console.log(`❌ Invalid OTP for ${phone}: ${code}`)
      throw new Error('Invalid or expired OTP code. Please try again.')
    }

    // Get user from local database
    const user = localDatabase.findUserByPhone(phone)

    if (!user) {
      console.log(`❌ User not found for phone: ${phone}`)
      throw new Error('User not found or inactive.')
    }

    // Generate JWT token
    const token = await this.signJWT({
      user_id: parseInt(user.id.split('-').pop() || '1'),
      tenant_id: parseInt(user.tenant_id.split('-').pop() || '1'),
      role: user.role,
      email: user.email,
    })

    console.log(`✅ Login successful for ${user.name} (${phone})`)

    return token
  }

  /**
   * Sign JWT token
   */
  async signJWT(payload: Omit<JWTPayload, 'exp' | 'iat'>): Promise<string> {
    const token = await new SignJWT(payload as any)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // 7 days
      .sign(JWT_SECRET)

    return token
  }

  /**
   * Verify and decode JWT token
   */
  async verifyJWT(token: string): Promise<JWTPayload> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      return payload as JWTPayload
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }

  /**
   * Log authentication attempt to audit log
   */
  private async logAuthAttempt(
    phone: string,
    action: string,
    tenantId?: number
  ): Promise<void> {
    try {
      // For development, just log to console
      console.log(`📋 Auth Log: ${action} for ${phone} (tenant: ${tenantId || 'unknown'})`)
    } catch (error) {
      console.error('Failed to log auth attempt:', error)
      // Don't throw - logging failure shouldn't block auth
    }
  }

  /**
   * Increment failed attempts for rate limiting
   */
  private async incrementAttempts(otpId: bigint): Promise<void> {
    await prisma.otp_codes.update({
      where: { id: otpId },
      data: {
        attempts: {
          increment: 1,
        },
      },
    })
  }
}

export const authService = new AuthService()
