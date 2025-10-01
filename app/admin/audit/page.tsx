import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AuditLogPage() {
  const logs = [
    {
      user: "Admin User",
      action: "Updated user role",
      timestamp: "2024-03-30 10:45:23",
      details: "Changed role from Client to Trainer",
    },
    {
      user: "Mike Johnson",
      action: "Created meal plan",
      timestamp: "2024-03-30 10:30:15",
      details: "High Protein Weight Loss plan",
    },
    {
      user: "Admin User",
      action: "Deleted user account",
      timestamp: "2024-03-30 10:15:42",
      details: "Removed inactive user",
    },
    {
      user: "Anna Carter",
      action: "Updated profile",
      timestamp: "2024-03-30 09:58:11",
      details: "Changed contact information",
    },
    {
      user: "Admin User",
      action: "System backup",
      timestamp: "2024-03-30 09:00:00",
      details: "Automated daily backup",
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Audit Log</h1>
          <p className="text-muted-foreground">Track all system activities and user actions</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search audit logs..." className="pl-9 bg-background" />
              </div>
              <CardTitle className="text-base">Recent Events ({logs.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{log.action}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                    <TableCell className="text-muted-foreground">{log.details}</TableCell>
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
