import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function PermissionManagementPage() {
  const permissions = [
    { name: "View Users", category: "Users", roles: ["Admin", "Super Admin"] },
    { name: "Create Users", category: "Users", roles: ["Admin", "Super Admin"] },
    { name: "Edit Users", category: "Users", roles: ["Admin", "Super Admin"] },
    { name: "Delete Users", category: "Users", roles: ["Super Admin"] },
    { name: "View Clients", category: "Clients", roles: ["Trainer", "Admin", "Super Admin"] },
    { name: "Manage Clients", category: "Clients", roles: ["Trainer", "Admin", "Super Admin"] },
    { name: "View Reports", category: "Analytics", roles: ["Admin", "Super Admin"] },
    { name: "Export Data", category: "Analytics", roles: ["Admin", "Super Admin"] },
    { name: "System Settings", category: "System", roles: ["Super Admin"] },
    { name: "Manage Roles", category: "System", roles: ["Super Admin"] },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Permission Management</h1>
            <p className="text-muted-foreground">Configure system permissions and role assignments</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Permission
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Permissions ({permissions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {permissions.map((permission, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <Checkbox />
                    <div>
                      <p className="text-sm font-medium">{permission.name}</p>
                      <p className="text-xs text-muted-foreground">{permission.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {permission.roles.map((role, j) => (
                      <Badge key={j} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
