import { TrainerSidebar } from "@/components/trainer-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Calendar, DollarSign, ArrowUpRight } from "lucide-react"

export default function TrainerDashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Trainer Dashboard</h1>
          <p className="text-muted-foreground">Overview of your clients and performance</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-primary" />
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Client Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">Goals on track</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,420</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-primary" />
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {[120, 135, 128, 142, 138, 145, 142].map((value, i) => {
                  const height = (value / 150) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs font-medium text-muted-foreground">{value}</div>
                      <div className="w-full bg-primary rounded-t" style={{ height: `${height}%` }} />
                      <div className="text-xs text-muted-foreground">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Anna Carter" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Anna Carter completed workout</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="John Smith" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">John Smith logged weight</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
                <Badge variant="secondary">Updated</Badge>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Lee" />
                  <AvatarFallback>SL</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sarah Lee sent a message</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <Badge variant="outline">Message</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Anna Carter", progress: 75, lastActivity: "2 hours ago", status: "Active" },
                { name: "John Smith", progress: 60, lastActivity: "4 hours ago", status: "Active" },
                { name: "Sarah Lee", progress: 85, lastActivity: "Yesterday", status: "Active" },
                { name: "Mike Brown", progress: 45, lastActivity: "2 days ago", status: "Active" },
              ].map((client, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={client.name} />
                    <AvatarFallback>
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">Last activity: {client.lastActivity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{client.progress}%</p>
                    <p className="text-xs text-muted-foreground">Progress</p>
                  </div>
                  <Badge>{client.status}</Badge>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
