"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const nutritionPlans = [
  {
    id: 1,
    type: "Balanced Diet",
    description: "A well-rounded diet focusing on balanced macronutrients.",
    lastUpdated: "2025-05-10",
    status: "Active",
  },
  {
    id: 2,
    type: "High Protein Plan",
    description: "A diet plan with elevated protein for muscle building.",
    lastUpdated: "2025-04-15",
    status: "Active",
  },
  {
    id: 3,
    type: "Low Carb Diet",
    description: "A plan with reduced carbohydrates intake.",
    lastUpdated: "2025-03-22",
    status: "Active",
  },
]

export function NutritionTemplates() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPlans = nutritionPlans.filter(
    (plan) =>
      plan.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Nutrition</h1>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Start Trial
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="meal-plan">Meal plan</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.type}</TableCell>
                    <TableCell className="text-muted-foreground">{plan.description}</TableCell>
                    <TableCell className="text-muted-foreground">{plan.lastUpdated}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        {plan.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="meal-plan">
          <div className="text-center py-12 text-muted-foreground">No meal plans created yet</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
