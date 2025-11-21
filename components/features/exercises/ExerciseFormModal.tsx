'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { VideoUpload } from '@/components/shared/forms/VideoUpload'
import { ImageUpload } from '@/components/shared/forms/ImageUpload'

interface ExerciseFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercise?: any
  onSuccess?: () => void
}

export function ExerciseFormModal({
  open,
  onOpenChange,
  exercise,
  onSuccess,
}: ExerciseFormModalProps) {
  const [videoUrl, setVideoUrl] = useState(exercise?.video_url || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(exercise?.thumbnail_url || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: exercise?.name || '',
      description: exercise?.description || '',
      instructions: exercise?.instructions || '',
      difficulty_level: exercise?.difficulty_level || 'intermediate',
    },
  })

  const handleVideoUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'exercise-video')
      formData.append('entityType', 'exercise')

      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to upload video')
      }

      const data = await response.json()
      setVideoUrl(data.url)
      toast.success('Video uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload video')
      throw error
    }
  }

  const handleThumbnailUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'exercise-thumbnail')
      formData.append('entityType', 'exercise')

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to upload thumbnail')
      }

      const data = await response.json()
      setThumbnailUrl(data.url)
      toast.success('Thumbnail uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload thumbnail')
      throw error
    }
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...data,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        source: 'custom',
      }

      const url = exercise
        ? `/api/exercises/${exercise.id}`
        : '/api/exercises'
      
      const method = exercise ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to save exercise')
      }

      toast.success(exercise ? 'Exercise updated' : 'Exercise created')
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to save exercise')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {exercise ? 'Edit Exercise' : 'Add Custom Exercise'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Exercise Name *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              placeholder="e.g., Barbell Bench Press"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of the exercise"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              {...register('instructions')}
              placeholder="Step-by-step instructions"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty_level">Difficulty Level</Label>
            <select
              id="difficulty_level"
              {...register('difficulty_level')}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Exercise Video</Label>
            <div className="flex items-center gap-4">
              <VideoUpload
                onUpload={handleVideoUpload}
                maxSize={100 * 1024 * 1024}
              />
              {videoUrl && (
                <p className="text-sm text-muted-foreground">Video uploaded</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Thumbnail Image</Label>
            <div className="flex items-center gap-4">
              <ImageUpload
                onUpload={handleThumbnailUpload}
                maxSize={10 * 1024 * 1024}
              />
              {thumbnailUrl && (
                <p className="text-sm text-muted-foreground">Thumbnail uploaded</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : exercise ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
