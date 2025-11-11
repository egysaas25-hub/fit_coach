"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const chartData = [
  { month: "Jan", revenue: 2400 },
  { month: "Feb", revenue: 2800 },
  { month: "Mar", revenue: 3200 },
  { month: "Apr", revenue: 3600 },
  { month: "May", revenue: 4000 },
  { month: "Jun", revenue: 4400 },
]

const billingHistory = [
  {
    id: "INV-001",
    date: "2025-01-15",
    amount: "$299",
    status: "Paid",
    plan: "Pro Plan",
  },
  {
    id: "INV-002",
    date: "2024-12-15",
    amount: "$299",
    status: "Paid",
    plan: "Pro Plan",
  },
  {
    id: "INV-003",
    date: "2024-11-15",
    amount: "$199",
    status: "Paid",
    plan: "Starter Plan",
  },
  {
    id: "INV-004",
    date: "2024-10-15",
    amount: "$199",
    status: "Overdue",
    plan: "Starter Plan",
  },
]

export default function BillingPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">Billing & Usage</h1>
        <p className="text-secondary">Manage your subscription plan and monitor usage</p>
      </div>

      {/* Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-poppins font-bold text-foreground mb-2">Current Plan</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">Pro</span>
                <span className="text-secondary">Plan</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-secondary mb-1">Next Renewal</p>
              <p className="text-lg font-semibold text-foreground">2025-02-15</p>
            </div>
          </div>

          <div className="border-t border-[#2a2d2b] pt-4 mb-4">
            <p className="text-sm text-secondary mb-3">Features Included:</p>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Unlimited Clients
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> AI Tools & Automation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Advanced Analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Priority Support
              </li>
            </ul>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="flex-1 bg-primary text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Upgrade
            </button>
            <button className="flex-1 bg-muted text-foreground px-4 py-2 rounded-lg font-semibold hover:bg-accent transition-colors">
              Downgrade
            </button>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="bg-[#1a1d1b] border border-[#2a2d2b] rounded-lg p-6">
          <h3 className="text-lg font-poppins font-bold text-foreground mb-4">Usage This Month</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-secondary">Storage</span>
                <span className="text-sm font-semibold text-foreground">7.5 / 10 GB</span>
              </div>
              <div className="w-full bg-[#0B0E0C] border border-[#2a2d2b] rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full" style={{ width: "75%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-secondary">Messages</span>
                <span className="text-sm font-semibold text-foreground">500 / 1000</span>
              </div>
              <div className="w-full bg-[#0B0E0C] border border-[#2a2d2b] rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full" style={{ width: "50%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-secondary">API Calls</span>
                <span className="text-sm font-semibold text-foreground">8500 / 10000</span>
              </div>
              <div className="w-full bg-[#0B0E0C] border border-[#2a2d2b] rounded-full h-2 overflow-hidden">
                <div className="bg-yellow-500 h-full" style={{ width: "85%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#1a1d1b] border border-[#2a2d2b] rounded-lg p-6">
        <h3 className="text-lg font-poppins font-bold text-foreground mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d2b" />
            <XAxis dataKey="month" stroke="#b3b3b3" />
            <YAxis stroke="#b3b3b3" />
            <Tooltip contentStyle={{ backgroundColor: "#1a1d1b", border: "1px solid #2a2d2b" }} />
            <Line type="monotone" dataKey="revenue" stroke="#00c26a" strokeWidth={2} dot={{ fill: "#00c26a" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Billing History */}
      <div className="bg-[#1a1d1b] border border-[#2a2d2b] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#2a2d2b] flex justify-between items-center">
          <h3 className="text-lg font-poppins font-bold text-foreground">Billing History</h3>
          <button className="bg-[#2a2d2b] text-foreground px-4 py-2 rounded-lg hover:bg-[#3a3d3b] transition-colors flex items-center gap-2 text-sm">
            📥 Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2d2b] bg-[#0B0E0C]">
                <th className="px-6 py-3 text-left text-secondary font-semibold">Invoice ID</th>
                <th className="px-6 py-3 text-left text-secondary font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-secondary font-semibold">Plan</th>
                <th className="px-6 py-3 text-left text-secondary font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-secondary font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-secondary font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((item) => (
                <tr key={item.id} className="border-b border-[#2a2d2b] hover:bg-[#2a2d2b] transition-colors">
                  <td className="px-6 py-3 text-foreground font-mono">{item.id}</td>
                  <td className="px-6 py-3 text-secondary">{item.date}</td>
                  <td className="px-6 py-3 text-secondary">{item.plan}</td>
                  <td className="px-6 py-3 text-foreground font-semibold">{item.amount}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "Paid"
                          ? "bg-green-500 bg-opacity-20 text-green-400"
                          : "bg-red-500 bg-opacity-20 text-red-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <button className="text-primary hover:opacity-80 transition-opacity">Download PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1d1b] border border-[#2a2d2b] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-poppins font-bold text-foreground mb-4">Upgrade Plan</h3>
            <div className="space-y-3 mb-6">
              <div className="p-4 border border-[#2a2d2b] rounded-lg cursor-pointer hover:border-primary transition-colors">
                <p className="font-semibold text-foreground">Business Plan</p>
                <p className="text-sm text-secondary">$499/month</p>
              </div>
              <div className="p-4 border border-[#2a2d2b] rounded-lg cursor-pointer hover:border-primary transition-colors">
                <p className="font-semibold text-foreground">Enterprise Plan</p>
                <p className="text-sm text-secondary">Custom pricing</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 bg-[#2a2d2b] text-foreground px-4 py-2 rounded-lg hover:bg-[#3a3d3b] transition-colors font-medium"
              >
                Cancel
              </button>
              <button className="flex-1 bg-primary text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-semibold">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
