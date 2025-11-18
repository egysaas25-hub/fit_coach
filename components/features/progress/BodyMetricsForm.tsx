'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Plus } from 'lucide-react'

// Validation schema
const bodyMetricsSchema = z.object({
  metric_type: z.enum(['weight', 'body_fat', 'muscle_mass', 'chest', 'waist', 'hips', 'arms', 'thighs']),
  value: z.coerce.number().positive('Value must be positive'),
  unit: z.string().default('kg'),
  notes: z.string().optional(),
})

type BodyMetricsFormData = z.infer<typeof bodyMetricsSchema>

interface BodyMetricsFormProps {
  clientId: string
  onSuccess?: () => void
}

export function BodyMetricsForm({ clientId, onSuccess }: BodyMetricsFormProps) {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<BodyMetricsFormData>({
    resolver: zodResolver(bodyMetricsSchema),
    defaultValues: {
      metric_type: 'weight',
      value: 0,
      unit: 'kg',
      notes: '',
    },
  })

  // Create progress entry mutation
  const createProgressMutation = useMutation({
    mutationFn: async (data: BodyMetricsFormData) => {
      const response = await fetch(`/api/clients/${clientId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to log progress')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-progress', clientId] })
      toast.success('Progress logged successfully')
      form.reset()
      setIsOpen(false)
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (data: BodyMetricsFormData) => {
    createProgressMutation.mutate(data)
  }

  const metricOptions = [
    { value: 'weight', label: 'Weight', unit: 'kg' },
    { value: 'body_fat', label: 'Body Fat %', unit: '%' },
    { value: 'muscle_mass', label: 'Muscle Mass', unit: 'kg' },
    { value: 'chest', label: 'Chest', unit: 'cm' },
    { value: 'waist', label: 'Waist', unit: 'cm' },
    { value: 'hips', label: 'Hips', unit: 'cm' },
    { value: 'arms', label: 'Arms', unit: 'cm' },
    { value: 'thighs', label: 'Thighs', unit: 'cm' },
  ]

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Log Progress
      </Button>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Log Body Metrics</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        form.setValue('unit', metric.unit)
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

            {/* Value */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value *</FormLabel>
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
                        value={form.watch('unit')}
                        disabled
                        className="w-20"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about this measurement..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional notes about how you're feeling, diet changes, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={createProgressMutation.isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createProgressMutation.isPending}
                className="flex-1"
              >
                {createProgressMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Log Progress
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  )
}
