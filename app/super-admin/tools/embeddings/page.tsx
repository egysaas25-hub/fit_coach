import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Database, RefreshCcw } from "lucide-react"

export default function SuperAdminEmbeddingsPage() {
  const embeddings = [
    { id: 1, name: "Workout Templates", model: "text-embedding-ada-002", dimensions: 1536, vectors: 1247, lastUpdated: "2 hours ago" },
    { id: 2, name: "Nutrition Plans", model: "text-embedding-ada-002", dimensions: 1536, vectors: 892, lastUpdated: "5 hours ago" },
    { id: 3, name: "User Profiles", model: "text-embedding-ada-002", dimensions: 1536, vectors: 2156, lastUpdated: "1 day ago" },
    { id: 4, name: "Exercise Library", model: "text-embedding-ada-002", dimensions: 1536, vectors: 634, lastUpdated: "3 days ago" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Vector Embeddings</h1>
            <p className="text-muted-foreground">Manage AI embeddings and vector databases</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh All
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Embedding
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{embeddings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Vectors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4,929</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4 GB</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Queries Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search embeddings..." className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Collection</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Dimensions</TableHead>
                  <TableHead>Vectors</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {embeddings.map((embedding) => (
                  <TableRow key={embedding.id}>
                    <TableCell className="font-medium">{embedding.name}</TableCell>
                    <TableCell><Badge variant="outline">{embedding.model}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{embedding.dimensions}</TableCell>
                    <TableCell className="text-muted-foreground">{embedding.vectors.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">{embedding.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Refresh</Button>
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
