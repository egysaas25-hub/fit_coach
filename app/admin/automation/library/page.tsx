"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Zap, Play, Pause, Plus, Settings, Clock, Users, MessageSquare, Loader2 } from "lucide-react"

interface AutomationWorkflow {
  id: string
  name: string
  description: string | null
  trigger: string
  actions: string[]
  category: string | null
  is_active: boolean
  executions: number
  success_rate: number
  last_run_at: string | null
  created_at: string
  updated_at: string
}

const categories = ["All", "Onboarding", "Plan Management", "Engagement", "Motivation", "Billing", "Team Management"]

export default function AutomationLibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch workflows on mount
  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/automation/workflows')
      if (!response.ok) {
        throw new Error('Failed to fetch workflows')
      }
      const data = await response.json()
      setWorkflows(data)
    } catch (error) {
      console.error('Error fetching workflows:', error)
      toast({
        title: "Error",
        description: "Failed to load automation workflows",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesCategory = selectedCategory === "All" || workflow.category === selectedCategory
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (workflow.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleWorkflow = async (id: string, currentStatus: boolean) => {
    setTogglingId(id)
    try {
      const response = await fetch(`/api/automation/workflows/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update workflow')
      }

      const updatedWorkflow = await response.json()

      // Update local state
      setWorkflows(prev =>
        prev.map(w => w.id === id ? { ...w, is_active: updatedWorkflow.is_active } : w)
      )

      toast({
        title: "Success",
        description: `Workflow ${updatedWorkflow.is_active ? 'enabled' : 'disabled'} successfully`,
      })
    } catch (error) {
      console.error('Error toggling workflow:', error)
      toast({
        title: "Error",
        description: "Failed to update workflow status",
        variant: "destructive",
      })
    } finally {
      setTogglingId(null)
    }
  }

  const formatLastRun = (lastRunAt: string | null) => {
    if (!lastRunAt) return 'Never'
    
    const date = new Date(lastRunAt)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Automation Library</h1>
          <p className="text-muted-foreground">Manage automated workflows and triggers</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
            <p className="text-xs text-muted-foreground">
              {workflows.filter(w => w.is_active).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.reduce((sum, w) => sum + w.executions, 0)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.length > 0 
                ? Math.round(workflows.reduce((sum, w) => sum + w.success_rate, 0) / workflows.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Average across all workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47h</div>
            <p className="text-xs text-muted-foreground">Estimated this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search workflows..."
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

      {/* Workflows List */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{workflow.name}</h3>
                    {workflow.category && <Badge variant="outline">{workflow.category}</Badge>}
                    <Badge variant={workflow.is_active ? "default" : "secondary"}>
                      {workflow.is_active ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{workflow.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Trigger</p>
                      <p className="font-medium text-foreground">{workflow.trigger}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Executions</p>
                      <p className="font-medium text-foreground">{workflow.executions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                      <p className="font-medium text-foreground">{workflow.success_rate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Run</p>
                      <p className="font-medium text-foreground">{formatLastRun(workflow.last_run_at)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Actions</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(workflow.actions) && workflow.actions.map((action, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3 ml-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={workflow.is_active}
                      onCheckedChange={() => toggleWorkflow(workflow.id, workflow.is_active)}
                      disabled={togglingId === workflow.id}
                    />
                    {togglingId === workflow.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {workflow.is_active ? "Active" : "Paused"}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      View Logs
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No workflows found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or category filter
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Workflow
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}