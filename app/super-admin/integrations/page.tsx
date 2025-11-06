import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";
import { Plus, Settings, Zap, CheckCircle, XCircle } from "lucide-react"

export default function SuperAdminIntegrationsPage() {
  const integrations = [
    {
      name: "Stripe",
      description: "Payment processing and subscriptions",
      status: "Active",
      enabled: true,
      lastSync: "2 hours ago",
      icon: "💳",
    },
    {
      name: "SendGrid",
      description: "Email delivery service",
      status: "Active",
      enabled: true,
      lastSync: "5 minutes ago",
      icon: "✉️",
    },
    {
      name: "Slack",
      description: "Team communication",
      status: "Inactive",
      enabled: false,
      lastSync: "Never",
      icon: "💬",
    },
    {
      name: "Twilio",
      description: "SMS notifications",
      status: "Active",
      enabled: true,
      lastSync: "1 hour ago",
      icon: "📱",
    },
    {
      name: "AWS S3",
      description: "File storage",
      status: "Active",
      enabled: true,
      lastSync: "10 minutes ago",
      icon: "☁️",
    },
    {
      name: "Google Analytics",
      description: "Website analytics",
      status: "Active",
      enabled: true,
      lastSync: "30 minutes ago",
      icon: "📊",
    },
  ]

  const availableIntegrations = [
    { name: "Zapier", description: "Workflow automation", icon: "⚡" },
    { name: "Mailchimp", description: "Email marketing", icon: "📧" },
    { name: "Salesforce", description: "CRM integration", icon: "💼" },
    { name: "HubSpot", description: "Marketing automation", icon: "🎯" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Platform Integrations</h1>
            <p className="text-muted-foreground">Manage third-party integrations and connections</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Integration
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{integrations.length}</div>
              <p className="text-xs text-muted-foreground">Configured</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                {integrations.filter((i) => i.enabled).length}
              </div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inactive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {integrations.filter((i) => !i.enabled).length}
              </div>
              <p className="text-xs text-muted-foreground">Disabled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableIntegrations.length}</div>
              <p className="text-xs text-muted-foreground">Ready to add</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Integration</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {integrations.map((integration, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <span className="font-medium">{integration.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{integration.description}</TableCell>
                    <TableCell>
                      <Badge variant={integration.status === "Active" ? "default" : "secondary"}>
                        {integration.status === "Active" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {integration.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{integration.lastSync}</TableCell>
                    <TableCell>
                      <Switch checked={integration.enabled} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Available Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {availableIntegrations.map((integration, i) => (
                <Card key={i} className="hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-4xl mb-3">{integration.icon}</div>
                      <h3 className="font-semibold mb-1">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}