'use client'

import { useQuery } from '@tanstack/react-query'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface AdherenceData {
  date: string
  workouts_completed: number
  workouts_planned: number
  meals_logged: number
  meals_planned: number
  adherence_percent: number
}

interface AdherenceCalendarProps {
  clientId: string
  month?: Date
}

export function AdherenceCalendar({ clientId, month = new Date() }: AdherenceCalendarProps) {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Fetch adherence data
  const { data, isLoading } = useQuery<AdherenceData[]>({
    queryKey: ['client-adherence', clientId, format(month, 'yyyy-MM')],
    queryFn: async () => {
      const response = await fetch(
        `/api/clients/${clientId}/adherence?month=${format(month, 'yyyy-MM')}`,
        { credentials: 'include' }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch adherence data')
      }

      return response.json()
    },
  })

  const getAdherenceForDay = (day: Date) => {
    return data?.find(d => isSameDay(new Date(d.date), day))
  }

  const getColorClass = (adherence: number) => {
    if (adherence >= 90) return 'bg-green-500'
    if (adherence >= 70) return 'bg-green-400'
    if (adherence >= 50) return 'bg-yellow-500'
    if (adherence >= 30) return 'bg-orange-500'
    if (adherence > 0) return 'bg-red-500'
    return 'bg-muted'
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Adherence Calendar</h3>
          <p className="text-sm text-muted-foreground">
            {format(month, 'MMMM yyyy')}
          </p>
        </div>

        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Week day headers */}
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {days.map(day => {
                const adherenceData = getAdherenceForDay(day)
                const isCurrentMonth = day.getMonth() === month.getMonth()
                const adherencePercent = adherenceData?.adherence_percent || 0
                
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'aspect-square p-2 rounded-lg border transition-colors',
                      !isCurrentMonth && 'opacity-30',
                      adherenceData && 'cursor-pointer hover:ring-2 hover:ring-primary'
                    )}
                    title={
                      adherenceData
                        ? `${format(day, 'MMM d')}\nWorkouts: ${adherenceData.workouts_completed}/${adherenceData.workouts_planned}\nMeals: ${adherenceData.meals_logged}/${adherenceData.meals_planned}\nAdherence: ${adherencePercent}%`
                        : format(day, 'MMM d')
                    }
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-sm font-medium mb-1">
                        {format(day, 'd')}
                      </div>
                      {adherenceData && (
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            getColorClass(adherencePercent)
                          )}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>90-100%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span>70-89%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>50-69%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span>30-49%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>1-29%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span>No data</span>
              </div>
            </div>

            {/* Summary Stats */}
            {data && data.length > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-muted-foreground">Avg Adherence</div>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      data.reduce((sum, d) => sum + d.adherence_percent, 0) / data.length
                    )}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Days Tracked</div>
                  <div className="text-2xl font-bold">
                    {data.filter(d => d.adherence_percent > 0).length}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
