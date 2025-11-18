"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeftRight,
  Calendar,
  Download,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ProgressPhoto {
  id: string
  photo_url: string
  photo_type: "front" | "side" | "back"
  recorded_at: Date
  weight_kg?: number
  body_fat_percent?: number
  notes?: string
}

interface ProgressPhotoComparisonProps {
  photos: ProgressPhoto[]
  clientName: string
}

export function ProgressPhotoComparison({
  photos,
  clientName,
}: ProgressPhotoComparisonProps) {
  const [selectedPhotoType, setSelectedPhotoType] = useState<string>("front")
  const [beforePhoto, setBeforePhoto] = useState<ProgressPhoto | null>(null)
  const [afterPhoto, setAfterPhoto] = useState<ProgressPhoto | null>(null)
  const [comparisonMode, setComparisonMode] = useState<"side-by-side" | "slider" | "overlay">("side-by-side")
  const [sliderPosition, setSliderPosition] = useState(50)
  const [overlayOpacity, setOverlayOpacity] = useState(50)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(100)

  // Filter photos by type
  const filteredPhotos = photos.filter(
    (p) => p.photo_type === selectedPhotoType
  )

  // Sort by date
  const sortedPhotos = [...filteredPhotos].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  )

  // Auto-select first and last photos
  if (!beforePhoto && sortedPhotos.length > 0) {
    setBeforePhoto(sortedPhotos[0])
  }
  if (!afterPhoto && sortedPhotos.length > 1) {
    setAfterPhoto(sortedPhotos[sortedPhotos.length - 1])
  }

  // Calculate progress
  const calculateProgress = () => {
    if (!beforePhoto || !afterPhoto) return null

    const weightChange = afterPhoto.weight_kg && beforePhoto.weight_kg
      ? afterPhoto.weight_kg - beforePhoto.weight_kg
      : null

    const bodyFatChange = afterPhoto.body_fat_percent && beforePhoto.body_fat_percent
      ? afterPhoto.body_fat_percent - beforePhoto.body_fat_percent
      : null

    const daysBetween = Math.floor(
      (new Date(afterPhoto.recorded_at).getTime() - new Date(beforePhoto.recorded_at).getTime()) /
        (1000 * 60 * 60 * 24)
    )

    return { weightChange, bodyFatChange, daysBetween }
  }

  const progress = calculateProgress()

  // Download comparison
  const downloadComparison = () => {
    // In a real implementation, this would create a canvas with both images
    // and download it as a single image
    console.log("Download comparison")
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Photo Type</label>
            <Select value={selectedPhotoType} onValueChange={setSelectedPhotoType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="front">Front View</SelectItem>
                <SelectItem value="side">Side View</SelectItem>
                <SelectItem value="back">Back View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Before Photo</label>
            <Select
              value={beforePhoto?.id}
              onValueChange={(id) =>
                setBeforePhoto(sortedPhotos.find((p) => p.id === id) || null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select photo" />
              </SelectTrigger>
              <SelectContent>
                {sortedPhotos.map((photo) => (
                  <SelectItem key={photo.id} value={photo.id}>
                    {format(new Date(photo.recorded_at), "MMM d, yyyy")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">After Photo</label>
            <Select
              value={afterPhoto?.id}
              onValueChange={(id) =>
                setAfterPhoto(sortedPhotos.find((p) => p.id === id) || null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select photo" />
              </SelectTrigger>
              <SelectContent>
                {sortedPhotos.map((photo) => (
                  <SelectItem key={photo.id} value={photo.id}>
                    {format(new Date(photo.recorded_at), "MMM d, yyyy")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Comparison Mode</label>
            <Select value={comparisonMode} onValueChange={(v: any) => setComparisonMode(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="side-by-side">Side by Side</SelectItem>
                <SelectItem value="slider">Slider</SelectItem>
                <SelectItem value="overlay">Overlay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-16 text-center">{zoom}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 10))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(100)}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1" />

          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(true)}>
            <Maximize2 className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>

          <Button variant="outline" size="sm" onClick={downloadComparison}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </Card>

      {/* Progress Stats */}
      {progress && (
        <Card className="p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {progress.daysBetween} days
              </div>
              <div className="text-sm text-muted-foreground">Time Period</div>
            </div>
            {progress.weightChange !== null && (
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold",
                  progress.weightChange < 0 ? "text-green-500" : "text-blue-500"
                )}>
                  {progress.weightChange > 0 ? "+" : ""}
                  {progress.weightChange.toFixed(1)} kg
                </div>
                <div className="text-sm text-muted-foreground">Weight Change</div>
              </div>
            )}
            {progress.bodyFatChange !== null && (
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold",
                  progress.bodyFatChange < 0 ? "text-green-500" : "text-yellow-500"
                )}>
                  {progress.bodyFatChange > 0 ? "+" : ""}
                  {progress.bodyFatChange.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Body Fat Change</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Comparison View */}
      {beforePhoto && afterPhoto ? (
        <Card className="p-6">
          {/* Side by Side */}
          {comparisonMode === "side-by-side" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">Before</Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(beforePhoto.recorded_at), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                  <img
                    src={beforePhoto.photo_url}
                    alt="Before"
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                </div>
                {beforePhoto.weight_kg && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Weight: {beforePhoto.weight_kg} kg
                    {beforePhoto.body_fat_percent && ` • BF: ${beforePhoto.body_fat_percent}%`}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    After
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(afterPhoto.recorded_at), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                  <img
                    src={afterPhoto.photo_url}
                    alt="After"
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                </div>
                {afterPhoto.weight_kg && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Weight: {afterPhoto.weight_kg} kg
                    {afterPhoto.body_fat_percent && ` • BF: ${afterPhoto.body_fat_percent}%`}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Slider Comparison */}
          {comparisonMode === "slider" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Before</Badge>
                  <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    After
                  </Badge>
                </div>
              </div>
              <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0">
                  <img
                    src={beforePhoto.photo_url}
                    alt="Before"
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                </div>
                <div
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src={afterPhoto.photo_url}
                    alt="After"
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                </div>
                <div
                  className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <ArrowLeftRight className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              </div>
              <Slider
                value={[sliderPosition]}
                onValueChange={([value]) => setSliderPosition(value)}
                max={100}
                step={1}
                className="mt-4"
              />
            </div>
          )}

          {/* Overlay Comparison */}
          {comparisonMode === "overlay" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Overlay</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Opacity:</span>
                  <span className="text-sm font-medium">{overlayOpacity}%</span>
                </div>
              </div>
              <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0">
                  <img
                    src={beforePhoto.photo_url}
                    alt="Before"
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                </div>
                <div
                  className="absolute inset-0"
                  style={{ opacity: overlayOpacity / 100 }}
                >
                  <img
                    src={afterPhoto.photo_url}
                    alt="After"
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                </div>
              </div>
              <Slider
                value={[overlayOpacity]}
                onValueChange={([value]) => setOverlayOpacity(value)}
                max={100}
                step={1}
                className="mt-4"
              />
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {sortedPhotos.length === 0
              ? "No progress photos available for this view"
              : "Select before and after photos to compare"}
          </p>
        </Card>
      )}

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-7xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>Progress Comparison - {clientName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {/* Same comparison view but in fullscreen */}
            {beforePhoto && afterPhoto && comparisonMode === "side-by-side" && (
              <div className="grid md:grid-cols-2 gap-6 h-full">
                <div className="relative">
                  <img
                    src={beforePhoto.photo_url}
                    alt="Before"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="relative">
                  <img
                    src={afterPhoto.photo_url}
                    alt="After"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
