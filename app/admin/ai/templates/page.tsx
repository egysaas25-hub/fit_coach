"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/layouts/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, Copy, TrendingUp } from "lucide-react"

const mockTemplates = [
  {
    id: 1,
    name: "Workout Plan Generator",
    category: "Fitness",
    prompt:
      "Generate a personalized workout plan for a {fitness_level} individual focusing on {goals} with {days_per_week} days per week.",
    usageCount: 1247,
    lastUsed: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    name: "Meal Plan Creator",
    category: "Nutrition",
    prompt:
      "Create a {calorie_target} calorie meal plan for {dietary_preference} diet with {meals_per_day} meals per day.",
    usageCount: 892,
    lastUsed: "5 hours ago",
    status: "active",
  },
  {
    id: 3,
    name: "Exercise Form Correction",
    category: "Training",
    prompt: "Analyze the exercise form for {exercise_name} and provide detailed corrections and safety tips.",
    usageCount: 634,
    lastUsed: "1 day ago",
    status: "active",
  },
  {
    id: 4,
    name: "Progress Analysis",
    category: "Analytics",
    prompt:
      "Analyze the client progress data: {weight_data}, {workout_frequency}, {nutrition_adherence} and provide insights.",
    usageCount: 521,
    lastUsed: "3 days ago",
    status: "active",
  },
  {
    id: 5,
    name: "Injury Recovery Plan",
    category: "Rehabilitation",
    prompt: "Create a recovery plan for {injury_type} with exercises suitable for {recovery_stage} stage.",
    usageCount: 318,
    lastUsed: "1 week ago",
    status: "inactive",
  },
]

export default function AITemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(mockTemplates.map((t) => t.category)))]

  return (
    <div className="flex h-screen bg-background">
      

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Prompt Templates</h1>
              <p className="text-sm text-muted-foreground">Manage and monitor AI prompt templates</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create AI Prompt Template</DialogTitle>
                  <DialogDescription>Create a new reusable AI prompt template with variables</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input id="template-name" placeholder="e.g., Workout Plan Generator" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="nutrition">Nutrition</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="rehabilitation">Rehabilitation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Prompt Template</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Enter your prompt with variables in {curly_braces}"
                      className="min-h-32"
                    />
                    <p className="text-xs text-muted-foreground">Use {"{variable_name}"} for dynamic values</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">Create Template</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{mockTemplates.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {mockTemplates.filter((t) => t.status === "active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {mockTemplates.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {new Set(mockTemplates.map((t) => t.category)).size}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Template Library</CardTitle>
                  <CardDescription>Browse and manage AI prompt templates</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Prompt Preview</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">{template.prompt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-primary" />
                          <span className="font-medium">{template.usageCount.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{template.lastUsed}</TableCell>
                      <TableCell>
                        <Badge variant={template.status === "active" ? "default" : "secondary"}>
                          {template.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
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
    </div>
  )
}
