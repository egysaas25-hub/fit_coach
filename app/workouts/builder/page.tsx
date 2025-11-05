// app/workouts/builder/page.tsx
import { Header } from "@/components/layouts/header"
import { WorkoutPlanBuilder } from "@/components/features/workout-plan-builder"
import { AdminSidebar } from "@/components/layouts/admin-sidebar"

export default function WorkoutBuilderPage() {
  return (
    <div className="min-h-screen bg-background">
        <div className="flex min-h-screen">
  
      <AdminSidebar />
      <main className="p-6 lg:p-8">
        <WorkoutPlanBuilder />
      </main>
      </div>
    </div>
  )
}