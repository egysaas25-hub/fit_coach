"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function WhatsAppLoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main login page which now handles WhatsApp OTP
    router.replace("/login")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0B0E0C' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#00C26A' }}></div>
        <p className="text-gray-400">Redirecting to login...</p>
      </div>
    </div>
  )
}
