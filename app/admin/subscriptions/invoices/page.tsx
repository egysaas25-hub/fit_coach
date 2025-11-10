"use client"

import { useState } from "react"
import DataTable from "@/components/workspace/data-table"
import { Download, Eye, RotateCcw, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Invoice {
  id: string
  invoiceId: string
  client: string
  amount: number
  status: "Paid" | "Pending" | "Overdue"
  date: string
  dueDate: string
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceId: "INV-2025-001",
    client: "Acme Corp",
    amount: 2950,
    status: "Paid",
    date: "2025-01-15",
    dueDate: "2025-02-15",
  },
  {
    id: "2",
    invoiceId: "INV-2025-002",
    client: "TechStart Inc",
    amount: 7900,
    status: "Paid",
    date: "2025-01-10",
    dueDate: "2025-02-10",
  },
  {
    id: "3",
    invoiceId: "INV-2025-003",
    client: "Fitness Pro",
    amount: 4920,
    status: "Pending",
    date: "2025-01-20",
    dueDate: "2025-02-20",
  },
  {
    id: "4",
    invoiceId: "INV-2025-004",
    client: "Health Solutions",
    amount: 19900,
    status: "Overdue",
    date: "2024-12-15",
    dueDate: "2025-01-15",
  },
  {
    id: "5",
    invoiceId: "INV-2025-005",
    client: "Wellness Center",
    amount: 7920,
    status: "Overdue",
    date: "2024-12-20",
    dueDate: "2025-01-20",
  },
]

export default function InvoicesPage() {
  const [invoices] = useState<Invoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const filteredInvoices = invoices.filter(
    (inv) =>
      (statusFilter === "All" || inv.status === statusFilter) &&
      (inv.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-poppins text-foreground mb-2">Invoices & Payments</h1>
        <p className="text-muted-foreground">Manage transactions and payment status</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by invoice ID or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
          >
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
          </select>
        </div>

        <button className="btn-primary flex items-center gap-2">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Invoices Table */}
      <div className="card">
        <DataTable<Invoice>
          columns={[
            {
              key: "invoiceId",
              label: "Invoice ID",
              sortable: true,
            },
            {
              key: "client",
              label: "Client",
              sortable: true,
            },
            {
              key: "amount",
              label: "Amount",
              sortable: true,
              render: (amount) => `$${amount.toLocaleString()}`,
            },
            {
              key: "date",
              label: "Date",
              sortable: true,
            },
            {
              key: "dueDate",
              label: "Due Date",
              sortable: true,
            },
            {
              key: "status",
              label: "Status",
              render: (status) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    status === "Paid"
                      ? "bg-primary/20 text-primary"
                      : status === "Pending"
                        ? "bg-warning/20 text-warning"
                        : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {status}
                </span>
              ),
            },
            {
              key: "id",
              label: "Actions",
              render: (id) => {
                const invoice = invoices.find((i) => i.id === id)
                return (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice || null)
                        setShowPreview(true)
                      }}
                      className="p-1 hover:bg-border rounded transition-colors"
                      title="View PDF"
                    >
                      <Eye size={16} className="text-primary" />
                    </button>
                    {invoice?.status === "Overdue" && (
                      <button className="p-1 hover:bg-border rounded transition-colors" title="Retry Payment">
                        <RotateCcw size={16} className="text-yellow-500" />
                      </button>
                    )}
                    <button className="p-1 hover:bg-border rounded transition-colors" title="Resend">
                      <Download size={16} className="text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                )
              },
            },
          ]}
          data={filteredInvoices}
        />
      </div>

      {/* Invoice Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
            <div className="bg-background p-8 rounded-lg border border-border">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold font-poppins text-foreground">INVOICE</h2>
                <p className="text-secondary text-sm">{selectedInvoice.invoiceId}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-secondary text-sm mb-2">Bill To:</p>
                  <p className="font-semibold text-foreground">{selectedInvoice.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-secondary text-sm mb-2">Invoice Details:</p>
                  <p className="text-foreground">Date: {selectedInvoice.date}</p>
                  <p className="text-foreground">Due: {selectedInvoice.dueDate}</p>
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <p className="text-2xl font-bold text-primary">Amount: ${selectedInvoice.amount.toLocaleString()}</p>
                <p
                  className={`text-sm font-semibold mt-2 ${
                    selectedInvoice.status === "Paid"
                      ? "text-primary"
                      : selectedInvoice.status === "Pending"
                        ? "text-warning"
                        : "text-destructive"
                  }`}
                >
                  Status: {selectedInvoice.status}
                </p>
              </div>
            </div>

            <DialogFooter className="flex gap-3">
              <button onClick={() => setShowPreview(false)} className="btn-secondary">
                Close
              </button>
              <button className="btn-primary flex items-center gap-2">
                <Download size={16} />
                Download PDF
              </button>
            </DialogFooter>
          </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
