import { useState } from 'react'
import { toast } from 'sonner'

interface UseBulkExportOptions {
  endpoint: string
  entityName: string
  format?: 'csv' | 'pdf'
}

/**
 * Custom hook for handling bulk export operations
 * Provides state management and API calls for exporting multiple items
 */
export function useBulkExport({
  endpoint,
  entityName,
  format = 'csv',
}: UseBulkExportOptions) {
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Execute bulk export
   * @param ids - Array of entity IDs to export
   */
  const executeBulkExport = async (ids: string[]) => {
    if (!ids || ids.length === 0) {
      toast.error('No items selected for export')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids, format }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || 'Export failed')
      }

      // Get the filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `${entityName}-export-${new Date().toISOString().split('T')[0]}.${format}`
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Get the blob data
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the URL object
      setTimeout(() => window.URL.revokeObjectURL(url), 100)

      toast.success(`Successfully exported ${ids.length} ${entityName}${ids.length !== 1 ? 's' : ''}`)
    } catch (error) {
      console.error('Bulk export error:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : `Failed to export ${entityName}s`
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    executeBulkExport,
  }
}
