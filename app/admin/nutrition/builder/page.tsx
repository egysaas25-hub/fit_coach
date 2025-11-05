import { NutritionPlanBuilder } from "@/components/features/nutrition/meal-plan-builder";
import { Header } from "@/components/navigation/navbar";

export default function NutritionBuilderPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background w-full">  {/* Changed to flex-col and added w-full */}
      <Header />
      <main className="flex-1 p-6 lg:p-8">  {/* Added flex-1 to make main expand */}
        <NutritionPlanBuilder />
      </main>
    </div>
  )
}