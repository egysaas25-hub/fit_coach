'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";
import { useAuditLogs } from '@/lib/hooks/api/useAudit';

/**
 * Audit Log Page
 * Follows Architecture Rules:
 * - Rule 1: Component calls hooks only
 * - Uses React Query for server data
 */
export default function AuditLogPage() {
  // Rule 1: Component calls hook
  const { data: logs, isLoading, error } = useAuditLogs();

  if (error) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading audit logs</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

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
              <CardTitle className="text-base">Recent Events ({logs?.length || 0})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading audit logs...</p>
              </div>
            ) : logs && logs.length > 0 ? (
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
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.userId || 'System'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{log.message || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No audit logs found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
