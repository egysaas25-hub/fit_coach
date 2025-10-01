import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BillingSubscriptionsPage() {
  const subscriptions = [
    {
      tenant: "FitLife Gym",
      plan: "Enterprise",
      amount: "$2,450",
      nextBilling: "Apr 15, 2024",
      status: "Active",
    },
    {
      tenant: "PowerHouse Fitness",
      plan: "Professional",
      amount: "$1,280",
      nextBilling: "Apr 18, 2024",
      status: "Active",
    },
    {
      tenant: "Wellness Center",
      plan: "Professional",
      amount: "$1,280",
      nextBilling: "Apr 20, 2024",
      status: "Active",
    },
    { tenant: "Elite Training", plan: "Basic", amount: "$420", nextBilling: "Apr 22, 2024", status: "Active" },
    { tenant: "Yoga Studio Plus", plan: "Basic", amount: "$420", nextBilling: "Apr 25, 2024", status: "Trial" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Billing & Subscriptions</h1>
          <p className="text-muted-foreground">Manage tenant subscriptions and billing</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Subscriptions ({subscriptions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{sub.tenant}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{sub.plan}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{sub.amount}/month</TableCell>
                    <TableCell className="text-muted-foreground">{sub.nextBilling}</TableCell>
                    <TableCell>
                      <Badge variant={sub.status === "Active" ? "default" : "secondary"}>{sub.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
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
