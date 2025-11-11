"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AdminSidebar } from "@/components/navigation/admin-sidebar"
import { useSubscriptions, useInvoices } from '@/lib/hooks/api/useBilling'
import { Subscription, Invoice } from '@/types/domain/billing'

export const dynamic = "force-dynamic";

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<"subscriptions" | "invoices" | "payment-history">("subscriptions")
  const { data: subscriptions, isLoading: subscriptionsLoading, error: subscriptionsError } = useSubscriptions()
  const { data: invoices, isLoading: invoicesLoading, error: invoicesError } = useInvoices()

  if (subscriptionsError || invoicesError) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading billing data</p>
          <p className="text-sm text-muted-foreground">
            {subscriptionsError?.message || invoicesError?.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
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
                {subscriptionsLoading ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12">
                    <div className="mb-4 h-32 w-32 overflow-hidden rounded-lg bg-muted animate-pulse" />
                    <div className="h-6 w-48 bg-muted rounded mb-4 animate-pulse" />
                    <div className="h-4 w-64 bg-muted rounded mb-6 animate-pulse" />
                    <div className="h-10 w-40 bg-muted rounded animate-pulse" />
                  </div>
                ) : subscriptions && subscriptions.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {subscriptions.map((subscription) => (
                      <div key={subscription.id} className="border border-border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold">{subscription.id}</h3>
                          <Badge 
                            variant={
                              subscription.status === 'active' ? 'default' : 
                              subscription.status === 'paused' ? 'secondary' : 
                              subscription.status === 'cancelled' ? 'destructive' : 'outline'
                            }
                          >
                            {subscription.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Plan: {subscription.planId}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Client: {subscription.clientId}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Amount: ${subscription.amount} {subscription.currency}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12">
                    <div className="mb-4 h-32 w-32 overflow-hidden rounded-lg bg-muted">
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
                )}
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold text-foreground">Past Subscriptions</h2>
                <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12">
                  <div className="mb-4 h-32 w-32 overflow-hidden rounded-lg bg-muted">
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
                    {invoicesLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                          Loading invoices...
                        </td>
                      </tr>
                    ) : invoices && invoices.length > 0 ? (
                      invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-muted/50">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                            {invoice.id}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                            {new Date(invoice.issuedDate).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                            {invoice.clientId}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                            ${invoice.amount} {invoice.currency}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <Badge
                              variant={
                                invoice.status === "paid" ? "default" : 
                                invoice.status === "overdue" ? "destructive" : "secondary"
                              }
                              className={
                                invoice.status === "paid" ? "bg-primary text-primary-foreground" : ""
                              }
                            >
                              {invoice.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                          No invoices found
                        </td>
                      </tr>
                    )}
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