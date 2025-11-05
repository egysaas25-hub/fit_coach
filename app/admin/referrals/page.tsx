import { AdminSidebar } from "@/components/navigation/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table";

export default function ReferralManagementPage() {
  const referrals = [
    { referrer: "Anna Carter", referred: "Mike Brown", status: "Completed", reward: "$25", date: "Mar 28, 2024" },
    { referrer: "John Smith", referred: "Sarah Lee", status: "Pending", reward: "$25", date: "Mar 25, 2024" },
    { referrer: "Mike Johnson", referred: "Tom Martinez", status: "Completed", reward: "$25", date: "Mar 20, 2024" },
    { referrer: "Sarah Lee", referred: "Emily Davis", status: "Completed", reward: "$25", date: "Mar 15, 2024" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Referral Management</h1>
          <p className="text-muted-foreground">Track and manage user referrals and rewards</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Referrals ({referrals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Referred User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{referral.referrer}</TableCell>
                    <TableCell className="text-muted-foreground">{referral.referred}</TableCell>
                    <TableCell className="text-muted-foreground">{referral.date}</TableCell>
                    <TableCell>
                      <Badge variant={referral.status === "Completed" ? "default" : "secondary"}>
                        {referral.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{referral.reward}</TableCell>
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
