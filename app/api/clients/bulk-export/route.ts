import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'
import { handleAPIError, AppError } from '@/lib/errors'
import { z } from 'zod'
import { generateCSV, CSVColumn, formatDate, formatDateTime } from '@/lib/utils/csv-generator'

// Validation schema for bulk export
const bulkExportSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one client ID is required'),
  format: z.enum(['csv', 'pdf']).default('csv'),
})

/**
 * POST /api/clients/bulk-export
 * Export multiple clients at once in CSV or PDF format
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request)
    const body = await request.json()

    // Validate input
    const { ids, format } = bulkExportSchema.parse(body)

    // Convert string IDs to BigInt
    const clientIds = ids.map(id => BigInt(id))

    // Fetch clients that belong to the tenant
    const clients = await prisma.customers.findMany({
      where: {
        id: { in: clientIds },
        tenant_id: BigInt(session.user.tenant_id),
      },
      select: {
        id: true,
        phone_e164: true,
        first_name: true,
        last_name: true,
        gender: true,
        age: true,
        status: true,
        goal: true,
        source: true,
        region: true,
        language: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    // Check if all requested clients were found
    if (clients.length === 0) {
      throw new AppError(
        'No clients found with the provided IDs',
        404,
        'CLIENTS_NOT_FOUND'
      )
    }

    if (format === 'csv') {
      // Define CSV columns with custom formatting
      const columns: CSVColumn[] = [
        { key: 'id', header: 'Client ID' },
        { key: 'first_name', header: 'First Name' },
        { key: 'last_name', header: 'Last Name' },
        { key: 'phone_e164', header: 'Phone' },
        { key: 'gender', header: 'Gender' },
        { key: 'age', header: 'Age' },
        { key: 'status', header: 'Status' },
        { key: 'goal', header: 'Goal' },
        { key: 'source', header: 'Source' },
        { key: 'region', header: 'Region' },
        { key: 'language', header: 'Language' },
        { 
          key: 'created_at', 
          header: 'Created Date',
          formatter: (value) => formatDateTime(value)
        },
        { 
          key: 'updated_at', 
          header: 'Last Updated',
          formatter: (value) => formatDateTime(value)
        },
      ]

      // Convert BigInt to string for CSV
      const exportData = clients.map(client => ({
        ...client,
        id: client.id.toString(),
      }))

      // Generate CSV content
      const csvContent = generateCSV(exportData, { columns })

      // Return CSV as downloadable file
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv;charset=utf-8;',
          'Content-Disposition': `attachment; filename="clients-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    } else {
      // PDF export - to be implemented in future
      throw new AppError(
        'PDF export is not yet implemented. Please use CSV format.',
        501,
        'NOT_IMPLEMENTED'
      )
    }
  } catch (error) {
    return handleAPIError(error)
  }
}
