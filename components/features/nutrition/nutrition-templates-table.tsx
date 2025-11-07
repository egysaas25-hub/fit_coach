import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Copy } from "lucide-react"
import { NutritionTemplate } from "@/types/domain/nutrition"

interface NutritionTemplatesTableProps {
  templates: NutritionTemplate[]
}

export function NutritionTemplatesTable({ templates }: NutritionTemplatesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Template Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Macro Split</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((template) => (
          <TableRow key={template.id}>
            <TableCell className="font-medium">{template.type}</TableCell>
            <TableCell className="text-muted-foreground max-w-md">{template.description}</TableCell>
            <TableCell className="text-sm">{template.macros}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{template.lastUpdated}</TableCell>
            <TableCell>
              <Badge variant="default" className="bg-primary/10 text-primary">
                {template.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
