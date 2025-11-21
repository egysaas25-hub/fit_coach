"use client"

import { useState, useRef, DragEvent, ChangeEvent } from "react"
import { Upload, X, File as FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils/cn"
import { formatFileSize } from "@/lib/services/file-storage"

export interface FileUploadProps {
  label?: string
  accept?: string
  maxSize?: number
  maxSizeMB?: number
  onFileSelect: (file: File) => void
  onUpload?: (file: File) => Promise<void>
  disabled?: boolean
  error?: string
  className?: string
  children?: React.ReactNode
}

export interface FileUploadState {
  file: File | null
  preview: string | null
  uploading: boolean
  progress: number
  error: string | null
}

export function FileUpload({
  label = "Upload File",
  accept,
  maxSize,
  maxSizeMB,
  onFileSelect,
  onUpload,
  disabled = false,
  error,
  className,
  children,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    preview: null,
    uploading: false,
    progress: 0,
    error: null,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    if (maxSize && file.size > maxSize) {
      const sizeMB = maxSizeMB || Math.round(maxSize / (1024 * 1024))
      return `File size exceeds ${sizeMB}MB limit`
    }

    // Check file type
    if (accept) {
      const acceptedTypes = accept.split(",").map(t => t.trim())
      const fileType = file.type
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith(".")) {
          return fileExtension === type.toLowerCase()
        }
        if (type.endsWith("/*")) {
          const category = type.split("/")[0]
          return fileType.startsWith(category + "/")
        }
        return fileType === type
      })

      if (!isAccepted) {
        return `File type not accepted. Allowed: ${accept}`
      }
    }

    return null
  }

  const handleFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setUploadState(prev => ({ ...prev, error: validationError }))
      return
    }

    setUploadState({
      file,
      preview: null,
      uploading: false,
      progress: 0,
      error: null,
    })

    onFileSelect(file)

    // If onUpload is provided, handle the upload
    if (onUpload) {
      setUploadState(prev => ({ ...prev, uploading: true, progress: 0 }))
      
      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadState(prev => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90),
          }))
        }, 200)

        await onUpload(file)
        
        clearInterval(progressInterval)
        setUploadState(prev => ({ ...prev, uploading: false, progress: 100 }))
      } catch (err) {
        setUploadState(prev => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: err instanceof Error ? err.message : "Upload failed",
        }))
      }
    }
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleRemove = () => {
    setUploadState({
      file: null,
      preview: null,
      uploading: false,
      progress: 0,
      error: null,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const displayError = error || uploadState.error

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-white">{label}</Label>}
      
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          "bg-gray-800/50 border-gray-600",
          isDragging && "border-primary bg-primary/10",
          disabled && "opacity-50 cursor-not-allowed",
          displayError && "border-red-500",
          !uploadState.file && "hover:border-gray-500 hover:bg-gray-800/70"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
          aria-label={label}
        />

        {uploadState.file ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <FileIcon className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {uploadState.file.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatFileSize(uploadState.file.size)}
                  </p>
                </div>
              </div>
              {!uploadState.uploading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove()
                  }}
                  className="flex-shrink-0 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {uploadState.uploading && (
              <div className="space-y-2">
                <Progress value={uploadState.progress} className="h-2" />
                <p className="text-xs text-gray-400 text-center">
                  Uploading... {uploadState.progress}%
                </p>
              </div>
            )}

            {uploadState.progress === 100 && !uploadState.uploading && (
              <p className="text-xs text-green-500 text-center">
                Upload complete!
              </p>
            )}

            {children}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                {isDragging ? "Drop file here" : "Click to upload or drag and drop"}
              </p>
              {accept && (
                <p className="text-xs text-gray-400">
                  Accepted: {accept}
                </p>
              )}
              {maxSizeMB && (
                <p className="text-xs text-gray-400">
                  Max size: {maxSizeMB}MB
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-sm text-red-500" role="alert">
          {displayError}
        </p>
      )}
    </div>
  )
}
