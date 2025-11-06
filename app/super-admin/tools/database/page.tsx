import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save } from "lucide-react"

export default function SystemConfigurationPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">System Configuration</h1>
          <p className="text-muted-foreground">Configure global platform settings</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="VTrack" className="bg-background" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" defaultValue="support@vtrack.com" className="bg-background" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-users">Max Users Per Tenant</Label>
                <Input id="max-users" type="number" defaultValue="500" className="bg-background" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-limit">API Rate Limit (per hour)</Label>
                <Input id="api-limit" type="number" defaultValue="10000" className="bg-background" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ai-features">AI Features</Label>
                  <p className="text-xs text-muted-foreground">Enable AI-powered recommendations</p>
                </div>
                <Switch id="ai-features" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics">Advanced Analytics</Label>
                  <p className="text-xs text-muted-foreground">Enable detailed analytics dashboard</p>
                </div>
                <Switch id="analytics" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="referrals">Referral Program</Label>
                  <p className="text-xs text-muted-foreground">Enable user referral system</p>
                </div>
                <Switch id="referrals" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">Put platform in maintenance mode</p>
                </div>
                <Switch id="maintenance" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" defaultValue="smtp.example.com" className="bg-background" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" type="number" defaultValue="587" className="bg-background" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-user">SMTP Username</Label>
                <Input id="smtp-user" defaultValue="noreply@vtrack.com" className="bg-background" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-pass">SMTP Password</Label>
                <Input id="smtp-pass" type="password" defaultValue="••••••••" className="bg-background" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maintenance-message">Message</Label>
                <Textarea
                  id="maintenance-message"
                  rows={6}
                  defaultValue="We are currently performing scheduled maintenance. The platform will be back online shortly."
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated-time">Estimated Downtime</Label>
                <Input id="estimated-time" defaultValue="2 hours" className="bg-background" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button size="lg">
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </main>
    </div>
  )
}
