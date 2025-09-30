"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const myTemplates = [
  {
    id: 1,
    name: "Full Body Strength",
    type: "Strength",
    description: "A comprehensive workout targeting all major muscle groups for overall strength development.",
  },
  {
    id: 2,
    name: "Cardio Blast",
    type: "Cardio",
    description: "High-intensity cardio exercises designed to improve cardiovascular health and burn calories.",
  },
  {
    id: 3,
    name: "Core Crusher",
    type: "Core",
    description: "Exercises focused on strengthening the core muscles for improved stability and balance.",
  },
]

const communityTemplates = [
  {
    id: 4,
    name: "Yoga Flow",
    type: "Flexibility",
    description: "A sequence of yoga poses to enhance flexibility, balance, and mindfulness.",
  },
  {
    id: 5,
    name: "HIIT Challenge",
    type: "HIIT",
    description: "Short bursts of intense exercise alternated with low-intensity recovery periods.",
  },
]

export function WorkoutTemplates() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Workouts</h1>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Workout
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
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

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">My Templates</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myTemplates.map((template) => (
                  <Card key={template.id} className="hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary">{template.type}</Badge>
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Use</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Community Templates</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {communityTemplates.map((template) => (
                  <Card key={template.id} className="hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary">{template.type}</Badge>
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Use</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assigned">
          <div className="text-center py-12 text-muted-foreground">No assigned workouts yet</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
