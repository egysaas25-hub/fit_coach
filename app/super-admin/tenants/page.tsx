import { SuperAdminSidebar } from "@/components/navigation/super-admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";
import Link from "next/link"

export default function TenantManagementPage() {
  const tenants = [
    { id: "1", name: "FitLife Gym", plan: "Enterprise", users: 245, status: "Active" },
    { id: "2", name: "PowerHouse Fitness", plan: "Professional", users: 128, status: "Active" },
    { id: "3", name: "Wellness Center", plan: "Professional", users: 89, status: "Active" },
    { id: "4", name: "Elite Training", plan: "Basic", users: 42, status: "Active" },
    { id: "5", name: "Yoga Studio Plus", plan: "Basic", users: 35, status: "Trial" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Tenant Management</h1>
            <p className="text-muted-foreground">Manage all platform tenants and organizations</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Tenant
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tenants..." className="pl-9 bg-background" />
              </div>
              <CardTitle className="text-base">All Tenants ({tenants.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant Name</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{tenant.plan}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{tenant.users} users</TableCell>
                    <TableCell>
                      <Badge variant={tenant.status === "Active" ? "default" : "secondary"}>{tenant.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/super-admin/tenants/${tenant.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
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
