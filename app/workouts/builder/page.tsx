import { Header } from "@/components/header"
import { WorkoutPlanBuilder } from "@/components/workout-plan-builder"

export default function WorkoutBuilderPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-6 lg:p-8">
        <WorkoutPlanBuilder />
      </main>
    </div>
  )
}
