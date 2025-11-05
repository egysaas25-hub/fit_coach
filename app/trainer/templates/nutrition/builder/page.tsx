// app/nutrition/builder/page.tsx
import { Header } from "@/components/layouts/header"
import { NutritionPlanBuilder } from "@/components/features/nutrition-plan-builder"

export default function NutritionBuilderPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-6 lg:p-8">
        <NutritionPlanBuilder />
      </main>
    </div>
  )
}