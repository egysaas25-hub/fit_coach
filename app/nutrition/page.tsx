import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { NutritionTemplates } from "@/components/nutrition-templates"

export default function NutritionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <NutritionTemplates />
        </main>
      </div>
    </div>
  )
}
