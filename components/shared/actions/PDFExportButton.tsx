"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface PDFExportButtonProps {
  endpoint: string
  payload: Record<string, any>
  filename?: string
  label?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function PDFExportButton({
  endpoint,
  payload,
  filename = "document.pdf",
  label = "Export PDF",
  variant = "default",
  size = "default",
  className,
  onSuccess,
  onError,
}: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate PDF")
      }

      const data = await response.json()

      if (!data.pdfUrl) {
        throw new Error("PDF URL not received")
      }

      // Trigger download
      const link = document.createElement("a")
      link.href = data.pdfUrl
      link.download = filename
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("PDF downloaded successfully")
      onSuccess?.()
    } catch (error) {
      console.error("Error exporting PDF:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Failed to export PDF"
      toast.error(errorMessage)
      onError?.(error instanceof Error ? error : new Error(errorMessage))
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant={variant}
      size={size}
      className={cn(className)}
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          {label}
        </>
      )}
    </Button>
  )
}
