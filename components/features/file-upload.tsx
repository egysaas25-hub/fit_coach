import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, X, Image, FileText, AlertCircle, CheckCircle, 
  Loader2, Eye, Download, Trash2 
} from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export default function FileUploadComponent() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'document'>('image');

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  // Validate file
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }

    const allowedTypes = uploadType === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_DOC_TYPES;
    if (!allowedTypes.includes(file.type)) {
      return uploadType === 'image' 
        ? 'Only JPG, PNG, WebP, and HEIC images are allowed'
        : 'Only PDF and Word documents are allowed';
    }

    return null;
  };

  // Simulate upload
  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress } : f
      ));

      if (progress >= 100) {
        clearInterval(interval);
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'success' as const } : f
        ));
      }
    }, 200);
  };

  // Handle file selection
  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: UploadedFile[] = [];

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file);
      const fileId = Math.random().toString(36).substring(7);

      const uploadedFile: UploadedFile = {
        id: fileId,
        file,
        status: error ? 'error' : 'uploading',
        progress: 0,
        error
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, preview: reader.result as string } : f
          ));
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(uploadedFile);

      // Start upload simulation if no error
      if (!error) {
        simulateUpload(fileId);
      }
    });

    setFiles(prev => [...prev, ...newFiles]);
  }, [uploadType]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // Remove file
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Upload Files</h1>
          <p className="text-muted-foreground mt-2">
            Upload progress photos, documents, or other files for your client
          </p>
        </div>

        {/* Upload Type Selector */}
        <div className="flex gap-2">
          <Button
            variant={uploadType === 'image' ? 'default' : 'outline'}
            onClick={() => setUploadType('image')}
          >
            <Image className="w-4 h-4 mr-2" />
            Images
          </Button>
          <Button
            variant={uploadType === 'document' ? 'default' : 'outline'}
            onClick={() => setUploadType('document')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </Button>
        </div>

        {/* Upload Area */}
        <Card>
          <CardContent className="pt-6">
            <div
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive 
                  ? 'border-[#00C26A] bg-[#00C26A]/5' 
                  : 'border-border hover:border-[#00C26A]/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept={uploadType === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
                onChange={(e) => handleFiles(e.target.files)}
              />
              
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                
                <div>
                  <p className="text-lg font-medium">
                    Drop files here or{' '}
                    <label htmlFor="file-upload" className="text-[#00C26A] hover:underline cursor-pointer">
                      browse
                    </label>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {uploadType === 'image' 
                      ? 'Supports: JPG, PNG, WebP, HEIC up to 10MB'
                      : 'Supports: PDF, DOC, DOCX up to 10MB'
                    }
                  </p>
                </div>

                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </label>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Uploaded Files ({files.length})
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiles([])}
                  >
                    Clear All
                  </Button>
                </div>

                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-4 border border-border rounded-lg"
                    >
                      {/* Preview/Icon */}
                      <div className="flex-shrink-0">
                        {file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.file.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.file.size)}
                        </p>

                        {/* Progress Bar */}
                        {file.status === 'uploading' && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Uploading...</span>
                              <span className="font-medium">{file.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#00C26A] transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Success Message */}
                        {file.status === 'success' && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-[#00C26A]">
                            <CheckCircle className="w-4 h-4" />
                            <span>Upload complete</span>
                          </div>
                        )}

                        {/* Error Message */}
                        {file.status === 'error' && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-[#F14A4A]">
                            <AlertCircle className="w-4 h-4" />
                            <span>{file.error}</span>
                          </div>
                        )}
                      </div>

                      {/* Status Icon */}
                      <div className="flex-shrink-0">
                        {file.status === 'uploading' && (
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        )}
                        {file.status === 'success' && (
                          <CheckCircle className="w-5 h-5 text-[#00C26A]" />
                        )}
                        {file.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-[#F14A4A]" />
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex gap-1">
                        {file.status === 'success' && file.preview && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(file.preview, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Tips */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Upload Tips
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• For best results, use well-lit photos taken from the same angle</li>
              <li>• Progress photos should be taken in similar clothing and lighting</li>
              <li>• Files are automatically compressed and optimized</li>
              <li>• All uploads are encrypted and secure</li>
              <li>• Maximum file size: 10MB per file</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}