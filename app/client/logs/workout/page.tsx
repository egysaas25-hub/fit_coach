import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function WorkoutLogPage() {
  const workouts = [
    { date: "Mar 30, 2024", type: "Upper Body", duration: "45 min", calories: 320, exercises: 8 },
    { date: "Mar 29, 2024", type: "Cardio", duration: "30 min", calories: 280, exercises: 1 },
    { date: "Mar 27, 2024", type: "Lower Body", duration: "50 min", calories: 380, exercises: 10 },
    { date: "Mar 26, 2024", type: "Core & Abs", duration: "25 min", calories: 180, exercises: 6 },
    { date: "Mar 24, 2024", type: "Full Body", duration: "60 min", calories: 420, exercises: 12 },
    { date: "Mar 23, 2024", type: "Cardio", duration: "35 min", calories: 310, exercises: 1 },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Workout Log</h1>
            <p className="text-muted-foreground">Track and review your workout history</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Log Workout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search workouts..." className="pl-9 bg-background" />
              </div>
              <CardTitle className="text-base">All Workouts ({workouts.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Exercises</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workouts.map((workout, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{workout.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{workout.type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{workout.duration}</TableCell>
                    <TableCell className="text-muted-foreground">{workout.calories} cal</TableCell>
                    <TableCell className="text-muted-foreground">{workout.exercises} exercises</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
