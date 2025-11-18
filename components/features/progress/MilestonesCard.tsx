'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'sonner'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Trophy, Target, CheckCircle2, XCircle } from 'lucide-react'
import { AddMilestoneModal } from './AddMilestoneModal'

interface Milestone {
  id: string
  title: string
  description: string | null
  metric_type: string
  target_value: number
  target_unit: string
  target_date: Date | null
  status: 'active' | 'achieved' | 'cancelled'
  current_value: number | null
  progress_percent: number
  achieved_at: Date | null
  achieved_value: number | null
  reward_message: string | null
  created_at: Date
}

interface MilestonesData {
  milestones: Milestone[]
  summary: {
    total: number
    active: number
    achieved: number
  }
}

interface MilestonesCardProps {
  clientId: string
}

export function MilestonesCard({ clientId }: MilestonesCardProps) {
  const queryClient = useQueryClient()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [achievedMilestone, setAchievedMilestone] = useState<Milestone | null>(null)

  // Fetch milestones
  const { data, isLoading } = useQuery<MilestonesData>({
    queryKey: ['client-milestones', clientId],
    queryFn: async () => {
      const response = await fetch(`/api/clients/${clientId}/milestones`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch milestones')
      }

      return response.json()
    },
  })

  // Mark milestone as achieved
  const achieveMilestoneMutation = useMutation({
    mutationFn: async ({ milestoneId, achievedValue }: { milestoneId: string; achievedValue: number }) => {
      const response = await fetch(`/api/clients/${clientId}/milestones`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          milestone_id: milestoneId,
          status: 'achieved',
          achieved_at: new Date().toISOString(),
          achieved_value: achievedValue,
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to mark milestone as achieved')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-milestones', clientId] })
      toast.success('🎉 Milestone achieved! Great work!')
      setAchievedMilestone(null)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleMarkAchieved = (milestone: Milestone) => {
    if (milestone.current_value !== null) {
      achieveMilestoneMutation.mutate({
        milestoneId: milestone.id,
        achievedValue: milestone.current_value,
      })
    }
  }

  const statusConfig = {
    active: {
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      label: 'Active',
    },
    achieved: {
      icon: Trophy,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      label: 'Achieved',
    },
    cancelled: {
      icon: XCircle,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
      label: 'Cancelled',
    },
  }

  return (
    <>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Milestones</h3>
              <p className="text-sm text-muted-foreground">
                Track client achievements and goals
              </p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </div>

          {/* Summary */}
          {data && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{data.summary.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">{data.summary.active}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="text-center p-3 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-500">{data.summary.achieved}</div>
                <div className="text-xs text-muted-foreground">Achieved</div>
              </div>
            </div>
          )}

          {/* Milestones List */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : !data || data.milestones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No milestones yet. Create one to track progress!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.milestones.map((milestone) => {
                const config = statusConfig[milestone.status]
                const Icon = config.icon

                return (
                  <div
                    key={milestone.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`h-4 w-4 ${config.color}`} />
                          <h4 className="font-semibold">{milestone.title}</h4>
                          <Badge variant="outline" className={config.bgColor}>
                            {config.label}
                          </Badge>
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {milestone.status === 'active' && (
                      <>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                              {milestone.progress_percent}%
                            </span>
                          </div>
                          <Progress value={milestone.progress_percent} />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-muted-foreground">Current: </span>
                            <span className="font-medium">
                              {milestone.current_value !== null
                                ? `${milestone.current_value} ${milestone.target_unit}`
                                : 'Not tracked yet'}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target: </span>
                            <span className="font-medium">
                              {milestone.target_value} {milestone.target_unit}
                            </span>
                          </div>
                        </div>

                        {milestone.target_date && (
                          <div className="text-sm text-muted-foreground">
                            Target date: {format(new Date(milestone.target_date), 'MMM d, yyyy')}
                          </div>
                        )}

                        {milestone.progress_percent >= 100 && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkAchieved(milestone)}
                            disabled={achieveMilestoneMutation.isPending}
                            className="w-full"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark as Achieved
                          </Button>
                        )}
                      </>
                    )}

                    {milestone.status === 'achieved' && (
                      <div className="text-sm space-y-1">
                        <div className="text-green-600 font-medium">
                          ✓ Achieved on {format(new Date(milestone.achieved_at!), 'MMM d, yyyy')}
                        </div>
                        {milestone.achieved_value && (
                          <div className="text-muted-foreground">
                            Final value: {milestone.achieved_value} {milestone.target_unit}
                          </div>
                        )}
                        {milestone.reward_message && (
                          <div className="text-sm italic text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                            "{milestone.reward_message}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Add Milestone Modal */}
      <AddMilestoneModal
        clientId={clientId}
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </>
  )
}
