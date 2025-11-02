import { AdminSidebar } from "@/components/layouts/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function RoleManagementPage() {
  const roles = [
    { name: "Super Admin", permissions: 25, users: 2, description: "Full system access" },
    { name: "Admin", permissions: 18, users: 3, description: "Administrative access" },
    { name: "Trainer", permissions: 12, users: 28, description: "Trainer capabilities" },
    { name: "Client", permissions: 8, users: 86, description: "Client access" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Role Management</h1>
            <p className="text-muted-foreground">Manage user roles and permissions</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Roles ({roles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell className="text-muted-foreground">{role.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{role.permissions} permissions</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{role.users} users</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
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
  )
}
