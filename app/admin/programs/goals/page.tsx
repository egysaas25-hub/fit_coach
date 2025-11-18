"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Target, Plus, Edit, Trash2, Users, TrendingUp } from "lucide-react"

const goalTemplates = [
  {
    id: 1,
    name: "Weight Loss",
    description: "Comprehensive program for sustainable weight loss through balanced nutrition and cardio-focused workouts",
    category: "Fat Loss",
    duration: "12 weeks",
    clientCount: 45,
    successRate: 87,
    features: ["Calorie deficit planning", "Cardio emphasis", "Progress tracking", "Meal prep guides"],
    color: "bg-red-500",
  },
  {
    id: 2,
    name: "Muscle Building",
    description: "Strength-focused program designed to maximize muscle growth and improve body composition",
    category: "Muscle Gain",
    duration: "16 weeks", 
    clientCount: 32,
    successRate: 92,
    features: ["Progressive overload", "Protein optimization", "Recovery protocols", "Supplement guidance"],
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Athletic Performance",
    description: "Sport-specific training to enhance athletic performance, speed, and agility",
    category: "Performance",
    duration: "8 weeks",
    clientCount: 18,
    successRate: 94,
    features: ["Sport-specific drills", "Plyometric training", "Speed development", "Injury prevention"],
    color: "bg-green-500",
  },
  {
    id: 4,
    name: "General Fitness",
    description: "Well-rounded program for overall health, fitness, and wellness improvement",
    category: "Wellness",
    duration: "10 weeks",
    clientCount: 67,
    successRate: 85,
    features: ["Balanced approach", "Flexibility training", "Cardiovascular health", "Lifestyle coaching"],
    color: "bg-purple-500",
  },
  {
    id: 5,
    name: "Rehabilitation",
    description: "Specialized program for injury recovery and movement restoration",
    category: "Recovery",
    duration: "6 weeks",
    clientCount: 12,
    successRate: 96,
    features: ["Corrective exercises", "Pain management", "Mobility work", "Gradual progression"],
    color: "bg-orange-500",
  },
  {
    id: 6,
    name: "Senior Fitness",
    description: "Age-appropriate program focusing on mobility, balance, and functional strength",
    category: "Specialized",
    duration: "14 weeks",
    clientCount: 23,
    successRate: 89,
    features: ["Low-impact exercises", "Balance training", "Joint mobility", "Fall prevention"],
    color: "bg-teal-500",
  },
]

const categories = ["All", "Fat Loss", "Muscle Gain", "Performance", "Wellness", "Recovery", "Specialized"]

export default function GoalTemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTemplates = goalTemplates.filter((template) => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Goal Templates</h1>
          <p className="text-muted-foreground">Pre-built program templates for common fitness goals</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalTemplates.length}</div>
            <p className="text-xs text-muted-foreground">Active templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goalTemplates.reduce((sum, template) => sum + template.clientCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Using templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(goalTemplates.reduce((sum, template) => sum + template.successRate, 0) / goalTemplates.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">General Fitness</div>
            <p className="text-xs text-muted-foreground">67 active clients</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${template.color}`}></div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {template.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {template.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold text-foreground">{template.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                  <p className="font-semibold text-foreground">{template.successRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Clients</p>
                  <p className="font-semibold text-foreground">{template.clientCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-semibold text-foreground">{template.category}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Key Features</p>
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {template.features.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.features.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm">
                  Preview
                </Button>
                <Button className="flex-1" size="sm">
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or category filter
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}