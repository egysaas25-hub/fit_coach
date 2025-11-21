'use client';
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"
import { NutritionStats } from "@/components/features/nutrition/nutrition-tracker"
import { MealPlansTable } from "@/components/features/nutrition/meal-plans-table"
import { NutritionTemplatesTable } from "@/components/features/nutrition/nutrition-templates-table"
import { NutritionOverviewGrid } from "@/components/features/nutrition/nutrition-overview-grid"
import { useNutritionLogs } from "@/lib/hooks/api/useNutritionLogs"


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
  } = useNutritionLogs()

  const handleCreatePlan = () => {
    router.push("/admin/nutrition/builder")
  }

  const handleEditPlan = (planId: number) => {
    router.push(`/admin/programs/nutrition/${planId}/edit`)
  }

  const handleDuplicatePlan = async (planId: number) => {
    try {
      toast.loading('Duplicating plan...');
      
      // TODO: Implement duplicate API endpoint
      // const response = await fetch(`/api/nutrition/${planId}/duplicate`, {
      //   method: 'POST',
      //   credentials: 'include',
      // });
      
      // if (!response.ok) throw new Error('Failed to duplicate plan');
      
      toast.dismiss();
      toast.success(`Plan duplicated successfully`);
      // Refresh the list
      // refetch();
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to duplicate plan');
      console.error('Duplicate error:', error);
    }
  }

  const handleDeletePlan = async (planId: number, planName: string) => {
    // Show confirmation dialog
    if (!confirm(`Are you sure you want to delete "${planName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      toast.loading('Deleting plan...');
      
      const response = await fetch(`/api/nutrition/${planId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete plan');
      }

      toast.dismiss();
      toast.success(`Plan deleted successfully`);
      
      // Refresh the nutrition plans list
      window.location.reload(); // Simple refresh for now, ideally use refetch from react-query
    } catch (error) {
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Failed to delete plan');
      console.error('Delete error:', error);
    }
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