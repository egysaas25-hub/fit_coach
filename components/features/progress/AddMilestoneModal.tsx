'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

// Validation schema
const addMilestoneSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  metric_type: z.enum(['weight', 'body_fat', 'muscle_mass', 'workout_count', 'adherence', 'custom']),
  target_value: z.coerce.number().positive('Target value must be positive'),
  target_unit: z.string().default('kg'),
  target_date: z.string().optional(),
  reward_message: z.string().optional(),
})

type AddMilestoneFormData = z.infer<typeof addMilestoneSchema>

interface AddMilestoneModalProps {
  clientId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMilestoneModal({
  clientId,
  open,
  onOpenChange,
}: AddMilestoneModalProps) {
  const queryClient = useQueryClient()

  const form = useForm<AddMilestoneFormData>({
    resolver: zodResolver(addMilestoneSchema),
    defaultValues: {
      title: '',
      description: '',
      metric_type: 'weight',
      target_value: 0,
      target_unit: 'kg',
      target_date: '',
      reward_message: '',
    },
  })

  // Create milestone mutation
  const createMilestoneMutation = useMutation({
    mutationFn: async (data: AddMilestoneFormData) => {
      const response = await fetch(`/api/clients/${clientId}/milestones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create milestone')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-milestones', clientId] })
      toast.success('Milestone created successfully')
      form.reset()
      onOpenChange(false)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (data: AddMilestoneFormData) => {
    createMilestoneMutation.mutate(data)
  }

  const metricOptions = [
    { value: 'weight', label: 'Weight Loss/Gain', unit: 'kg' },
    { value: 'body_fat', label: 'Body Fat %', unit: '%' },
    { value: 'muscle_mass', label: 'Muscle Mass', unit: 'kg' },
    { value: 'workout_count', label: 'Workout Count', unit: 'workouts' },
    { value: 'adherence', label: 'Adherence %', unit: '%' },
    { value: 'custom', label: 'Custom Goal', unit: '' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Milestone</DialogTitle>
          <DialogDescription>
            Create a new milestone to track client progress and celebrate achievements.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Lose 10kg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional details about this milestone..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Metric Type */}
            <FormField
              control={form.control}
              name="metric_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metric Type *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      // Update unit based on metric type
                      const metric = metricOptions.find(m => m.value === value)
                      if (metric) {
                        form.setValue('target_unit', metric.unit)
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {metricOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Value */}
            <FormField
              control={form.control}
              name="target_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Value *</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="flex-1"
                      />
                      <Input
                        value={form.watch('target_unit')}
                        disabled
                        className="w-24"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The goal value to achieve
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Date */}
            <FormField
              control={form.control}
              name="target_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional deadline for this milestone
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reward Message */}
            <FormField
              control={form.control}
              name="reward_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Congratulations! You've achieved your goal!"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Message to send when milestone is achieved
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createMilestoneMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMilestoneMutation.isPending}>
                {createMilestoneMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Milestone
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
