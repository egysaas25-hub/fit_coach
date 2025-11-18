import { WorkoutPlanBuilder } from "@/components/features/workout/workout-builder";


export default function WorkoutBuilderPage() {
  return (
    <div className="min-h-screen bg-background">
        <div className="flex min-h-screen">
      <main className="p-6 lg:p-8">
        <WorkoutPlanBuilder />
      </main>
      </div>
    </div>
  )
}