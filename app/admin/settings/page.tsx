"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Zap, Palette, User, CreditCard, Globe, MessageSquare, Shield, Mail, Bell } from "lucide-react"
import Link from "next/link"

const settingsCategories = [
  {
    title: "Integrations",
    description: "Connect external services and manage API integrations",
    icon: Zap,
    href: "/admin/settings/integrations",
    status: "configured",
    items: ["WhatsApp", "Email", "Payment Gateways", "Analytics"],
  },
  {
    title: "WhatsApp Settings",
    description: "Configure WhatsApp Business API and messaging preferences",
    icon: MessageSquare,
    href: "/admin/settings/whatsapp",
    status: "connected",
    items: ["API Configuration", "Message Templates", "Webhook Settings"],
  },
  {
    title: "Email Settings",
    description: "Configure email provider and SMTP settings",
    icon: Mail,
    href: "/admin/settings/email",
    status: "configured",
    items: ["SMTP Configuration", "Sender Information", "Test Email"],
  },
  {
    title: "Branding",
    description: "Customize your platform appearance and client-facing materials",
    icon: Palette,
    href: "/admin/settings/branding",
    status: "customized",
    items: ["Logo & Colors", "Email Templates", "PDF Branding", "Client Portal"],
  },
  {
    title: "Notifications",
    description: "Configure notification preferences for different events",
    icon: Bell,
    href: "/admin/settings/notifications",
    status: "configured",
    items: ["Email Alerts", "WhatsApp Alerts", "Push Notifications"],
  },
  {
    title: "Account Settings",
    description: "Manage your account information and security preferences",
    icon: User,
    href: "/admin/settings/account",
    status: "active",
    items: ["Profile Information", "Password", "Two-Factor Auth", "Security"],
  },
  {
    title: "Billing & Usage",
    description: "View subscription details, usage metrics, and billing information",
    icon: CreditCard,
    href: "/admin/settings/billing",
    status: "active",
    items: ["Subscription Plan", "Usage Metrics", "Billing History", "Payment Methods"],
  },
  {
    title: "General Settings",
    description: "Configure general platform settings and preferences",
    icon: Globe,
    href: "/admin/settings/general",
    status: "configured",
    items: ["Timezone", "Language", "Date Format", "Default Settings"],
  },
]

const recentChanges = [
  {
    id: 1,
    setting: "WhatsApp API",
    change: "Updated webhook URL configuration",
    user: "Admin User",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    setting: "Branding",
    change: "Updated company logo and primary color",
    user: "Sarah Johnson",
    timestamp: "1 day ago",
  },
  {
    id: 3,
    setting: "Billing",
    change: "Added new payment method",
    user: "Admin User", 
    timestamp: "3 days ago",
  },
  {
    id: 4,
    setting: "Integrations",
    change: "Connected Stripe payment gateway",
    user: "Mike Chen",
    timestamp: "1 week ago",
  },
]

const statusColors: Record<string, string> = {
  connected: "bg-green-500",
  configured: "bg-blue-500",
  customized: "bg-purple-500",
  active: "bg-green-500",
  pending: "bg-yellow-500",
  error: "bg-red-500",
}

const statusLabels: Record<string, string> = {
  connected: "Connected",
  configured: "Configured", 
  customized: "Customized",
  active: "Active",
  pending: "Pending",
  error: "Error",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your platform configuration and preferences</p>
        </div>
        <Button variant="outline">
          <Shield className="h-4 w-4 mr-2" />
          Security Audit
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Settings</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{settingsCategories.length}</div>
            <p className="text-xs text-muted-foreground">Configuration areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Connected services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h</div>
            <p className="text-xs text-muted-foreground">WhatsApp settings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">95%</div>
            <p className="text-xs text-muted-foreground">Excellent</p>
          </CardContent>
        </Card>
      </div>

      {/* Settings Categories */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Configuration Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCategories.map((category) => (
            <Card key={category.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${statusColors[category.status]}`}></div>
                        <Badge variant="outline" className="text-xs">
                          {statusLabels[category.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Includes:</p>
                  <div className="flex flex-wrap gap-1">
                    {category.items.map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href={category.href}>
                    Configure
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Changes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentChanges.map((change) => (
              <div key={change.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div>
                  <p className="font-medium text-foreground">{change.setting}</p>
                  <p className="text-sm text-muted-foreground">{change.change}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{change.user}</p>
                  <p className="text-xs text-muted-foreground">{change.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Version</span>
              <span className="font-medium">v2.1.4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database Version</span>
              <span className="font-medium">PostgreSQL 15.2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Backup</span>
              <span className="font-medium">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uptime</span>
              <span className="font-medium">99.9%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Zap className="h-4 w-4 mr-2" />
              Test All Integrations
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Run Security Scan
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Globe className="h-4 w-4 mr-2" />
              Export Configuration
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}