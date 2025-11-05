import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, Download, Upload, RefreshCw, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function SuperAdminBackupPage() {
  const backups = [
    {
      id: "BKP-2024-001",
      name: "Daily Automated Backup",
      size: "2.4 GB",
      date: "2024-03-15 02:00:00",
      type: "Full Backup",
      status: "Completed",
      duration: "12m 34s",
    },
    {
      id: "BKP-2024-002",
      name: "Weekly Full Backup",
      size: "2.3 GB",
      date: "2024-03-14 02:00:00",
      type: "Full Backup",
      status: "Completed",
      duration: "11m 52s",
    },
    {
      id: "BKP-2024-003",
      name: "Incremental Backup",
      size: "450 MB",
      date: "2024-03-13 02:00:00",
      type: "Incremental",
      status: "Completed",
      duration: "3m 15s",
    },
    {
      id: "BKP-2024-004",
      name: "Manual Backup",
      size: "2.1 GB",
      date: "2024-03-12 14:30:00",
      type: "Full Backup",
      status: "Completed",
      duration: "10m 45s",
    },
  ]

  const schedules = [
    { name: "Daily Backup", schedule: "Every day at 2:00 AM", type: "Full", retention: "7 days", status: "Active" },
    { name: "Weekly Backup", schedule: "Every Sunday at 2:00 AM", type: "Full", retention: "30 days", status: "Active" },
    { name: "Incremental Backup", schedule: "Every 6 hours", type: "Incremental", retention: "3 days", status: "Active" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Backup & Restore</h1>
            <p className="text-muted-foreground">Manage system backups and recovery</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Restore
            </Button>
            <Button>
              <Database className="mr-2 h-4 w-4" />
              Create Backup
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Backups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{backups.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.65 GB</div>
              <p className="text-xs text-muted-foreground">Total backup size</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h ago</div>
              <p className="text-xs text-muted-foreground">Automated daily</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">100%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Backup Schedules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Retention</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{schedule.name}</TableCell>
                    <TableCell className="text-muted-foreground">{schedule.schedule}</TableCell>
                    <TableCell><Badge variant="outline">{schedule.type}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{schedule.retention}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {schedule.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Backup ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-mono text-sm">{backup.id}</TableCell>
                    <TableCell className="font-medium">{backup.name}</TableCell>
                    <TableCell><Badge variant="outline">{backup.type}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{backup.size}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{backup.date}</TableCell>
                    <TableCell className="text-muted-foreground">{backup.duration}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {backup.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <RefreshCw className="h-4 w-4" />
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