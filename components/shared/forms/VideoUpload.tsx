"use client"

import { useState, useRef } from "react"
import { Video, X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils/cn"
import { formatFileSize, getFileSizeLimits } from "@/lib/services/file-storage"

export interface VideoUploadProps {
  label?: string
  onVideoSelect: (file: File) => void
  onUpload?: (file: File) => Promise<{ url: string }>
  disabled?: boolean
  error?: string
  className?: string
  showPreview?: boolean
}

interface UploadState {
  file: File | null
  preview: string | null
  uploading: boolean
  progress: number
  error: string | null
  uploadedUrl: string | null
  duration: number | null
}

export function VideoUpload({
  label = "Upload Video",
  onVideoSelect,
  onUpload,
  disabled = false,
  error,
  className,
  showPreview = true,
}: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    preview: null,
    uploading: false,
    progress: 0,
    error: null,
    uploadedUrl: null,
    duration: null,
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  const limits = getFileSizeLimits()

  const validateVideo = (file: File): string | null => {
    // Check file type
    const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"]
    if (!allowedTypes.includes(file.type)) {
      return "Invalid video type. Allowed: MP4, MOV, AVI"
    }

    // Check file size
    if (file.size > limits.video) {
      return `Video size exceeds ${limits.videoMB}MB limit`
    }

    return null
  }

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")
      video.preload = "metadata"

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        resolve(video.duration)
      }

      video.onerror = () => {
        reject(new Error("Failed to load video metadata"))
      }

      video.src = URL.createObjectURL(file)
    })
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleVideo = async (file: File) => {
    const validationError = validateVideo(file)
    if (validationError) {
      setUploadState(prev => ({ ...prev, error: validationError }))
      return
    }

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      
      // Get video duration
      let duration: number | null = null
      try {
        duration = await getVideoDuration(file)
      } catch (err) {
        console.warn("Failed to get video duration:", err)
      }
      
      setUploadState({
        file,
        preview: previewUrl,
        uploading: false,
        progress: 0,
        error: null,
        uploadedUrl: null,
        duration,
      })

      onVideoSelect(file)

      // If onUpload is provided, handle the upload
      if (onUpload) {
        setUploadState(prev => ({ ...prev, uploading: true, progress: 0 }))
        
        // Simulate progress for large files
        const progressInterval = setInterval(() => {
          setUploadState(prev => ({
            ...prev,
            progress: Math.min(prev.progress + 5, 90),
          }))
        }, 500)

        const result = await onUpload(file)
        
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
        error: err instanceof Error ? err.message : "Failed to process video",
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
    if (files.length > 0 && files[0].type.startsWith("video/")) {
      handleVideo(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleVideo(files[0])
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
      duration: null,
    })
  }

  const handleClick = () => {
    if (!disabled && !uploadState.uploading) {
      document.getElementById("video-upload-input")?.click()
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
          id="video-upload-input"
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo"
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
          aria-label={label}
        />

        {uploadState.preview && showPreview ? (
          <div className="relative">
            <video
              ref={videoRef}
              src={uploadState.preview}
              controls
              className="w-full h-auto max-h-96 bg-black"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
            
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
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400">
                    {formatFileSize(uploadState.file.size)}
                  </p>
                  {uploadState.duration && (
                    <p className="text-xs text-gray-400">
                      {formatDuration(uploadState.duration)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {uploadState.uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="w-full max-w-xs px-6 space-y-2">
                  <Progress value={uploadState.progress} className="h-2" />
                  <p className="text-xs text-white text-center">
                    Uploading... {uploadState.progress}%
                  </p>
                  <p className="text-xs text-gray-400 text-center">
                    This may take a while for large videos
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
                <div className="w-12 h-12 rounded bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Play className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {uploadState.file.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-gray-400">
                      {formatFileSize(uploadState.file.size)}
                    </p>
                    {uploadState.duration && (
                      <p className="text-xs text-gray-400">
                        {formatDuration(uploadState.duration)}
                      </p>
                    )}
                  </div>
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
              <Video className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                {isDragging ? "Drop video here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-400">
                MP4, MOV, or AVI
              </p>
              <p className="text-xs text-gray-400">
                Max size: {limits.videoMB}MB
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
