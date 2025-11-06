import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";
import { Save, Gauge } from "lucide-react"

export default function SuperAdminRateLimitsPage() {
  const limits = [
    { endpoint: "API Requests", limit: "1000/hour", current: 247, tenant: "All Tenants" },
    { endpoint: "User Creation", limit: "50/hour", current: 12, tenant: "All Tenants" },
    { endpoint: "File Uploads", limit: "100/hour", current: 45, tenant: "All Tenants" },
    { endpoint: "Webhook Calls", limit: "500/hour", current: 123, tenant: "All Tenants" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Rate Limits</h1>
          <p className="text-muted-foreground">Configure API and system rate limits</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{limits.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Requests This Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">427</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rate Limited</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Rate Limit Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Current Limit</TableHead>
                  <TableHead>Current Usage</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {limits.map((limit, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{limit.endpoint}</TableCell>
                    <TableCell>{limit.limit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{limit.current}</span>
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${(limit.current / parseInt(limit.limit)) * 100}%` }} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{limit.tenant}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
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