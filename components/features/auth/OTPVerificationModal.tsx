"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { OTPInput } from "@/components/shared/forms/OTPInput"
import { Loader2 } from "lucide-react"

interface OTPVerificationModalProps {
  open: boolean
  onClose: () => void
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<void>
  phoneNumber: string
  isLoading?: boolean
}

export function OTPVerificationModal({
  open,
  onClose,
  onVerify,
  onResend,
  phoneNumber,
  isLoading = false
}: OTPVerificationModalProps) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(60)
  const [isResending, setIsResending] = useState(false)

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0 && open) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown, open])

  // Reset on open
  useEffect(() => {
    if (open) {
      setOtp("")
      setError("")
      setResendCooldown(60)
    }
  }, [open])

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !isLoading) {
      handleVerify()
    }
  }, [otp])

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    try {
      setError("")
      await onVerify(otp)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code")
      setOtp("") // Clear OTP on error
    }
  }

  const handleResend = async () => {
    try {
      setIsResending(true)
      setError("")
      await onResend()
      setResendCooldown(60)
      setOtp("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code")
    } finally {
      setIsResending(false)
    }
  }

  const formatPhoneNumber = (phone: string) => {
    // Mask middle digits for privacy
    if (phone.length > 6) {
      return `${phone.slice(0, 3)}****${phone.slice(-4)}`
    }
    return phone
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-center text-white">Enter the 6-digit code</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            sent to {formatPhoneNumber(phoneNumber)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            error={!!error}
          />

          {error && (
            <p className="text-sm text-red-500 text-center" role="alert">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleVerify}
              disabled={otp.length !== 6 || isLoading}
              className="flex-1"
              style={{ 
                backgroundColor: otp.length === 6 && !isLoading ? '#00C26A' : '#374151',
                color: 'white'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify ▶"
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="flex-1 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                "Resend via WhatsApp"
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-gray-400">
            Need help?{" "}
            <button className="hover:text-white" style={{ color: '#00C26A' }}>
              Contact support
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
