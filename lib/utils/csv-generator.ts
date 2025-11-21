/**
 * CSV Generator Utility
 * 
 * Provides functions to generate CSV files from data arrays with proper formatting,
 * headers, and timestamp-based filenames.
 */

export interface CSVColumn {
  key: string
  header: string
  formatter?: (value: any) => string
}

export interface CSVOptions {
  filename?: string
  columns?: CSVColumn[]
  includeTimestamp?: boolean
}

/**
 * Escapes CSV values to handle commas, quotes, and newlines
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return ''
  }

  const stringValue = String(value)
  
  // If value contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  
  return stringValue
}

/**
 * Generates a CSV string from an array of data objects
 * 
 * @param data - Array of objects to convert to CSV
 * @param options - Configuration options for CSV generation
 * @returns CSV string
 */
export function generateCSV(data: any[], options: CSVOptions = {}): string {
  if (!data || data.length === 0) {
    return ''
  }

  const { columns } = options

  // If columns are specified, use them; otherwise infer from first object
  let headers: string[]
  let keys: string[]
  let formatters: Map<string, (value: any) => string>

  if (columns && columns.length > 0) {
    headers = columns.map(col => col.header)
    keys = columns.map(col => col.key)
    formatters = new Map(
      columns
        .filter(col => col.formatter)
        .map(col => [col.key, col.formatter!])
    )
  } else {
    // Infer columns from first data object
    const firstItem = data[0]
    keys = Object.keys(firstItem)
    headers = keys.map(key => 
      // Convert camelCase to Title Case
      key.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim()
    )
    formatters = new Map()
  }

  // Build CSV rows
  const rows: string[] = []

  // Add header row
  rows.push(headers.map(escapeCSVValue).join(','))

  // Add data rows
  for (const item of data) {
    const row = keys.map(key => {
      const value = item[key]
      const formatter = formatters.get(key)
      const formattedValue = formatter ? formatter(value) : value
      return escapeCSVValue(formattedValue)
    })
    rows.push(row.join(','))
  }

  return rows.join('\n')
}

/**
 * Downloads a CSV file in the browser
 * 
 * @param data - Array of objects to convert to CSV
 * @param options - Configuration options including filename
 */
export function downloadCSV(data: any[], options: CSVOptions = {}): void {
  const csvContent = generateCSV(data, options)
  
  if (!csvContent) {
    console.warn('No data to export')
    return
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0]
  const baseFilename = options.filename || 'export'
  const filename = options.includeTimestamp !== false
    ? `${baseFilename}-${timestamp}.csv`
    : `${baseFilename}.csv`

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  // Check for IE-specific API
  if ((navigator as any).msSaveBlob) {
    // IE 10+
    ;(navigator as any).msSaveBlob(blob, filename)
  } else {
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(link.href), 100)
  }
}

/**
 * Formats a number as currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formats a number as percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`
}

/**
 * Formats a date to ISO string
 */
export function formatDate(value: Date | string | null): string {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toISOString().split('T')[0]
}

/**
 * Formats a date to readable format
 */
export function formatDateTime(value: Date | string | null): string {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
