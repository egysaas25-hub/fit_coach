'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BodyMetricsForm } from '@/components/features/progress/BodyMetricsForm'
import { MilestonesCard } from '@/components/features/progress/MilestonesCard'

interface ProgressData {
  progress: Record<string, Array<{
    id: string
    value: number
    unit: string
    notes: string | null
    recorded_at: Date
  }>>
  inbody: Array<any>
  summary: {
    total_entries: number
    latest_weight: number | null
    latest_body_fat: number | null
    latest_muscle_mass: number | null
  }
}

interface ClientProgressTabProps {
  clientId: string
}

export function ClientProgressTab({ clientId }: ClientProgressTabProps) {
  // Fetch progress data
  const { data, isLoading, error, refetch } = useQuery<ProgressData>({
    queryKey: ['client-progress', clientId],
    queryFn: async () => {
      const response = await fetch(`/api/clients/${clientId}/progress`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch progress data')
      }

      return response.json()
    },
  })

  // Flatten progress data for table display
  const allProgress = data ? Object.entries(data.progress).flatMap(([metric_type, entries]) =>
    entries.map(entry => ({
      ...entry,
      metric_type,
    }))
  ).sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()) : []

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {data && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Latest Weight</div>
            <div className="text-2xl font-bold">
              {data.summary.latest_weight ? `${data.summary.latest_weight} kg` : '—'}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Latest Body Fat</div>
            <div className="text-2xl font-bold">
              {data.summary.latest_body_fat ? `${data.summary.latest_body_fat}%` : '—'}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Latest Muscle Mass</div>
            <div className="text-2xl font-bold">
              {data.summary.latest_muscle_mass ? `${data.summary.latest_muscle_mass} kg` : '—'}
            </div>
          </Card>
        </div>
      )}

      {/* Milestones */}
      <MilestonesCard clientId={clientId} />

      {/* Log Progress Form */}
      <BodyMetricsForm clientId={clientId} onSuccess={() => refetch()} />

      {/* Progress History */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Progress History</h3>
          
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Failed to load progress data
            </div>
          ) : allProgress.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No progress entries found. Start logging metrics above!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Recorded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allProgress.slice(0, 20).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium capitalize">
                      {entry.metric_type.replace('_', ' ')}
                    </TableCell>
                    <TableCell>
                      {entry.value} {entry.unit}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.notes || '—'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(entry.recorded_at), 'MMM d, yyyy HH:mm')}
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
