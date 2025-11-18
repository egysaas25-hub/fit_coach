"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneInput } from "@/components/shared/forms/PhoneInput"
import { Loader2 } from "lucide-react"

interface WhatsAppOTPFormProps {
  onSubmit: (phone: string, countryCode: string) => Promise<void>
  isLoading?: boolean
}

export function WhatsAppOTPForm({ onSubmit, isLoading = false }: WhatsAppOTPFormProps) {
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+20")
  const [error, setError] = useState("")

  const validatePhone = (phone: string, code: string): boolean => {
    if (!phone) {
      setError("Phone number is required")
      return false
    }

    // Basic E.164 validation
    const fullNumber = `${code}${phone}`
    const e164Regex = /^\+[1-9]\d{1,14}$/
    
    if (!e164Regex.test(fullNumber)) {
      setError("Please enter a valid phone number")
      return false
    }

    setError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePhone(phone, countryCode)) {
      return
    }

    try {
      await onSubmit(phone, countryCode)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP")
    }
  }

  const isValid = phone.length >= 9 && !error

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-3xl">👋</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your Trainer Dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PhoneInput
            value={phone}
            onChange={setPhone}
            countryCode={countryCode}
            onCountryCodeChange={setCountryCode}
            error={error}
            disabled={isLoading}
            label="Phone Number"
            placeholder="Enter your phone number"
          />

          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending code...
              </>
            ) : (
              "Continue ▶"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You'll receive a 6-digit code via WhatsApp
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
