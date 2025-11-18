"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PhoneInput } from "@/components/shared/forms/PhoneInput"
import { OTPVerificationModal } from "@/components/features/auth/OTPVerificationModal"
import { MessageSquare, Phone, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const COUNTRY_CODES = [
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+1", country: "US/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
]

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+20")
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [language, setLanguage] = useState("en")

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en"
    setLanguage(savedLang)
  }, [])

  // Save language to localStorage when changed
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang)
    localStorage.setItem("lang", newLang)
  }

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Show immediate feedback
      toast.loading("Sending WhatsApp message…")
      
      const fullPhone = `${countryCode}${phone}`
      
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Couldn't send code. Try again.")
      }

      setPhoneNumber(fullPhone)
      setShowOTPModal(true)
      toast.success("Code sent via WhatsApp ✅")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Connection issue. Please retry.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (otp: string) => {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNumber, code: otp }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Invalid / Expired code")
    }

    toast.success("Login successful!")
    
    // Default redirect to admin dashboard as per spec
    router.push("/admin/dashboard")
  }

  const handleResendOTP = async () => {
    const response = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNumber }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "Failed to resend code")
    }

    toast.success("New code sent to your WhatsApp.")
  }

  // Validate phone format according to spec: ^\+[0-9]{1,3}[0-9]{6,14}$
  const isValidPhone = phone.length >= 6 && /^[0-9]{6,14}$/.test(phone)

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0B0E0C' }}>
      <div className="w-full max-w-md space-y-6">
        {/* Header with Logo and Language Selector */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00C26A' }} />
            <span className="text-2xl font-bold text-white">Trainer SaaS</span>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-20 bg-transparent border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="en" className="text-white hover:bg-gray-700">EN</SelectItem>
              <SelectItem value="ar" className="text-white hover:bg-gray-700">AR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Login Card */}
        <Card className="w-full bg-gray-900 border-gray-700">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome back 👋</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to your Trainer Dashboard
            </CardDescription>
            <div className="text-xs text-gray-500 mt-2">
              Test phones: +201012345678 (Admin) | +201087654321 (Trainer) | +966501234567 (Coach)
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRequestOTP} className="space-y-4">
              {/* Country Code and Phone Input */}
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-24 bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {COUNTRY_CODES.map((country) => (
                      <SelectItem 
                        key={country.code} 
                        value={country.code}
                        className="text-white hover:bg-gray-700"
                      >
                        {country.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  countryCode=""
                  onCountryCodeChange={() => {}}
                  disabled={isLoading}
                  label=""
                  placeholder="Phone Number"
                  className="flex-1"
                />
              </div>

              {/* WhatsApp Info */}
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <MessageSquare className="w-4 h-4" style={{ color: '#00C26A' }} />
                  <span>You'll receive your code on WhatsApp</span>
                </div>
              </div>

              {/* Continue Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!isValidPhone || isLoading}
                style={{ 
                  backgroundColor: isValidPhone && !isLoading ? '#00C26A' : '#374151',
                  color: 'white'
                }}
              >
                {isLoading ? (
                  <>
                    <Phone className="mr-2 h-4 w-4 animate-spin" />
                    Sending WhatsApp message…
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    className="text-white hover:underline font-medium"
                    style={{ color: '#00C26A' }}
                  >
                    Create Account
                  </Link>
                </p>
              </div>

              {/* Need Help Link */}
              <div className="text-center">
                <Link 
                  href="#" 
                  className="text-sm text-gray-400 hover:text-white"
                  onClick={(e) => {
                    e.preventDefault()
                    // TODO: Open support modal
                    toast.info("Support: Contact us via WhatsApp or email")
                  }}
                >
                  Need help?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <OTPVerificationModal
          open={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          onVerify={handleVerifyOTP}
          onResend={handleResendOTP}
          phoneNumber={phoneNumber}
        />

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          <p>© 2025 Trainer SaaS • v2025.1</p>
        </div>
      </div>
    </div>
  )
}