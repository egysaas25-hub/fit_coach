import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { WorkoutTemplate } from "@/types/domain/workout"

interface WorkoutTemplatesGridProps {
  templates: WorkoutTemplate[]
}

export function WorkoutTemplatesGrid({ templates }: WorkoutTemplatesGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.id} className="hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <Badge variant="secondary">{template.type}</Badge>
              <Badge variant="outline">{template.difficulty}</Badge>
            </div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription className="line-clamp-2">{template.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground">Exercises</div>
                <div className="font-semibold">{template.exercises}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Duration</div>
                <div className="font-semibold">{template.duration}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" size="sm">Use Template</Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}