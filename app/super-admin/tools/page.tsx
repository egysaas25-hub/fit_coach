import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wrench, Database, Users, FileText, Download, Upload, RefreshCw } from "lucide-react"

export default function SuperAdminToolsPage() {
  const tools = [
    {
      name: "Database Maintenance",
      description: "Optimize and maintain database performance",
      icon: Database,
      actions: ["Run Optimization", "Clear Cache", "Rebuild Indexes"],
    },
    {
      name: "User Management",
      description: "Bulk user operations and data management",
      icon: Users,
      actions: ["Export Users", "Import Users", "Bulk Update"],
    },
    {
      name: "Data Migration",
      description: "Migrate data between environments",
      icon: Upload,
      actions: ["Start Migration", "View History", "Rollback"],
    },
    {
      name: "System Reports",
      description: "Generate system-wide reports",
      icon: FileText,
      actions: ["Generate Report", "Schedule Report", "Export Data"],
    },
    {
      name: "Cache Management",
      description: "Manage application and database caches",
      icon: RefreshCw,
      actions: ["Clear All Cache", "Clear Redis", "Clear CDN"],
    },
    {
      name: "Data Export",
      description: "Export platform data for analysis",
      icon: Download,
      actions: ["Export Analytics", "Export Users", "Export Logs"],
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">System Tools</h1>
          <p className="text-muted-foreground">Administrative tools and utilities</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, i) => {
            const Icon = tool.icon
            return (
              <Card key={i} className="hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {tool.actions.map((action, j) => (
                    <Button key={j} variant="outline" className="w-full justify-start" size="sm">
                      {action}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              <Button variant="outline" className="justify-start">
                <Database className="mr-2 h-4 w-4" />
                Optimize DB
              </Button>
              <Button variant="outline" className="justify-start">
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear Cache
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}