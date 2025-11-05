import { WorkoutPlanBuilder } from "@/components/features/workout/workout-builder";

export default function WorkoutBuilderPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen w-full">  {/* Added w-full to outer flex */}
        <main className="flex-1 p-6 lg:p-8">  {/* Added flex-1 to make main expand */}
          <WorkoutPlanBuilder />
        </main>
      </div>
    </div>
  )
}