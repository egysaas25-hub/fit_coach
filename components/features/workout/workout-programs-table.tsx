import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Copy, Trash2, Users } from "lucide-react"
import { WorkoutProgram } from "@/types/workout"

interface WorkoutProgramsTableProps {
  programs: WorkoutProgram[]
  onEdit: (id: number) => void
  onDuplicate: (name: string) => void
  onDelete: (name: string) => void
}

export function WorkoutProgramsTable({ programs, onEdit, onDuplicate, onDelete }: WorkoutProgramsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Program Name</TableHead>
          <TableHead>Goal</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Clients</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {programs.map((program) => (
          <TableRow key={program.id}>
            <TableCell>
              <div>
                <div className="font-medium">{program.name}</div>
                <div className="text-sm text-muted-foreground">{program.description}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{program.goal}</Badge>
            </TableCell>
            <TableCell>
              <Badge 
                variant={
                  program.difficulty === "Beginner" ? "outline" :
                  program.difficulty === "Intermediate" ? "secondary" :
                  "default"
                }
              >
                {program.difficulty}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">{program.duration}</TableCell>
            <TableCell className="text-muted-foreground">
              {program.workoutsPerWeek}x/week
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span>{program.clients}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(program.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(program.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDuplicate(program.name)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(program.name)}>
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
