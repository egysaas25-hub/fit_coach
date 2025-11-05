import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { WorkoutProgram } from "@/types/workout"

interface WorkoutOverviewGridProps {
  programs: WorkoutProgram[]
}

export function WorkoutOverviewGrid({ programs }: WorkoutOverviewGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <Card key={program.id} className="hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <Badge variant="secondary">{program.goal}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{program.clients}</span>
              </div>
            </div>
            <CardTitle className="text-lg">{program.name}</CardTitle>
            <CardDescription className="line-clamp-2">{program.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Duration</div>
                <div className="font-semibold">{program.duration}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Frequency</div>
                <div className="font-semibold">{program.workoutsPerWeek}x/week</div>
              </div>
              <div>
                <div className="text-muted-foreground">Difficulty</div>
                <div className="font-semibold">{program.difficulty}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Clients</div>
                <div className="font-semibold">{program.clients}</div>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
