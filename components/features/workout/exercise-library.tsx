import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Exercise } from "@/types/workout"

interface ExerciseLibraryTableProps {
  exercises: Exercise[]
}

export function ExerciseLibraryTable({ exercises }: ExerciseLibraryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Exercise Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Equipment</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exercises.map((exercise) => (
          <TableRow key={exercise.id}>
            <TableCell className="font-medium">{exercise.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{exercise.category}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{exercise.equipment}</TableCell>
            <TableCell>
              <Badge 
                variant={
                  exercise.difficulty === "Beginner" ? "secondary" :
                  exercise.difficulty === "Intermediate" ? "default" :
                  "destructive"
                }
              >
                {exercise.difficulty}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                Add to Program
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}