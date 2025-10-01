import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Dumbbell, Apple, TrendingUp } from "lucide-react"

export default function ClientDashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Welcome back, Anna!</h1>
          <p className="text-muted-foreground">Here's your fitness progress overview</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workouts This Week</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,240</div>
              <p className="text-xs text-muted-foreground">+15% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meals Logged</CardTitle>
              <Apple className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">6 days tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Session</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-xs text-muted-foreground">4:00 PM - Strength Training</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Weight Loss Goal</span>
                  <span className="text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground">7.5 lbs lost of 10 lbs goal</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Workout Consistency</span>
                  <span className="text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                <p className="text-xs text-muted-foreground">23 of 25 workouts completed</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Nutrition Tracking</span>
                  <span className="text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground">6 of 7 days logged</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Completed Upper Body Workout</p>
                  <p className="text-xs text-muted-foreground">2 hours ago • 45 min • 320 cal</p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Logged Lunch</p>
                  <p className="text-xs text-muted-foreground">4 hours ago • 520 calories</p>
                </div>
                <Badge variant="secondary">Logged</Badge>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Morning Cardio Session</p>
                  <p className="text-xs text-muted-foreground">Yesterday • 30 min • 280 cal</p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Weight Check-in</p>
                  <p className="text-xs text-muted-foreground">2 days ago • 152.5 lbs</p>
                </div>
                <Badge variant="secondary">Updated</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
