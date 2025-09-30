import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Target, TrendingUp, Calendar } from "lucide-react"

export default function ClientGoalsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <ClientSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">My Goals</h1>
            <p className="text-muted-foreground">Track your fitness goals and progress</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Goal
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Target className="h-5 w-5 text-primary" />
                <Badge>Active</Badge>
              </div>
              <CardTitle className="mt-4">Weight Loss</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Target: Lose 10 lbs</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">7.5 / 10 lbs</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Target date: May 15, 2024</span>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Update Progress
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <TrendingUp className="h-5 w-5 text-primary" />
                <Badge>Active</Badge>
              </div>
              <CardTitle className="mt-4">Workout Consistency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Target: 25 workouts/month</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">23 / 25 workouts</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>This month</span>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Log Workout
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Target className="h-5 w-5 text-primary" />
                <Badge>Active</Badge>
              </div>
              <CardTitle className="mt-4">Build Muscle Tone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Target: Increase strength by 20%</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">12% increase</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Target date: June 30, 2024</span>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Update Progress
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
