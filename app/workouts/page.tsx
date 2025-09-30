import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { WorkoutTemplates } from "@/components/workout-templates"

export default function WorkoutsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <WorkoutTemplates />
        </main>
      </div>
    </div>
  )
}
