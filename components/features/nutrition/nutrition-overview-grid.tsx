import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { MealPlan } from "@/types/nutrition"

interface NutritionOverviewGridProps {
  plans: MealPlan[]
}

export function NutritionOverviewGrid({ plans }: NutritionOverviewGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.id} className="hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <Badge variant="secondary">{plan.type}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{plan.clients}</span>
              </div>
            </div>
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <CardDescription className="line-clamp-2">{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Calories</div>
                <div className="font-semibold">{plan.calories}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Protein</div>
                <div className="font-semibold">{plan.protein}g</div>
              </div>
              <div>
                <div className="text-muted-foreground">Carbs</div>
                <div className="font-semibold">{plan.carbs}g</div>
              </div>
              <div>
                <div className="text-muted-foreground">Fats</div>
                <div className="font-semibold">{plan.fats}g</div>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
