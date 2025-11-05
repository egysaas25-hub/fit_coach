"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"
import { useNutrition } from "@/hooks/api/use-nutrition"
import { NutritionStats } from "@/components/features/nutrition/nutrition-tracker"
import { MealPlansTable } from "@/components/features/nutrition/meal-plans-table"
import { NutritionTemplatesTable } from "@/components/features/nutrition/nutrition-templates-table"
import { NutritionOverviewGrid } from "@/components/features/nutrition/nutrition-overview-grid"


export default function NutritionPage() {
  const router = useRouter()
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    filteredPlans,
    filteredTemplates,
    stats,
    allPlans
  } = useNutrition()

  const handleCreatePlan = () => {
    router.push("/nutrition/builder")
  }

  const handleEditPlan = (planId: number) => {
    toast.info(`Editing plan ${planId}`)
    router.push(`/nutrition/edit/${planId}`)
  }

  const handleDuplicatePlan = (planName: string) => {
    toast.success(`Duplicated ${planName}`)
  }

  const handleDeletePlan = (planName: string) => {
    toast.error(`Deleted ${planName}`)
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      
      {/* Main Content */}
      <div className="flex-1 space-y-6 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">Nutrition Management</h1>
            <p className="text-muted-foreground mt-2">Create and manage meal plans and nutrition templates</p>
          </div>
          <Button onClick={handleCreatePlan}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </div>

        {/* Stats */}
        <NutritionStats {...stats} />

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search plans and templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="space-y-4">
              <TabsList>
                <TabsTrigger value="plans">Meal Plans</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="plans">
                <MealPlansTable
                  plans={filteredPlans}
                  onEdit={handleEditPlan}
                  onDuplicate={handleDuplicatePlan}
                  onDelete={handleDeletePlan}
                />
              </TabsContent>

              <TabsContent value="templates">
                <NutritionTemplatesTable templates={filteredTemplates} />
              </TabsContent>

              <TabsContent value="overview">
                <NutritionOverviewGrid plans={allPlans} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}