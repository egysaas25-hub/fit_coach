import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Zap, CheckCircle, XCircle } from "lucide-react"

export default function AdminIntegrationsPage() {
  const integrations = [
    { name: "Stripe", status: "Connected", description: "Payment processing", icon: "💳", lastSync: "2 min ago", enabled: true },
    { name: "Mailchimp", status: "Not Connected", description: "Email marketing", icon: "📧", lastSync: "N/A", enabled: false },
    { name: "Zoom", status: "Connected", description: "Video calls", icon: "📹", lastSync: "1 hour ago", enabled: true },
    { name: "Slack", status: "Connected", description: "Team communication", icon: "💬", lastSync: "5 min ago", enabled: true },
    { name: "Google Calendar", status: "Connected", description: "Schedule management", icon: "📅", lastSync: "10 min ago", enabled: true },
    { name: "Twilio", status: "Not Connected", description: "SMS notifications", icon: "📱", lastSync: "N/A", enabled: false },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Integrations</h1>
          <p className="text-muted-foreground">Manage third-party integrations and connections</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{integrations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Connected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                {integrations.filter(i => i.status === "Connected").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{integrations.filter(i => i.enabled).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration, i) => (
            <Card key={i} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{integration.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {integration.status === "Connected" ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Badge variant={integration.status === "Connected" ? "default" : "secondary"}>
                      {integration.status}
                    </Badge>
                  </div>
                  <Switch checked={integration.enabled} />
                </div>
                <div className="text-xs text-muted-foreground">
                  Last sync: {integration.lastSync}
                </div>
                <Button variant="outline" className="w-full">
                  {integration.status === "Connected" ? "Configure" : "Connect"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}