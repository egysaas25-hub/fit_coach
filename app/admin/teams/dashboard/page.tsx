import { AdminSidebar } from "@/components/layouts/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TeamDashboardPage() {
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
          <h1 className="text-3xl font-bold text-balance mb-2">Per Team Dashboard</h1>
          <p className="text-muted-foreground">Team-specific performance metrics and statistics</p>
        </div>

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
      </main>
    </div>
  )
}
