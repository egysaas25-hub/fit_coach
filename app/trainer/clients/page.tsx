import { TrainerSidebar } from "@/components/trainer-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MessageSquare, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TrainerClientsPage() {
  const clients = [
    { name: "Anna Carter", progress: 75, lastActivity: "2 hours ago", status: "Active", avatar: "AC" },
    { name: "John Smith", progress: 60, lastActivity: "4 hours ago", status: "Active", avatar: "JS" },
    { name: "Sarah Lee", progress: 85, lastActivity: "Yesterday", status: "Active", avatar: "SL" },
    { name: "Mike Brown", progress: 45, lastActivity: "2 days ago", status: "Active", avatar: "MB" },
    { name: "Emily Davis", progress: 92, lastActivity: "3 hours ago", status: "Active", avatar: "ED" },
    { name: "David Wilson", progress: 55, lastActivity: "5 hours ago", status: "Active", avatar: "DW" },
    { name: "Lisa Anderson", progress: 70, lastActivity: "Yesterday", status: "Active", avatar: "LA" },
    { name: "Tom Martinez", progress: 38, lastActivity: "3 days ago", status: "Inactive", avatar: "TM" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Client Management</h1>
            <p className="text-muted-foreground">Manage and track your clients' progress</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search clients..." className="pl-9 bg-background" />
              </div>
              <CardTitle className="text-base">All Clients ({clients.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={client.name} />
                          <AvatarFallback>{client.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{client.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${client.progress}%` }} />
                        </div>
                        <span className="text-sm text-muted-foreground">{client.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.lastActivity}</TableCell>
                    <TableCell>
                      <Badge variant={client.status === "Active" ? "default" : "secondary"}>{client.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
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
