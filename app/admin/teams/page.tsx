import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ManagementPage() {
  // Data from User Management
  const users = [
    { name: "Anna Carter", role: "Client", email: "anna@example.com", status: "Active", avatar: "AC" },
    { name: "Mike Johnson", role: "Trainer", email: "mike@example.com", status: "Active", avatar: "MJ" },
    { name: "John Smith", role: "Client", email: "john@example.com", status: "Active", avatar: "JS" },
    { name: "Sarah Lee", role: "Trainer", email: "sarah@example.com", status: "Active", avatar: "SL" },
    { name: "Admin User", role: "Admin", email: "admin@example.com", status: "Active", avatar: "AU" },
    { name: "Tom Martinez", role: "Client", email: "tom@example.com", status: "Inactive", avatar: "TM" },
  ]

  // Data from Role Management
  const roles = [
    { name: "Super Admin", permissions: 25, users: 2, description: "Full system access" },
    { name: "Admin", permissions: 18, users: 3, description: "Administrative access" },
    { name: "Trainer", permissions: 12, users: 28, description: "Trainer capabilities" },
    { name: "Client", permissions: 8, users: 86, description: "Client access" },
  ]

  // Data from Permission Management
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

  // Data from Team Dashboard
  const teams = [
    { name: "Team Alpha", members: 12, revenue: "$8,420", growth: "+15%", status: "Active" },
    { name: "Team Beta", members: 8, revenue: "$6,230", growth: "+8%", status: "Active" },
    { name: "Team Gamma", members: 15, revenue: "$12,150", growth: "+22%", status: "Active" },
    { name: "Team Delta", members: 6, revenue: "$4,890", growth: "+5%", status: "Active" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Admin Management</h1>
          <p className="text-muted-foreground">Manage users, roles, permissions, and teams</p>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Users ({users.length})</CardTitle>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-9 bg-background" />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user.name} />
                              <AvatarFallback>{user.avatar}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.role}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                        </TableCell>
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
          </TabsContent>

          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Roles ({roles.length})</CardTitle>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Role
                  </Button>
                </div>
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
          </TabsContent>

          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Permissions ({permissions.length})</CardTitle>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Permission
                  </Button>
                </div>
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
          </TabsContent>

          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance ({teams.length} Teams)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Growth</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{team.name}</TableCell>
                        <TableCell className="text-muted-foreground">{team.members} members</TableCell>
                        <TableCell className="font-medium">{team.revenue}</TableCell>
                        <TableCell className="text-primary">{team.growth}</TableCell>
                        <TableCell>
                          <Badge>{team.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}