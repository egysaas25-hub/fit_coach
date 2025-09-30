"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all")

  const clients = [
    {
      name: "Emily Carter",
      email: "emily.carter@example.com",
      status: "Active",
      lastWorkout: "2 days ago",
      adherence: 75,
    },
    {
      name: "David Lee",
      email: "david.lee@example.com",
      status: "Active",
      lastWorkout: "1 day ago",
      adherence: 92,
    },
    {
      name: "Olivia Brown",
      email: "olivia.brown@example.com",
      status: "Inactive",
      lastWorkout: "1 week ago",
      adherence: 53,
    },
    {
      name: "Ethan Clark",
      email: "ethan.clark@example.com",
      status: "Active",
      lastWorkout: "3 days ago",
      adherence: 82,
    },
    {
      name: "Sophia Vivas",
      email: "sophia.vivas@example.com",
      status: "Inactive",
      lastWorkout: "2 weeks ago",
      adherence: 42,
    },
  ]

  const filteredClients = clients.filter((client) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return client.status === "Active"
    if (activeTab === "inactive") return client.status === "Inactive"
    return true
  })

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        <div className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Add Client</Button>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search clients by name or email" className="pl-10" />
            </div>
          </div>

          <div className="mb-6 flex gap-6 border-b border-border">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "active"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("inactive")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "inactive"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Inactive
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Last Workout
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Adherence
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {filteredClients.map((client) => (
                  <tr key={client.email} className="hover:bg-muted/50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/.jpg?height=40&width=40&query=${client.name}`} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-foreground">{client.name}</div>
                          <div className="text-sm text-muted-foreground">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge
                        variant={client.status === "Active" ? "default" : "secondary"}
                        className={client.status === "Active" ? "bg-primary text-primary-foreground" : ""}
                      >
                        {client.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{client.lastWorkout}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Progress value={client.adherence} className="h-2 w-32" />
                        <span className="text-sm font-medium text-foreground">{client.adherence}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="fixed bottom-6 left-6 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/diverse-woman-portrait.png" />
            <AvatarFallback className="bg-primary/10 text-primary">SM</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">Sarah Miller</div>
            <div className="text-xs text-muted-foreground">Coach</div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
