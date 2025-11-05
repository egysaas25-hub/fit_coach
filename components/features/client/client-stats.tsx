"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dumbbell, Apple, Camera, Activity } from "lucide-react"

export function ClientActivity() {
  const workoutSessions = [
    {
      date: "Nov 20, 2024",
      type: "Strength Training",
      duration: "45 min",
      calories: 320,
      status: "Completed",
    },
    {
      date: "Nov 18, 2024",
      type: "Cardio",
      duration: "30 min",
      calories: 280,
      status: "Completed",
    },
    {
      date: "Nov 16, 2024",
      type: "HIIT",
      duration: "25 min",
      calories: 350,
      status: "Completed",
    },
    {
      date: "Nov 14, 2024",
      type: "Yoga",
      duration: "60 min",
      calories: 180,
      status: "Completed",
    },
    {
      date: "Nov 12, 2024",
      type: "Strength Training",
      duration: "50 min",
      calories: 340,
      status: "Missed",
    },
  ]

  const activityLog = [
    { action: "Completed workout: Upper Body Strength", time: "2 hours ago", icon: Dumbbell },
    { action: "Logged meal: Grilled Chicken Salad", time: "4 hours ago", icon: Apple },
    { action: "Uploaded progress photo", time: "1 day ago", icon: Camera },
    { action: "Completed workout: Cardio Session", time: "2 days ago", icon: Dumbbell },
    { action: "Updated weight: 155 lbs", time: "3 days ago", icon: Activity },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Client Activity & Workout Logging</h1>
        <p className="text-muted-foreground mt-1">Track client workouts and activity history</p>
      </div>

      {/* Workout Activity Schedule */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Workout Activity Schedule</h3>
            <p className="text-sm text-muted-foreground">Weekly workout plan overview</p>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
              <div key={day} className="text-center">
                <div className="text-xs text-muted-foreground mb-2">{day}</div>
                <div
                  className={`p-3 rounded-lg ${
                    i < 5 ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-muted border border-border"
                  }`}
                >
                  <div className="text-xs font-medium text-foreground">{i < 5 ? "Scheduled" : "Rest"}</div>
                  {i < 5 && <div className="text-xs text-muted-foreground mt-1">9:00 AM</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* AI Workout Log Form */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Workout Log Form</h3>
            <p className="text-sm text-muted-foreground">Log workout details and track progress</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="exercise">Exercise Name</Label>
              <Input id="exercise" placeholder="e.g., Bench Press" className="bg-background border-border" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workout-type">Workout Type</Label>
              <Select>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength Training</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="hiit">HIIT</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sets">Sets</Label>
              <Input id="sets" type="number" placeholder="3" className="bg-background border-border" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reps">Reps</Label>
              <Input id="reps" type="number" placeholder="12" className="bg-background border-border" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input id="weight" type="number" placeholder="135" className="bg-background border-border" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" placeholder="45" className="bg-background border-border" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about the workout..."
                className="bg-background border-border min-h-24"
              />
            </div>
          </div>

          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Log Workout</Button>
        </div>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Session History */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Workout Session History</h3>
              <p className="text-sm text-muted-foreground">Recent workout sessions</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Duration</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Calories</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workoutSessions.map((session, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/50">
                      <td className="py-2 px-2 text-xs text-muted-foreground">{session.date}</td>
                      <td className="py-2 px-2 text-xs text-foreground">{session.type}</td>
                      <td className="py-2 px-2 text-xs text-muted-foreground">{session.duration}</td>
                      <td className="py-2 px-2 text-xs text-muted-foreground">{session.calories}</td>
                      <td className="py-2 px-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            session.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Client Activity Log */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Client Activity Log</h3>
              <p className="text-sm text-muted-foreground">Recent client activities</p>
            </div>

            <div className="space-y-3">
              {activityLog.map((activity, i) => {
                const Icon = activity.icon
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
