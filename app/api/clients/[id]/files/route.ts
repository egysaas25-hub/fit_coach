import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/local'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = BigInt(params.id)
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where: any = {
      customer_id: clientId,
    }

    if (category) {
      where.category = category
    }

    const files = await prisma.uploaded_files.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        uploaded_by_team_member: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    })

    return NextResponse.json(
      files.map((file) => ({
        id: file.id.toString(),
        blobUrl: file.blob_url,
        blobId: file.blob_id,
        filename: file.filename,
        contentType: file.content_type,
        size: file.size,
        category: file.category,
        entityType: file.entity_type,
        entityId: file.entity_id?.toString(),
        uploadedBy: file.uploaded_by_team_member
          ? {
              id: file.uploaded_by_team_member.id.toString(),
              name: file.uploaded_by_team_member.full_name,
            }
          : null,
        createdAt: file.created_at,
      }))
    )
  } catch (error) {
    console.error('Error fetching client files:', error)
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    )
  }
}
