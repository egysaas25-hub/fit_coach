import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, TrendingDown } from "lucide-react"

export default function WeightProgressPage() {
  const weightData = [
    { date: "Jan 1", weight: 160, muscle: 45 },
    { date: "Jan 15", weight: 158, muscle: 45.5 },
    { date: "Feb 1", weight: 157, muscle: 46 },
    { date: "Feb 15", weight: 155, muscle: 46.5 },
    { date: "Mar 1", weight: 154, muscle: 47 },
    { date: "Mar 15", weight: 153, muscle: 47.2 },
    { date: "Mar 30", weight: 152.5, muscle: 47.5 },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <ClientSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Weight & Muscle Mass</h1>
          <p className="text-muted-foreground">Track your weight and muscle mass progress over time</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Weight Progress</CardTitle>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingDown className="h-4 w-4 text-primary" />
                    <span className="font-medium">-7.5 lbs</span>
                    <span className="text-muted-foreground">since Jan 1</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-end justify-between gap-3">
                  {weightData.map((data, i) => {
                    const height = ((165 - data.weight) / 15) * 100
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs font-medium text-muted-foreground">{data.weight}</div>
                        <div
                          className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                          style={{ height: `${Math.max(height, 10)}%` }}
                        />
                        <div className="text-xs text-muted-foreground">{data.date}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Muscle Mass Progress</CardTitle>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingDown className="h-4 w-4 text-primary rotate-180" />
                    <span className="font-medium">+2.5 lbs</span>
                    <span className="text-muted-foreground">since Jan 1</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-end justify-between gap-3">
                  {weightData.map((data, i) => {
                    const height = ((data.muscle - 40) / 10) * 100
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs font-medium text-muted-foreground">{data.muscle}</div>
                        <div
                          className="w-full bg-accent rounded-t transition-all hover:bg-accent/80"
                          style={{ height: `${Math.max(height, 10)}%` }}
                        />
                        <div className="text-xs text-muted-foreground">{data.date}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Current Weight</p>
                  <p className="text-2xl font-bold">152.5 lbs</p>
                  <p className="text-xs text-muted-foreground mt-1">Last updated: Today</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Muscle Mass</p>
                  <p className="text-2xl font-bold">47.5 lbs</p>
                  <p className="text-xs text-muted-foreground mt-1">Last updated: Today</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Body Fat %</p>
                  <p className="text-2xl font-bold">22.3%</p>
                  <p className="text-xs text-muted-foreground mt-1">Estimated</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Log New Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input id="weight" type="number" placeholder="152.5" className="bg-background" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="muscle">Muscle Mass (lbs)</Label>
                  <Input id="muscle" type="number" placeholder="47.5" className="bg-background" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" className="bg-background" />
                </div>

                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Log Entry
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
