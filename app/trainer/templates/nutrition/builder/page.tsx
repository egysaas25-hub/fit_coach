import { NutritionPlanBuilder } from "@/components/features/nutrition/meal-plan-builder";
import { Header } from "@/components/navigation/navbar";

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