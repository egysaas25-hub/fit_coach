import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

export default function ClientCalendarPage() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dates = Array.from({ length: 35 }, (_, i) => i - 5)

  return (
    <div className="flex min-h-screen bg-background">
      <ClientSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Calendar</h1>
            <p className="text-muted-foreground">Schedule and track your workouts and meals</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>March 2024</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
                {dates.map((date, i) => {
                  const isCurrentMonth = date > 0 && date <= 31
                  const isToday = date === 15
                  const hasEvent = [10, 12, 15, 17, 19, 22, 24].includes(date)

                  return (
                    <div
                      key={i}
                      className={`
                        aspect-square p-2 rounded-lg border text-center text-sm
                        ${isCurrentMonth ? "border-border" : "border-transparent text-muted-foreground"}
                        ${isToday ? "bg-primary text-primary-foreground font-bold" : ""}
                        ${hasEvent && !isToday ? "bg-primary/10" : ""}
                        hover:bg-accent cursor-pointer transition-colors
                      `}
                    >
                      {isCurrentMonth ? date : ""}
                      {hasEvent && !isToday && <div className="w-1 h-1 rounded-full bg-primary mx-auto mt-1" />}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Upper Body Workout</span>
                    <Badge variant="secondary">4:00 PM</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">45 min • Strength Training</p>
                </div>

                <div className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Meal Prep</span>
                    <Badge variant="secondary">6:30 PM</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Dinner preparation</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Cardio Session</span>
                    <Badge variant="outline">Tomorrow</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">7:00 AM • 30 min</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Leg Day</span>
                    <Badge variant="outline">Mar 17</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">4:00 PM • 60 min</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
