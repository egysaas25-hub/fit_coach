"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, Brain, TrendingUp, Clock, DollarSign, Users, Target } from "lucide-react"
import Link from "next/link"

const aiFeatures = [
  {
    title: "Exercise Generator",
    description: "Generate personalized workout routines based on client goals and equipment",
    icon: Target,
    href: "/admin/exercises/ai",
    usage: "156 generations",
    status: "active",
  },
  {
    title: "Nutrition Planner", 
    description: "Create customized meal plans with macro tracking and dietary preferences",
    icon: Brain,
    href: "/admin/nutrition/ai",
    usage: "89 plans created",
    status: "active",
  },
  {
    title: "Progress Analysis",
    description: "AI-powered insights and recommendations based on client progress data",
    icon: TrendingUp,
    href: "/admin/ai/progress",
    usage: "234 analyses",
    status: "coming-soon",
  },
  {
    title: "Form Correction",
    description: "Analyze exercise videos and provide form correction suggestions",
    icon: Zap,
    href: "/admin/ai/form-check",
    usage: "67 corrections",
    status: "beta",
  },
]

const recentActivity = [
  {
    id: 1,
    type: "exercise",
    user: "Sarah Johnson",
    action: "Generated workout plan for Weight Loss goal",
    timestamp: "2 minutes ago",
    tokens: 1247,
  },
  {
    id: 2,
    type: "nutrition",
    user: "Mike Chen",
    action: "Created meal plan for 2000 calorie target",
    timestamp: "15 minutes ago",
    tokens: 892,
  },
  {
    id: 3,
    type: "analysis",
    user: "Emily Davis",
    action: "Analyzed client progress for milestone tracking",
    timestamp: "1 hour ago",
    tokens: 634,
  },
  {
    id: 4,
    type: "exercise",
    user: "Alex Rodriguez",
    action: "Generated strength training routine",
    timestamp: "2 hours ago",
    tokens: 1105,
  },
]

const typeIcons = {
  exercise: Target,
  nutrition: Brain,
  analysis: TrendingUp,
  form: Zap,
}

export default function AIToolsPage() {
  const totalTokens = recentActivity.reduce((sum, activity) => sum + activity.tokens, 0)
  const totalCost = (totalTokens * 0.00002).toFixed(4) // Rough estimate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Tools
          </h1>
          <p className="text-muted-foreground">Artificial intelligence powered features for enhanced coaching</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/ai/logs">View All Logs</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/ai/templates">Manage Templates</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">546</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Using AI features</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Features Grid */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Available AI Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiFeatures.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <Badge 
                        variant={
                          feature.status === "active" ? "default" :
                          feature.status === "beta" ? "secondary" : "outline"
                        }
                        className="mt-1"
                      >
                        {feature.status === "coming-soon" ? "Coming Soon" : 
                         feature.status === "beta" ? "Beta" : "Active"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{feature.usage}</span>
                  <Button 
                    variant={feature.status === "active" ? "default" : "outline"}
                    size="sm"
                    disabled={feature.status === "coming-soon"}
                    asChild={feature.status !== "coming-soon"}
                  >
                    {feature.status === "coming-soon" ? (
                      <span>Coming Soon</span>
                    ) : (
                      <Link href={feature.href}>
                        {feature.status === "beta" ? "Try Beta" : "Use Feature"}
                      </Link>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent AI Activity
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/ai/logs">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const IconComponent = typeIcons[activity.type]
              return (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                  <div className="p-2 rounded-lg bg-muted">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                    <p className="text-xs text-muted-foreground">{activity.tokens} tokens</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/admin/exercises/ai">
                <Target className="h-6 w-6" />
                Generate Workout
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/admin/nutrition/ai">
                <Brain className="h-6 w-6" />
                Create Meal Plan
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/admin/ai/logs">
                <Clock className="h-6 w-6" />
                View Usage Logs
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}