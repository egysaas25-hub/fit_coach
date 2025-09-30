"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export function CustomerSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const tickets = [
    {
      id: "TKT-2024-001",
      subject: "Unable to access workout plans",
      priority: "High",
      status: "Open",
      assignedTo: "Sarah Miller",
      created: "2 hours ago",
    },
    {
      id: "TKT-2024-002",
      subject: "Billing inquiry for premium subscription",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "John Davis",
      created: "5 hours ago",
    },
    {
      id: "TKT-2024-003",
      subject: "Request for nutrition plan customization",
      priority: "Low",
      status: "Open",
      assignedTo: "Emily Carter",
      created: "1 day ago",
    },
    {
      id: "TKT-2024-004",
      subject: "App crashes on iOS device",
      priority: "High",
      status: "Resolved",
      assignedTo: "Michael Brown",
      created: "2 days ago",
    },
    {
      id: "TKT-2024-005",
      subject: "Feature request: Progress photo gallery",
      priority: "Low",
      status: "Open",
      assignedTo: "Lisa Anderson",
      created: "3 days ago",
    },
  ]

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your email to create a new password.",
    },
    {
      question: "How do I update my subscription plan?",
      answer:
        "Navigate to Settings > Billing and select 'Change Plan'. Choose your desired subscription tier and confirm the changes. The new plan will take effect immediately.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer:
        "Yes, you can cancel your subscription at any time from the Billing section in Settings. Your access will continue until the end of your current billing period.",
    },
    {
      question: "How do I track my workout progress?",
      answer:
        "Go to the Progress tab in your dashboard to view detailed analytics, charts, and workout history. You can also log workouts manually or sync with fitness devices.",
    },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Support</h1>
          <p className="text-muted-foreground mt-1">Manage support tickets and help clients</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">New Ticket</Button>
      </div>

      {/* Support Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open Tickets</p>
              <p className="text-3xl font-bold text-foreground mt-1">12</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-3xl font-bold text-foreground mt-1">8</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolved Today</p>
              <p className="text-3xl font-bold text-foreground mt-1">15</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-3xl font-bold text-foreground mt-1">2.5h</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Support Tickets Table */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Customer Support Tickets</h3>
            <p className="text-sm text-muted-foreground">View and manage all support requests</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ticket ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Assigned To</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm text-foreground font-mono">{ticket.id}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{ticket.subject}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ticket.priority === "High"
                            ? "bg-red-500/10 text-red-500"
                            : ticket.priority === "Medium"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ticket.status === "Resolved"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : ticket.status === "In Progress"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{ticket.assignedTo}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{ticket.created}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-400">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* FAQ Section */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h3>
            <p className="text-sm text-muted-foreground">Common questions and answers</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-border pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
