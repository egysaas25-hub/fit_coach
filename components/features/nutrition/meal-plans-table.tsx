import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Copy, Trash2, Users } from "lucide-react"
import { MealPlan } from "@/types/domain/nutrition"

interface MealPlansTableProps {
  plans: MealPlan[]
  onEdit: (id: number) => void
  onDuplicate: (name: string) => void
  onDelete: (name: string) => void
}

export function MealPlansTable({ plans, onEdit, onDuplicate, onDelete }: MealPlansTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Plan Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Calories</TableHead>
          <TableHead>Macros (P/C/F)</TableHead>
          <TableHead>Clients</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.map((plan) => (
          <TableRow key={plan.id}>
            <TableCell>
              <div>
                <div className="font-medium">{plan.name}</div>
                <div className="text-sm text-muted-foreground">{plan.description}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{plan.type}</Badge>
            </TableCell>
            <TableCell className="font-medium">{plan.calories} cal</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {plan.protein}g / {plan.carbs}g / {plan.fats}g
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span>{plan.clients}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(plan.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(plan.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDuplicate(plan.name)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(plan.name)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
