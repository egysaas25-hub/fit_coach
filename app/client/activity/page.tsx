import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Dumbbell, Apple, TrendingUp } from "lucide-react"

export default function ClientActivityPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <ClientSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Activity Log</h1>
            <p className="text-muted-foreground">View your workout and nutrition history</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Log Activity
          </Button>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">Upper Body Strength Training</h3>
                      <p className="text-sm text-muted-foreground">Today at 4:30 PM</p>
                    </div>
                    <Badge>Completed</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Duration: 45 min</span>
                    <span>Calories: 320</span>
                    <span>Sets: 12</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Apple className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">Lunch - Grilled Chicken Salad</h3>
                      <p className="text-sm text-muted-foreground">Today at 12:30 PM</p>
                    </div>
                    <Badge variant="secondary">Logged</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Calories: 520</span>
                    <span>Protein: 45g</span>
                    <span>Carbs: 32g</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">Morning Cardio Session</h3>
                      <p className="text-sm text-muted-foreground">Yesterday at 7:00 AM</p>
                    </div>
                    <Badge>Completed</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Duration: 30 min</span>
                    <span>Calories: 280</span>
                    <span>Distance: 3.2 mi</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">Weight Check-in</h3>
                      <p className="text-sm text-muted-foreground">2 days ago</p>
                    </div>
                    <Badge variant="secondary">Updated</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Weight: 152.5 lbs</span>
                    <span>Change: -0.5 lbs</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
