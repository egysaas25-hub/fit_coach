"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, CheckCircle2, XCircle, RefreshCw } from "lucide-react"

interface PlanDeliveryButtonProps {
  assignmentId: string
  tenantId: string
  deliveryStatus: string
  clientName: string
  planName: string
  onDeliveryComplete?: () => void
}

export function PlanDeliveryButton({
  assignmentId,
  tenantId,
  deliveryStatus,
  clientName,
  planName,
  onDeliveryComplete,
}: PlanDeliveryButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDelivering, setIsDelivering] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDeliver = async () => {
    setIsDelivering(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/plans/assignments/deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment_id: assignmentId,
          tenant_id: tenantId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Delivery failed")
      }

      setResult(data)
      
      if (onDeliveryComplete) {
        onDeliveryComplete()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsDelivering(false)
    }
  }

  const handleRetry = async () => {
    setIsDelivering(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/plans/assignments/deliver", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignment_id: assignmentId,
          tenant_id: tenantId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Retry failed")
      }

      setResult(data)
      
      if (onDeliveryComplete) {
        onDeliveryComplete()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsDelivering(false)
    }
  }

  const getStatusBadge = () => {
    switch (deliveryStatus) {
      case "delivered":
        return <Badge variant="default" className="bg-green-500">Delivered</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "sent":
        return <Badge variant="default">Sent</Badge>
      default:
        return <Badge variant="outline">{deliveryStatus}</Badge>
    }
  }

  const getButtonContent = () => {
    if (deliveryStatus === "delivered") {
      return (
        <>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Delivered
        </>
      )
    }

    if (deliveryStatus === "failed") {
      return (
        <>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </>
      )
    }

    return (
      <>
        <Send className="h-4 w-4 mr-2" />
        Deliver Now
      </>
    )
  }

  return (
    <>
      <Button
        variant={deliveryStatus === "delivered" ? "outline" : "default"}
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={isDelivering}
      >
        {getButtonContent()}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deliveryStatus === "failed" ? "Retry Plan Delivery" : "Deliver Plan"}
            </DialogTitle>
            <DialogDescription>
              {deliveryStatus === "failed"
                ? "Retry sending the plan to the client"
                : "Send the plan to the client via WhatsApp"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Client:</span>
                <span className="font-medium">{clientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan:</span>
                <span className="font-medium">{planName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                {getStatusBadge()}
              </div>
            </div>

            {result && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="space-y-1">
                    <p className="font-medium">Plan delivered successfully!</p>
                    {result.pdf_url && (
                      <p className="text-sm">
                        PDF:{" "}
                        <a
                          href={result.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          View PDF
                        </a>
                      </p>
                    )}
                    {result.portal_link && (
                      <p className="text-sm">
                        Portal:{" "}
                        <a
                          href={result.portal_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          View in Portal
                        </a>
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!result && !error && (
              <Alert>
                <AlertDescription>
                  This will:
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Generate a PDF of the plan</li>
                    <li>Send it via WhatsApp to the client</li>
                    <li>Create a portal link for online access</li>
                    <li>Set up check-in schedule</li>
                    <li>Dismiss the "Client ready for plans" notification</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            {!result && (
              <Button
                onClick={deliveryStatus === "failed" ? handleRetry : handleDeliver}
                disabled={isDelivering}
              >
                {isDelivering ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {deliveryStatus === "failed" ? "Retrying..." : "Delivering..."}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {deliveryStatus === "failed" ? "Retry Delivery" : "Deliver Now"}
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
