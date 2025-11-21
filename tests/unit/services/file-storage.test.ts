import {
  uploadImage,
  uploadVideo,
  uploadDocument,
  deleteFile,
  FileValidationError,
  FileUploadError,
  getFileSizeLimits,
  getAllowedFileTypes,
  isFileTypeAllowed,
  formatFileSize,
} from '@/lib/services/file-storage';

// Mock @vercel/blob
jest.mock('@vercel/blob', () => ({
  put: jest.fn(),
  del: jest.fn(),
}));

describe('File Storage Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('uploadImage', () => {
    it('should throw error if BLOB_READ_WRITE_TOKEN is not configured', async () => {
      delete process.env.BLOB_READ_WRITE_TOKEN;

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const metadata = {
        category: 'progress-photo' as const,
        filename: 'test.jpg',
      };

      await expect(uploadImage(file, metadata)).rejects.toThrow(FileUploadError);
      await expect(uploadImage(file, metadata)).rejects.toThrow(
        'Blob storage is not configured'
      );
    });

    it('should throw FileValidationError for invalid file type', async () => {
      process.env.BLOB_READ_WRITE_TOKEN = 'test-token';

      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const metadata = {
        category: 'progress-photo' as const,
        filename: 'test.txt',
      };

      await expect(uploadImage(file, metadata)).rejects.toThrow(FileValidationError);
    });

    it('should throw FileValidationError for oversized file', async () => {
      process.env.BLOB_READ_WRITE_TOKEN = 'test-token';

      // Create a file larger than 10MB
      const largeBuffer = new ArrayBuffer(11 * 1024 * 1024);
      const file = new File([largeBuffer], 'large.jpg', { type: 'image/jpeg' });
      const metadata = {
        category: 'progress-photo' as const,
        filename: 'large.jpg',
      };

      await expect(uploadImage(file, metadata)).rejects.toThrow(FileValidationError);
      await expect(uploadImage(file, metadata)).rejects.toThrow('exceeds 10MB limit');
    });

    it('should upload valid image successfully', async () => {
      process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
      const { put } = require('@vercel/blob');

      const mockBlobResult = {
        url: 'https://blob.vercel-storage.com/progress-photo/test-123.jpg',
        pathname: 'progress-photo/test-123.jpg',
      };
      put.mockResolvedValue(mockBlobResult);

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const metadata = {
        category: 'progress-photo' as const,
        filename: 'test.jpg',
        clientId: 'client-123',
      };

      const result = await uploadImage(file, metadata);

      expect(result.url).toBe(mockBlobResult.url);
      expect(result.contentType).toBe('image/jpeg');
      expect(result.size).toBe(4); // 'test' is 4 bytes
      expect(put).toHaveBeenCalledWith(
        expect.stringContaining('progress-photo/client-123/test'),
        file,
        { access: 'public', addRandomSuffix: false }
      );
    });
  });

  describe('uploadVideo', () => {
    it('should throw FileValidationError for invalid video type', async () => {
      process.env.BLOB_READ_WRITE_TOKEN = 'test-token';

      const file = new File(['test'], 'test.avi', { type: 'video/avi' });
      const metadata = {
        category: 'exercise-video' as const,
        filename: 'test.avi',
      };

      await expect(uploadVideo(file, metadata)).rejects.toThrow(FileValidationError);
    });

    it('should upload valid video successfully', async () => {
      process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
      const { put } = require('@vercel/blob');

      const mockBlobResult = {
        url: 'https://blob.vercel-storage.com/exercise-video/test-123.mp4',
        pathname: 'exercise-video/test-123.mp4',
      };
      put.mockResolvedValue(mockBlobResult);

      const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
      const metadata = {
        category: 'exercise-video' as const,
        filename: 'test.mp4',
      };

      const result = await uploadVideo(file, metadata);

      expect(result.url).toBe(mockBlobResult.url);
      expect(result.contentType).toBe('video/mp4');
      expect(put).toHaveBeenCalled();
    });
  });

  describe('uploadDocument', () => {
    it('should upload valid PDF successfully', async () => {
      process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
      const { put } = require('@vercel/blob');

      const mockBlobResult = {
        url: 'https://blob.vercel-storage.com/document/test-123.pdf',
        pathname: 'document/test-123.pdf',
      };
      put.mockResolvedValue(mockBlobResult);

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const metadata = {
        category: 'document' as const,
        filename: 'test.pdf',
      };

      const result = await uploadDocument(file, metadata);

      expect(result.url).toBe(mockBlobResult.url);
      expect(result.contentType).toBe('application/pdf');
      expect(put).toHaveBeenCalled();
    });
  });

  describe('deleteFile', () => {
    it('should throw error if BLOB_READ_WRITE_TOKEN is not configured', async () => {
      delete process.env.BLOB_READ_WRITE_TOKEN;

      await expect(deleteFile('https://blob.vercel-storage.com/test.jpg')).rejects.toThrow(
        FileUploadError
      );
    });

    it('should delete file successfully', async () => {
      process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
      const { del } = require('@vercel/blob');

      await deleteFile('https://blob.vercel-storage.com/test.jpg');

      expect(del).toHaveBeenCalledWith('https://blob.vercel-storage.com/test.jpg');
    });
  });

  describe('Utility functions', () => {
    it('should return file size limits', () => {
      const limits = getFileSizeLimits();

      expect(limits.imageMB).toBe(10);
      expect(limits.videoMB).toBe(100);
      expect(limits.documentMB).toBe(25);
    });

    it('should return allowed file types', () => {
      const types = getAllowedFileTypes();

      expect(types.image).toContain('image/jpeg');
      expect(types.video).toContain('video/mp4');
      expect(types.document).toContain('application/pdf');
    });

    it('should check if file type is allowed', () => {
      expect(isFileTypeAllowed('image/jpeg', 'image')).toBe(true);
      expect(isFileTypeAllowed('video/mp4', 'video')).toBe(true);
      expect(isFileTypeAllowed('application/pdf', 'document')).toBe(true);
      expect(isFileTypeAllowed('text/plain', 'image')).toBe(false);
    });

    it('should format file size correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });
});
