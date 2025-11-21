"use client"

import { useState, useCallback } from "react"
import { Image as ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils/cn"
import { formatFileSize, getFileSizeLimits } from "@/lib/services/file-storage"

export interface ImageUploadProps {
  label?: string
  onImageSelect: (file: File) => void
  onUpload?: (file: File) => Promise<{ url: string }>
  disabled?: boolean
  error?: string
  className?: string
  maxWidth?: number
  maxHeight?: number
  quality?: number
  showPreview?: boolean
}

interface UploadState {
  file: File | null
  preview: string | null
  uploading: boolean
  progress: number
  error: string | null
  uploadedUrl: string | null
}

export function ImageUpload({
  label = "Upload Image",
  onImageSelect,
  onUpload,
  disabled = false,
  error,
  className,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.85,
  showPreview = true,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    preview: null,
    uploading: false,
    progress: 0,
    error: null,
    uploadedUrl: null,
  })

  const limits = getFileSizeLimits()

  // Compress image on client side
  const compressImage = useCallback(
    (file: File): Promise<File> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = (e) => {
          const img = new Image()
          
          img.onload = () => {
            const canvas = document.createElement("canvas")
            let { width, height } = img

            // Calculate new dimensions while maintaining aspect ratio
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height)
              width = Math.round(width * ratio)
              height = Math.round(height * ratio)
            }

            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext("2d")
            if (!ctx) {
              reject(new Error("Failed to get canvas context"))
              return
            }

            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height)
            
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Failed to compress image"))
                  return
                }

                // Create new file from blob
                const compressedFile = new File(
                  [blob],
                  file.name,
                  {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  }
                )

                resolve(compressedFile)
              },
              "image/jpeg",
              quality
            )
          }

          img.onerror = () => {
            reject(new Error("Failed to load image"))
          }

          img.src = e.target?.result as string
        }

        reader.onerror = () => {
          reject(new Error("Failed to read file"))
        }

        reader.readAsDataURL(file)
      })
    },
    [maxWidth, maxHeight, quality]
  )

  const validateImage = (file: File): string | null => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return "Invalid image type. Allowed: JPG, PNG, WebP"
    }

    // Check file size
    if (file.size > limits.image) {
      return `Image size exceeds ${limits.imageMB}MB limit`
    }

    return null
  }

  const handleImage = async (file: File) => {
    const validationError = validateImage(file)
    if (validationError) {
      setUploadState(prev => ({ ...prev, error: validationError }))
      return
    }

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      
      setUploadState({
        file,
        preview: previewUrl,
        uploading: false,
        progress: 0,
        error: null,
        uploadedUrl: null,
      })

      // Compress image
      const compressedFile = await compressImage(file)
      
      // Update with compressed file
      setUploadState(prev => ({
        ...prev,
        file: compressedFile,
      }))

      onImageSelect(compressedFile)

      // If onUpload is provided, handle the upload
      if (onUpload) {
        setUploadState(prev => ({ ...prev, uploading: true, progress: 0 }))
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadState(prev => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90),
          }))
        }, 200)

        const result = await onUpload(compressedFile)
        
        clearInterval(progressInterval)
        setUploadState(prev => ({
          ...prev,
          uploading: false,
          progress: 100,
          uploadedUrl: result.url,
        }))
      }
    } catch (err) {
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: err instanceof Error ? err.message : "Failed to process image",
      }))
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      handleImage(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleImage(files[0])
    }
  }

  const handleRemove = () => {
    if (uploadState.preview) {
      URL.revokeObjectURL(uploadState.preview)
    }
    setUploadState({
      file: null,
      preview: null,
      uploading: false,
      progress: 0,
      error: null,
      uploadedUrl: null,
    })
  }

  const handleClick = () => {
    if (!disabled && !uploadState.uploading) {
      document.getElementById("image-upload-input")?.click()
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
          "relative border-2 border-dashed rounded-lg transition-colors cursor-pointer overflow-hidden",
          "bg-gray-800/50 border-gray-600",
          isDragging && "border-primary bg-primary/10",
          disabled && "opacity-50 cursor-not-allowed",
          displayError && "border-red-500",
          !uploadState.preview && "p-6 hover:border-gray-500 hover:bg-gray-800/70"
        )}
      >
        <input
          id="image-upload-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
          aria-label={label}
        />

        {uploadState.preview && showPreview ? (
          <div className="relative">
            <img
              src={uploadState.preview}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain"
            />
            
            {!uploadState.uploading && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}

            {uploadState.file && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-3">
                <p className="text-xs text-white truncate">
                  {uploadState.file.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatFileSize(uploadState.file.size)}
                  {uploadState.file.size < limits.image * 0.5 && " (compressed)"}
                </p>
              </div>
            )}

            {uploadState.uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="w-full max-w-xs px-6 space-y-2">
                  <Progress value={uploadState.progress} className="h-2" />
                  <p className="text-xs text-white text-center">
                    Uploading... {uploadState.progress}%
                  </p>
                </div>
              </div>
            )}

            {uploadState.progress === 100 && !uploadState.uploading && (
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                ✓ Uploaded
              </div>
            )}
          </div>
        ) : uploadState.file && !showPreview ? (
          <div className="p-6 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <ImageIcon className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />
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
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                {isDragging ? "Drop image here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG, or WebP
              </p>
              <p className="text-xs text-gray-400">
                Max size: {limits.imageMB}MB (auto-compressed)
              </p>
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
