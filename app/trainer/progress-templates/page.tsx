import { TrainerSidebar } from "@/components/trainer-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Copy, Edit } from "lucide-react"

export default function ProgressTemplatesPage() {
  const templates = [
    {
      name: "Weight Loss Program",
      description: "12-week progressive weight loss tracking template",
      category: "Weight Loss",
      uses: 15,
    },
    {
      name: "Strength Building",
      description: "8-week strength progression tracking",
      category: "Strength",
      uses: 22,
    },
    {
      name: "Cardio Endurance",
      description: "6-week cardiovascular improvement plan",
      category: "Cardio",
      uses: 18,
    },
    {
      name: "Body Recomposition",
      description: "16-week muscle gain and fat loss tracking",
      category: "Body Comp",
      uses: 12,
    },
    {
      name: "Beginner Fitness",
      description: "4-week introduction to fitness tracking",
      category: "Beginner",
      uses: 28,
    },
    {
      name: "Athletic Performance",
      description: "10-week sports performance optimization",
      category: "Performance",
      uses: 9,
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Progress Templates</h1>
            <p className="text-muted-foreground">Manage your client progress tracking templates</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <Badge variant="secondary">{template.category}</Badge>
                </div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Used by {template.uses} clients</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Copy className="mr-2 h-3 w-3" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
