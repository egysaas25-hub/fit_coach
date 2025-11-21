import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { handleAPIError, AppError } from '@/lib/errors';
import {
  deleteFile,
  FileUploadError,
} from '@/lib/services/file-storage';

/**
 * DELETE /api/upload/[blobId]
 * Delete an uploaded file from Vercel Blob storage
 * 
 * Accepts blobId as URL parameter or full blob URL in request body
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { blobId: string } }
) {
  try {
    const session = await getSession(request);

    // Get blobId from URL params
    const { blobId } = params;

    if (!blobId) {
      throw new AppError('Blob ID is required', 400, 'MISSING_BLOB_ID');
    }

    // Check if blobId is a full URL or just an ID
    let blobUrl: string;
    
    if (blobId.startsWith('http://') || blobId.startsWith('https://')) {
      // Full URL provided
      blobUrl = blobId;
    } else {
      // Try to get full URL from request body
      const body = await request.json().catch(() => ({}));
      
      if (body.blobUrl) {
        blobUrl = body.blobUrl;
      } else {
        throw new AppError(
          'Invalid blob identifier. Provide either full blob URL in body or as blobId parameter',
          400,
          'INVALID_BLOB_ID'
        );
      }
    }

    // Delete file from Vercel Blob
    await deleteFile(blobUrl);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });

  } catch (error) {
    // Handle file upload errors (includes delete errors)
    if (error instanceof FileUploadError) {
      return NextResponse.json(
        {
          error: {
            code: 'DELETE_ERROR',
            message: error.message,
          },
        },
        { status: 500 }
      );
    }

    return handleAPIError(error);
  }
}
