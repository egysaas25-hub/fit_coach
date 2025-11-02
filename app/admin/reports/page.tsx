import { AdminSidebar } from "@/components/layouts/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react"

export default function AdminReportsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Overview of platform performance and metrics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">119</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$15,000</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+1.5%</div>
              <p className="text-xs text-muted-foreground">Month over month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">847</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {[12000, 13500, 14200, 14800, 15200, 15000].map((value, i) => {
                  const height = (value / 16000) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs font-medium text-muted-foreground">${(value / 1000).toFixed(1)}k</div>
                      <div className="w-full bg-primary rounded-t" style={{ height: `${height}%` }} />
                      <div className="text-xs text-muted-foreground">
                        {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][i]}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {[85, 92, 98, 105, 112, 119].map((value, i) => {
                  const height = (value / 130) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs font-medium text-muted-foreground">{value}</div>
                      <div className="w-full bg-accent rounded-t" style={{ height: `${height}%` }} />
                      <div className="text-xs text-muted-foreground">
                        {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][i]}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "Anna Carter", plan: "Premium Monthly", amount: "$49.99", date: "2 hours ago" },
                { user: "John Smith", plan: "Basic Annual", amount: "$299.99", date: "5 hours ago" },
                { user: "Sarah Lee", plan: "Premium Monthly", amount: "$49.99", date: "Yesterday" },
                { user: "Mike Brown", plan: "Premium Annual", amount: "$499.99", date: "2 days ago" },
              ].map((sale, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium">{sale.user}</p>
                    <p className="text-xs text-muted-foreground">{sale.plan}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{sale.amount}</p>
                    <p className="text-xs text-muted-foreground">{sale.date}</p>
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
