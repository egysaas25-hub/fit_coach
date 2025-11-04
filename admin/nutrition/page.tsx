"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function NutritionPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Nutrition Plans</h1>
          <p className="text-muted-foreground mt-2">Create and manage meal plans</p>
        </div>
        <Button onClick={() => router.push("/admin/nutrition/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { name: "High Protein", clients: 28, calories: "2400 kcal" },
          { name: "Keto Diet", clients: 15, calories: "2000 kcal" },
          { name: "Balanced Macro", clients: 35, calories: "2200 kcal" },
        ].map((plan) => (
          <div key={plan.name} className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Target: {plan.calories}</div>
              <div>Active Clients: {plan.clients}</div>
            </div>
            <button className="mt-4 w-full px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
