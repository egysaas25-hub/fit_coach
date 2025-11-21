# File Storage Service

This service provides file upload functionality using Vercel Blob Storage.

## Setup

1. Install the package (already done):
```bash
pnpm add @vercel/blob
```

2. Configure environment variable in `.env`:
```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_your-token-here"
```

To get your token:
- Go to your Vercel project dashboard
- Navigate to Storage → Blob
- Create a new Blob store or use existing
- Copy the `BLOB_READ_WRITE_TOKEN`

## Usage

### Upload Image

```typescript
import { uploadImage } from '@/lib/services/file-storage';

const file = // File from input
const result = await uploadImage(file, {
  category: 'progress-photo',
  filename: file.name,
  clientId: 'client-123',
});

console.log(result.url); // https://blob.vercel-storage.com/...
```

### Upload Video

```typescript
import { uploadVideo } from '@/lib/services/file-storage';

const file = // File from input
const result = await uploadVideo(file, {
  category: 'exercise-video',
  filename: file.name,
});

console.log(result.url);
```

### Upload Document

```typescript
import { uploadDocument } from '@/lib/services/file-storage';

const file = // File from input
const result = await uploadDocument(file, {
  category: 'document',
  filename: file.name,
  clientId: 'client-123',
});

console.log(result.url);
```

### Delete File

```typescript
import { deleteFile } from '@/lib/services/file-storage';

await deleteFile('https://blob.vercel-storage.com/...');
```

## File Limits

- **Images**: 10MB max, formats: JPG, PNG, WebP
- **Videos**: 100MB max, formats: MP4, MOV, AVI
- **Documents**: 25MB max, formats: PDF, DOC, DOCX, XLS, XLSX

## Error Handling

```typescript
import { 
  uploadImage, 
  FileValidationError, 
  FileUploadError 
} from '@/lib/services/file-storage';

try {
  const result = await uploadImage(file, metadata);
  // Success
} catch (error) {
  if (error instanceof FileValidationError) {
    // Invalid file type or size
    console.error('Validation error:', error.message);
  } else if (error instanceof FileUploadError) {
    // Upload failed
    console.error('Upload error:', error.message);
  }
}
```

## Utility Functions

```typescript
import { 
  getFileSizeLimits,
  getAllowedFileTypes,
  isFileTypeAllowed,
  formatFileSize 
} from '@/lib/services/file-storage';

// Get size limits
const limits = getFileSizeLimits();
console.log(limits.imageMB); // 10

// Get allowed types
const types = getAllowedFileTypes();
console.log(types.image); // ['image/jpeg', 'image/jpg', ...]

// Check if type is allowed
const isAllowed = isFileTypeAllowed('image/jpeg', 'image'); // true

// Format file size
const formatted = formatFileSize(1024 * 1024); // "1 MB"
```

## File Organization

Files are organized in Blob storage with the following structure:

```
{category}/{clientId?}/{filename-timestamp-random}.ext
```

Examples:
- `progress-photo/client-123/photo-1234567890-abc123.jpg`
- `exercise-video/squat-demo-1234567890-xyz789.mp4`
- `document/client-456/report-1234567890-def456.pdf`
```
