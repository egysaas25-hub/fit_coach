import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'
import { handleAPIError, AppError } from '@/lib/errors'
import { z } from 'zod'
import { generateCSV, CSVColumn, formatDateTime } from '@/lib/utils/csv-generator'

// Validation schema for bulk export
const bulkExportSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one member ID is required'),
  format: z.enum(['csv', 'pdf']).default('csv'),
})

/**
 * POST /api/teams/members/bulk-export
 * Export multiple team members at once in CSV or PDF format
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request)
    const body = await request.json()

    // Validate input
    const { ids, format } = bulkExportSchema.parse(body)

    // Convert string IDs to BigInt
    const memberIds = ids.map(id => BigInt(id))

    // Fetch team members that belong to the tenant
    const members = await prisma.team_members.findMany({
      where: {
        id: { in: memberIds },
        tenant_id: BigInt(session.user.tenant_id),
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        max_caseload: true,
        active: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    // Check if all requested members were found
    if (members.length === 0) {
      throw new AppError(
        'No team members found with the provided IDs',
        404,
        'MEMBERS_NOT_FOUND'
      )
    }

    if (format === 'csv') {
      // Define CSV columns with custom formatting
      const columns: CSVColumn[] = [
        { key: 'id', header: 'Member ID' },
        { key: 'full_name', header: 'Full Name' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Role' },
        { key: 'max_caseload', header: 'Max Caseload' },
        { 
          key: 'active', 
          header: 'Status',
          formatter: (value) => value ? 'Active' : 'Inactive'
        },
        { 
          key: 'created_at', 
          header: 'Created Date',
          formatter: (value) => formatDateTime(value)
        },
      ]

      // Convert BigInt to string for CSV
      const exportData = members.map(member => ({
        ...member,
        id: member.id.toString(),
      }))

      // Generate CSV content
      const csvContent = generateCSV(exportData, { columns })

      // Return CSV as downloadable file
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv;charset=utf-8;',
          'Content-Disposition': `attachment; filename="team-members-export-${new Date().toISOString().split('T')[0]}.csv"`,
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
