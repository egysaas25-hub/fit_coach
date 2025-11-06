import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";
import { Plus, Play, Pause, Trash2, Clock } from "lucide-react";

export default function SuperAdminDispatchPage() {
  const jobs = [
    {
      id: "job_1",
      name: "Daily Report Generation",
      schedule: "0 0 * * *",
      status: "Running",
      lastRun: "2 hours ago",
      nextRun: "22 hours",
      duration: "2m 34s",
    },
    {
      id: "job_2",
      name: "Database Backup",
      schedule: "0 2 * * *",
      status: "Scheduled",
      lastRun: "1 day ago",
      nextRun: "2 hours",
      duration: "5m 12s",
    },
    {
      id: "job_3",
      name: "Email Digest",
      schedule: "0 8 * * *",
      status: "Scheduled",
      lastRun: "14 hours ago",
      nextRun: "10 hours",
      duration: "1m 45s",
    },
    {
      id: "job_4",
      name: "Cache Cleanup",
      schedule: "*/30 * * * *",
      status: "Paused",
      lastRun: "3 hours ago",
      nextRun: "N/A",
      duration: "30s",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Job Dispatch</h1>
            <p className="text-muted-foreground">Manage scheduled tasks and background jobs</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Running</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                {jobs.filter((j) => j.status === "Running").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.filter((j) => j.status === "Scheduled").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paused</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {jobs.filter((j) => j.status === "Paused").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scheduled Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Schedule (Cron)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.name}</TableCell>
                    <TableCell className="font-mono text-sm">{job.schedule}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === "Running"
                            ? "default"
                            : job.status === "Scheduled"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{job.lastRun}</TableCell>
                    <TableCell className="text-muted-foreground">{job.nextRun}</TableCell>
                    <TableCell className="text-muted-foreground">{job.duration}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          {job.status === "Paused" ? (
                            <Play className="h-4 w-4" />
                          ) : (
                            <Pause className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
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
  );
}