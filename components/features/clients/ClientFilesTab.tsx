'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileUpload } from '@/components/shared/forms/FileUpload'
import { toast } from 'sonner'
import { Download, FileText, Trash2 } from 'lucide-react'

interface UploadedFile {
  id: string
  blobUrl: string
  filename: string
  contentType: string
  size: number
  category: string
  uploadedBy: {
    id: string
    name: string
  } | null
  createdAt: Date
}

interface ClientFilesTabProps {
  clientId: string
}

export function ClientFilesTab({ clientId }: ClientFilesTabProps) {
  // Fetch client files
  const { data: files, isLoading, error, refetch } = useQuery<UploadedFile[]>({
    queryKey: ['client-files', clientId],
    queryFn: async () => {
      const response = await fetch(`/api/clients/${clientId}/files?category=document`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch files')
      }

      return response.json()
    },
  })

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'document')
      formData.append('clientId', clientId)

      const response = await fetch('/api/upload/document', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to upload file')
      }

      toast.success('Document uploaded successfully')
      refetch()
    } catch (error) {
      toast.error('Failed to upload document')
      throw error
    }
  }

  const handleDelete = async (fileId: string, blobId: string) => {
    try {
      const response = await fetch(`/api/upload/${blobId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }

      toast.success('Document deleted successfully')
      refetch()
    } catch (error) {
      toast.error('Failed to delete document')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Client Documents</h3>
              <p className="text-sm text-muted-foreground">
                Upload and manage documents for this client
              </p>
            </div>
            <FileUpload
              onUpload={handleFileUpload}
              maxSize={25 * 1024 * 1024}
              accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
            />
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Failed to load documents
            </div>
          ) : files && files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No documents uploaded yet. Upload documents to get started!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files?.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {file.filename}
                      </div>
                    </TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>
                      {file.uploadedBy?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(file.createdAt), 'MMM d, yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(file.blobUrl, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(file.id, file.blobUrl.split('/').pop() || '')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  )
}
