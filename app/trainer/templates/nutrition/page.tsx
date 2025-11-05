import { TrainerSidebar } from "@/components/trainer-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Copy, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MealPlansPage() {
  const mealPlans = [
    { name: "High Protein Weight Loss", calories: 1800, clients: 8, type: "Weight Loss" },
    { name: "Muscle Building 3000", calories: 3000, clients: 12, type: "Muscle Gain" },
    { name: "Balanced Maintenance", calories: 2200, clients: 15, type: "Maintenance" },
    { name: "Keto Fat Loss", calories: 1600, clients: 6, type: "Weight Loss" },
    { name: "Vegetarian Athlete", calories: 2800, clients: 4, type: "Performance" },
    { name: "Clean Bulk Plan", calories: 3200, clients: 9, type: "Muscle Gain" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Meal Plan Manager</h1>
            <p className="text-muted-foreground">Create and manage nutrition plans for your clients</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Meal Plan
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search meal plans..." className="pl-9 bg-background" />
              </div>
              <CardTitle className="text-base">All Plans ({mealPlans.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Clients Using</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mealPlans.map((plan, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{plan.type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{plan.calories} cal/day</TableCell>
                    <TableCell className="text-muted-foreground">{plan.clients} clients</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Copy className="h-4 w-4" />
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
