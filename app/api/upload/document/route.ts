import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { handleAPIError, AppError } from '@/lib/errors';
import {
  uploadDocument,
  FileValidationError,
  FileUploadError,
  type UploadMetadata,
} from '@/lib/services/file-storage';
import { prisma } from '@/lib/db/local';

/**
 * POST /api/upload/document
 * Upload a document file with validation
 * 
 * Accepts multipart/form-data with:
 * - file: Document file (PDF, DOC, DOCX, XLS, XLSX, max 25MB)
 * - category: Upload category (document, etc.)
 * - clientId: Optional client ID
 * - filename: Original filename
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string | null;
    const clientId = formData.get('clientId') as string | null;
    const filename = formData.get('filename') as string | null;

    // Validate required fields
    if (!file) {
      throw new AppError('No file provided', 400, 'MISSING_FILE');
    }

    if (!category) {
      throw new AppError('Category is required', 400, 'MISSING_CATEGORY');
    }

    // Validate category
    const validCategories = ['progress-photo', 'exercise-video', 'document', 'profile', 'other'];
    if (!validCategories.includes(category)) {
      throw new AppError(
        `Invalid category. Must be one of: ${validCategories.join(', ')}`,
        400,
        'INVALID_CATEGORY'
      );
    }

    // Build upload metadata
    const metadata: UploadMetadata = {
      category: category as UploadMetadata['category'],
      filename: filename || file.name,
      userId: session.user.id.toString(),
    };

    if (clientId) {
      metadata.clientId = clientId;
    }

    // Upload document
    const result = await uploadDocument(file, metadata);

    // Save file metadata to database
    const entityType = formData.get('entityType') as string | null;
    const entityId = formData.get('entityId') as string | null;

    try {
      await prisma.uploaded_files.create({
        data: {
          tenant_id: BigInt(1), // TODO: Get from session
          blob_url: result.url,
          blob_id: result.pathname,
          filename: metadata.filename,
          content_type: result.contentType,
          size: result.size,
          category: category,
          entity_type: entityType,
          entity_id: entityId ? BigInt(entityId) : null,
          customer_id: clientId ? BigInt(clientId) : null,
          uploaded_by: BigInt(session.user.id),
        },
      });
    } catch (dbError) {
      console.error('Failed to save file metadata to database:', dbError);
      // Continue even if database save fails - file is already uploaded
    }

    return NextResponse.json({
      success: true,
      data: result,
    }, { status: 201 });

  } catch (error) {
    // Handle file validation errors
    if (error instanceof FileValidationError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        },
        { status: 400 }
      );
    }

    // Handle file upload errors
    if (error instanceof FileUploadError) {
      return NextResponse.json(
        {
          error: {
            code: 'UPLOAD_ERROR',
            message: error.message,
          },
        },
        { status: 500 }
      );
    }

    return handleAPIError(error);
  }
}
