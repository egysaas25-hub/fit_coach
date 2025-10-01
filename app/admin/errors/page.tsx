import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ErrorQueuePage() {
  const errors = [
    { id: "ERR-001", message: "Database connection timeout", severity: "High", status: "Open", timestamp: "10:45 AM" },
    {
      id: "ERR-002",
      message: "API rate limit exceeded",
      severity: "Medium",
      status: "Resolved",
      timestamp: "10:30 AM",
    },
    { id: "ERR-003", message: "Failed email delivery", severity: "Low", status: "Open", timestamp: "10:15 AM" },
    { id: "ERR-004", message: "Payment processing error", severity: "High", status: "Open", timestamp: "10:00 AM" },
    { id: "ERR-005", message: "Image upload failed", severity: "Low", status: "Resolved", timestamp: "9:45 AM" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Error & Draft Queue</h1>
          <p className="text-muted-foreground">Monitor and resolve system errors</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Error Queue ({errors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Error ID</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errors.map((error, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{error.id}</TableCell>
                    <TableCell className="text-muted-foreground">{error.message}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          error.severity === "High"
                            ? "destructive"
                            : error.severity === "Medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {error.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {error.status === "Resolved" ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">{error.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{error.timestamp}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Resolve
                      </Button>
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
