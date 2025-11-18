"use client"

import { useState, useEffect } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle, RefreshCw, QrCode } from "lucide-react"
import Image from "next/image"

interface ConnectionStatus {
  connected: boolean
  status: string
  timestamp: string
}

export default function WhatsAppSettingsPage() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)

  const user = {
    name: "Admin User",
    email: "admin@trainersaas.com",
    role: "admin",
  }

  useEffect(() => {
    checkStatus()
    // Poll status every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkStatus = async () => {
    try {
      const response = await fetch("/api/whatsapp/status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to check status:", error)
    }
  }

  const generateQRCode = async () => {
    setLoading(true)
    setShowQR(true)
    try {
      const response = await fetch("/api/whatsapp/qrcode")
      const data = await response.json()
      
      if (data.qrcode) {
        setQrCode(data.qrcode)
      } else {
        alert("Failed to generate QR code")
      }
    } catch (error) {
      console.error("Failed to generate QR code:", error)
      alert("Failed to generate QR code")
    } finally {
      setLoading(false)
    }
  }

  const refreshStatus = async () => {
    setLoading(true)
    await checkStatus()
    setLoading(false)
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WhatsApp Settings</h1>
          <p className="text-muted-foreground">
            Manage your WhatsApp connection and settings
          </p>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>
                  Current WhatsApp connection status
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshStatus}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-2">Refresh</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {status ? (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {status.connected ? (
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-500" />
                  )}
                  <div>
                    <p className="font-semibold">
                      {status.connected ? "Connected" : "Disconnected"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status: {status.status}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last checked: {new Date(status.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant={status.connected ? "default" : "destructive"}>
                  {status.status}
                </Badge>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {!status?.connected && (
              <Alert>
                <AlertDescription>
                  WhatsApp is not connected. Click the button below to generate a QR code and scan it with your WhatsApp mobile app.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* QR Code Section */}
        {!status?.connected && (
          <Card>
            <CardHeader>
              <CardTitle>Connect WhatsApp</CardTitle>
              <CardDescription>
                Scan the QR code with your WhatsApp mobile app to connect
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showQR ? (
                <Button
                  onClick={generateQRCode}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <QrCode className="h-5 w-5 mr-2" />
                  )}
                  Generate QR Code
                </Button>
              ) : (
                <div className="space-y-4">
                  {qrCode ? (
                    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-white">
                      <img
                        src={qrCode}
                        alt="WhatsApp QR Code"
                        className="w-64 h-64"
                      />
                      <div className="text-center space-y-2">
                        <p className="font-medium">Scan this QR code</p>
                        <ol className="text-sm text-muted-foreground text-left space-y-1">
                          <li>1. Open WhatsApp on your phone</li>
                          <li>2. Tap Menu or Settings</li>
                          <li>3. Tap Linked Devices</li>
                          <li>4. Tap Link a Device</li>
                          <li>5. Point your phone at this screen to scan the code</li>
                        </ol>
                      </div>
                      <Button
                        variant="outline"
                        onClick={generateQRCode}
                        disabled={loading}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate QR Code
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Configuration Info */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              WPPConnect server configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">API URL</p>
                <p className="font-mono">
                  {process.env.NEXT_PUBLIC_WPPCONNECT_API_URL || "Not configured"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Session Name</p>
                <p className="font-mono">
                  {process.env.NEXT_PUBLIC_WPPCONNECT_SESSION_NAME || "default"}
                </p>
              </div>
            </div>
            <Alert>
              <AlertDescription className="text-xs">
                Make sure your WPPConnect server is running and accessible. Configure environment variables in your .env file.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
  )
}
