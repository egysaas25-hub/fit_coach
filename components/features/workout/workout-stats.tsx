import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Users, Calendar, TrendingUp } from "lucide-react"

interface WorkoutStatsProps {
  totalPrograms: number
  totalClients: number
  avgDuration: number
  totalTemplates: number
}

export function WorkoutStats({ totalPrograms, totalClients, avgDuration, totalTemplates }: WorkoutStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
          <Dumbbell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPrograms}</div>
          <p className="text-xs text-muted-foreground">Active programs</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
          <p className="text-xs text-muted-foreground">Following programs</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgDuration} weeks</div>
          <p className="text-xs text-muted-foreground">Program length</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Templates</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTemplates}</div>
          <p className="text-xs text-muted-foreground">Available templates</p>
        </CardContent>
      </Card>
    </div>
  )
}