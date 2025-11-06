import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";
import { Plus, Search, Edit, Trash2, BookOpen } from "lucide-react"

export default function SuperAdminDictionaryPage() {
  const terms = [
    { term: "Workout", translation: "Training Session", category: "Fitness", language: "en-US" },
    { term: "Nutrition Plan", translation: "Meal Plan", category: "Nutrition", language: "en-US" },
    { term: "Client", translation: "Customer", category: "General", language: "en-US" },
    { term: "Trainer", translation: "Coach", category: "General", language: "en-US" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Platform Dictionary</h1>
            <p className="text-muted-foreground">Manage terminology and definitions</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Term
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search terms..." className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Term</TableHead>
                  <TableHead>Translation</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {terms.map((term, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{term.term}</TableCell>
                    <TableCell>{term.translation}</TableCell>
                    <TableCell>{term.category}</TableCell>
                    <TableCell>{term.language}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
