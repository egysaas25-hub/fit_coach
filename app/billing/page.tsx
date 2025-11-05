"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layouts/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<"subscriptions" | "invoices" | "payment-history">("subscriptions")

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        <div className="border-b border-border bg-card px-8 py-6">
          <h1 className="text-3xl font-bold text-foreground">Billing</h1>
        </div>

        <div className="p-8">
          <div className="mb-6 flex gap-6 border-b border-border">
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "subscriptions"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Subscriptions
            </button>
            <button
              onClick={() => setActiveTab("invoices")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "invoices"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Invoices
            </button>
            <button
              onClick={() => setActiveTab("payment-history")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "payment-history"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Payment History
            </button>
          </div>

          {activeTab === "subscriptions" && (
            <div className="space-y-8">
              <div>
                <h2 className="mb-4 text-xl font-semibold text-foreground">Active Subscriptions</h2>
                <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12">
                  <div className="mb-4 h-32 w-32 overflow-hidden rounded-lg bg-[#f5e6d3]">
                    <img src="/empty-cardboard-box.jpg" alt="Empty box" className="h-full w-full object-cover" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">No active subscriptions</h3>
                  <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
                    You don't have any active subscriptions yet. Create a subscription for your clients to manage their
                    payments.
                  </p>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Create Subscription
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold text-foreground">Past Subscriptions</h2>
                <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12">
                  <div className="mb-4 h-32 w-32 overflow-hidden rounded-lg bg-[#f5e6d3]">
                    <img src="/cardboard-package-with-label.jpg" alt="Package" className="h-full w-full object-cover" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">No past subscriptions</h3>
                  <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
                    You don't have any past subscriptions yet. Once a subscription for your clients ends, it will appear
                    here.
                  </p>
                  <Button variant="outline">View Invoices</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "invoices" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Client Billing</h2>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">New</Button>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">Manage invoices and payments for your clients.</p>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search invoices by name or ID..." className="pl-10" />
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Invoice #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {[
                      {
                        id: "INV-2024-001",
                        date: "July 20, 2024",
                        client: "Alex Johnson",
                        amount: "$150.00",
                        status: "Paid",
                      },
                      {
                        id: "INV-2024-002",
                        date: "August 20, 2024",
                        client: "Maria Garcia",
                        amount: "$150.00",
                        status: "Paid",
                      },
                      {
                        id: "INV-2024-003",
                        date: "September 20, 2024",
                        client: "James Smith",
                        amount: "$150.00",
                        status: "Paid",
                      },
                      {
                        id: "INV-2024-004",
                        date: "October 20, 2024",
                        client: "Emma Wilson",
                        amount: "$150.00",
                        status: "Paid",
                      },
                      {
                        id: "INV-2024-005",
                        date: "November 20, 2024",
                        client: "Ben Wilson",
                        amount: "$120.00",
                        status: "Overdue",
                      },
                    ].map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-muted/50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                          {invoice.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{invoice.date}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{invoice.client}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">{invoice.amount}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <Badge
                            variant={invoice.status === "Paid" ? "default" : "destructive"}
                            className={invoice.status === "Paid" ? "bg-primary text-primary-foreground" : ""}
                          >
                            {invoice.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "payment-history" && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12">
              <h3 className="mb-2 text-lg font-semibold text-foreground">No payment history</h3>
              <p className="text-sm text-muted-foreground">
                Payment history will appear here once transactions are made.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
