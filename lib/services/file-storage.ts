/**
 * File Storage Service using Vercel Blob
 * 
 * Handles file uploads (images, videos, documents) with validation,
 * size limits, and error handling.
 */

import { put, del } from '@vercel/blob';

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  document: 25 * 1024 * 1024, // 25MB
};

// Allowed file types
const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
};

// File extensions mapping
const FILE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'video/mp4': '.mp4',
  'video/quicktime': '.mov',
  'video/x-msvideo': '.avi',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
};

/**
 * Upload metadata interface
 */
export interface UploadMetadata {
  clientId?: string;
  category: 'progress-photo' | 'exercise-video' | 'document' | 'profile' | 'other';
  filename: string;
  userId?: string;
}

/**
 * Upload result interface
 */
export interface UploadResult {
  url: string;
  blobId: string;
  size: number;
  contentType: string;
  pathname: string;
}

/**
 * File validation error
 */
export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileValidationError';
  }
}

/**
 * File upload error
 */
export class FileUploadError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'FileUploadError';
  }
}

/**
 * Validate file type
 */
function validateFileType(
  file: File,
  allowedTypes: string[],
  fileCategory: string
): void {
  if (!allowedTypes.includes(file.type)) {
    throw new FileValidationError(
      `Invalid ${fileCategory} type. Allowed types: ${allowedTypes.join(', ')}`
    );
  }
}

/**
 * Validate file size
 */
function validateFileSize(
  file: File,
  maxSize: number,
  fileCategory: string
): void {
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    throw new FileValidationError(
      `File size exceeds ${maxSizeMB}MB limit for ${fileCategory}`
    );
  }
}

/**
 * Generate unique filename with timestamp
 */
function generateFilename(originalFilename: string, contentType: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = FILE_EXTENSIONS[contentType] || '';
  const baseName = originalFilename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars
    .substring(0, 50); // Limit length
  
  return `${baseName}-${timestamp}-${randomStr}${extension}`;
}

/**
 * Build blob pathname based on metadata
 */
function buildPathname(metadata: UploadMetadata, filename: string): string {
  const parts: string[] = [metadata.category];
  
  if (metadata.clientId) {
    parts.push(metadata.clientId);
  }
  
  parts.push(filename);
  
  return parts.join('/');
}

/**
 * Upload image file with validation
 * 
 * @param file - Image file to upload
 * @param metadata - Upload metadata
 * @returns Upload result with URL and metadata
 */
export async function uploadImage(
  file: File,
  metadata: UploadMetadata
): Promise<UploadResult> {
  try {
    // Validate file type
    validateFileType(file, ALLOWED_FILE_TYPES.image, 'image');
    
    // Validate file size
    validateFileSize(file, FILE_SIZE_LIMITS.image, 'image');
    
    // Generate unique filename
    const filename = generateFilename(metadata.filename, file.type);
    const pathname = buildPathname(metadata, filename);
    
    // Check if Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new FileUploadError(
        'Blob storage is not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.'
      );
    }
    
    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    return {
      url: blob.url,
      blobId: blob.url.split('/').pop() || '',
      size: file.size,
      contentType: file.type,
      pathname: blob.pathname,
    };
  } catch (error) {
    if (error instanceof FileValidationError) {
      throw error;
    }
    
    throw new FileUploadError(
      'Failed to upload image. Please try again.',
      error
    );
  }
}

/**
 * Upload video file with validation
 * 
 * @param file - Video file to upload
 * @param metadata - Upload metadata
 * @returns Upload result with URL and metadata
 */
export async function uploadVideo(
  file: File,
  metadata: UploadMetadata
): Promise<UploadResult> {
  try {
    // Validate file type
    validateFileType(file, ALLOWED_FILE_TYPES.video, 'video');
    
    // Validate file size
    validateFileSize(file, FILE_SIZE_LIMITS.video, 'video');
    
    // Generate unique filename
    const filename = generateFilename(metadata.filename, file.type);
    const pathname = buildPathname(metadata, filename);
    
    // Check if Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new FileUploadError(
        'Blob storage is not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.'
      );
    }
    
    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    return {
      url: blob.url,
      blobId: blob.url.split('/').pop() || '',
      size: file.size,
      contentType: file.type,
      pathname: blob.pathname,
    };
  } catch (error) {
    if (error instanceof FileValidationError) {
      throw error;
    }
    
    throw new FileUploadError(
      'Failed to upload video. Please try again.',
      error
    );
  }
}

/**
 * Upload document file with validation
 * 
 * @param file - Document file to upload
 * @param metadata - Upload metadata
 * @returns Upload result with URL and metadata
 */
export async function uploadDocument(
  file: File,
  metadata: UploadMetadata
): Promise<UploadResult> {
  try {
    // Validate file type
    validateFileType(file, ALLOWED_FILE_TYPES.document, 'document');
    
    // Validate file size
    validateFileSize(file, FILE_SIZE_LIMITS.document, 'document');
    
    // Generate unique filename
    const filename = generateFilename(metadata.filename, file.type);
    const pathname = buildPathname(metadata, filename);
    
    // Check if Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new FileUploadError(
        'Blob storage is not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.'
      );
    }
    
    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    return {
      url: blob.url,
      blobId: blob.url.split('/').pop() || '',
      size: file.size,
      contentType: file.type,
      pathname: blob.pathname,
    };
  } catch (error) {
    if (error instanceof FileValidationError) {
      throw error;
    }
    
    throw new FileUploadError(
      'Failed to upload document. Please try again.',
      error
    );
  }
}

/**
 * Delete file from Vercel Blob storage
 * 
 * @param blobUrl - Full URL of the blob to delete
 */
export async function deleteFile(blobUrl: string): Promise<void> {
  try {
    // Check if Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new FileUploadError(
        'Blob storage is not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.'
      );
    }
    
    // Delete from Vercel Blob
    await del(blobUrl);
  } catch (error) {
    throw new FileUploadError(
      'Failed to delete file. Please try again.',
      error
    );
  }
}

/**
 * Get file size limits for display
 */
export function getFileSizeLimits() {
  return {
    image: FILE_SIZE_LIMITS.image,
    video: FILE_SIZE_LIMITS.video,
    document: FILE_SIZE_LIMITS.document,
    imageMB: Math.round(FILE_SIZE_LIMITS.image / (1024 * 1024)),
    videoMB: Math.round(FILE_SIZE_LIMITS.video / (1024 * 1024)),
    documentMB: Math.round(FILE_SIZE_LIMITS.document / (1024 * 1024)),
  };
}

/**
 * Get allowed file types for display
 */
export function getAllowedFileTypes() {
  return ALLOWED_FILE_TYPES;
}

/**
 * Check if file type is allowed for category
 */
export function isFileTypeAllowed(
  fileType: string,
  category: 'image' | 'video' | 'document'
): boolean {
  return ALLOWED_FILE_TYPES[category].includes(fileType);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
