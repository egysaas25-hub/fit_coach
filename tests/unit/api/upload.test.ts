import { POST as ImagePOST } from '@/app/api/upload/image/route';
import { POST as VideoPOST } from '@/app/api/upload/video/route';
import { POST as DocumentPOST } from '@/app/api/upload/document/route';
import { DELETE } from '@/app/api/upload/[blobId]/route';
import { NextRequest } from 'next/server';
import * as fileStorage from '@/lib/services/file-storage';

// Mock the session
jest.mock('@/lib/auth/session', () => ({
  getSession: jest.fn().mockResolvedValue({
    user: { id: 1, tenant_id: 1, role: 'trainer' },
  }),
}));

// Mock Prisma
jest.mock('@/lib/db/local', () => ({
  prisma: {
    uploaded_files: {
      create: jest.fn().mockResolvedValue({
        id: BigInt(1),
        tenant_id: BigInt(1),
        blob_url: 'https://blob.vercel-storage.com/test.jpg',
        blob_id: 'test.jpg',
        filename: 'test.jpg',
        content_type: 'image/jpeg',
        size: 1024,
        category: 'progress-photo',
        created_at: new Date(),
      }),
    },
  },
}));

// Mock file storage service
jest.mock('@/lib/services/file-storage', () => ({
  uploadImage: jest.fn(),
  uploadVideo: jest.fn(),
  uploadDocument: jest.fn(),
  deleteFile: jest.fn(),
  FileValidationError: class FileValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'FileValidationError';
    }
  },
  FileUploadError: class FileUploadError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'FileUploadError';
    }
  },
}));

describe('File Upload API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/upload/image', () => {
    it('should upload an image successfully and save to database', async () => {
      const mockResult = {
        url: 'https://blob.vercel-storage.com/test-image.jpg',
        blobId: 'test-image.jpg',
        size: 1024000,
        contentType: 'image/jpeg',
        pathname: 'progress-photo/test-image.jpg',
      };

      (fileStorage.uploadImage as jest.Mock).mockResolvedValue(mockResult);

      const formData = new FormData();
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      formData.append('file', file);
      formData.append('category', 'progress-photo');
      formData.append('filename', 'test.jpg');
      formData.append('clientId', '123');

      const req = new NextRequest('http://localhost:3000/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const response = await ImagePOST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.url).toBe(mockResult.url);
      expect(fileStorage.uploadImage).toHaveBeenCalled();
    });

    it('should return 400 if no file provided', async () => {
      const formData = new FormData();
      formData.append('category', 'progress-photo');

      const req = new NextRequest('http://localhost:3000/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const response = await ImagePOST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should return 400 if category is missing', async () => {
      const formData = new FormData();
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      formData.append('file', file);

      const req = new NextRequest('http://localhost:3000/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const response = await ImagePOST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  describe('POST /api/upload/video', () => {
    it('should upload a video successfully', async () => {
      const mockResult = {
        url: 'https://blob.vercel-storage.com/test-video.mp4',
        blobId: 'test-video.mp4',
        size: 5000000,
        contentType: 'video/mp4',
        pathname: 'exercise-video/test-video.mp4',
      };

      (fileStorage.uploadVideo as jest.Mock).mockResolvedValue(mockResult);

      const formData = new FormData();
      const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
      formData.append('file', file);
      formData.append('category', 'exercise-video');
      formData.append('filename', 'test.mp4');

      const req = new NextRequest('http://localhost:3000/api/upload/video', {
        method: 'POST',
        body: formData,
      });

      const response = await VideoPOST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.url).toBe(mockResult.url);
      expect(fileStorage.uploadVideo).toHaveBeenCalled();
    });
  });

  describe('POST /api/upload/document', () => {
    it('should upload a document successfully', async () => {
      const mockResult = {
        url: 'https://blob.vercel-storage.com/test-doc.pdf',
        blobId: 'test-doc.pdf',
        size: 2000000,
        contentType: 'application/pdf',
        pathname: 'document/test-doc.pdf',
      };

      (fileStorage.uploadDocument as jest.Mock).mockResolvedValue(mockResult);

      const formData = new FormData();
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      formData.append('file', file);
      formData.append('category', 'document');
      formData.append('filename', 'test.pdf');

      const req = new NextRequest('http://localhost:3000/api/upload/document', {
        method: 'POST',
        body: formData,
      });

      const response = await DocumentPOST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.url).toBe(mockResult.url);
      expect(fileStorage.uploadDocument).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/upload/[blobId]', () => {
    it('should delete a file successfully', async () => {
      (fileStorage.deleteFile as jest.Mock).mockResolvedValue(undefined);

      const req = new NextRequest('http://localhost:3000/api/upload/test-blob-id', {
        method: 'DELETE',
        body: JSON.stringify({ blobUrl: 'https://blob.vercel-storage.com/test.jpg' }),
      });

      const response = await DELETE(req, { params: { blobId: 'test-blob-id' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(fileStorage.deleteFile).toHaveBeenCalled();
    });

    it('should return 400 if blobId is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/upload/', {
        method: 'DELETE',
      });

      const response = await DELETE(req, { params: { blobId: '' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });
});
