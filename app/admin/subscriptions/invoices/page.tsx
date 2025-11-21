"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, RotateCcw, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shared/data-table/data-table"
import { downloadCSV, formatCurrency, formatDate } from "@/lib/utils/csv-generator"
import { PDFExportButton } from "@/components/shared/actions/PDFExportButton"

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

  // Export invoices to CSV
  const handleExportCSV = () => {
    if (!filteredInvoices.length) {
      alert('No invoices to export')
      return
    }

    const exportData = filteredInvoices.map(inv => ({
      invoiceId: inv.invoiceId,
      client: inv.client,
      amount: formatCurrency(inv.amount),
      status: inv.status,
      date: formatDate(inv.date),
      dueDate: formatDate(inv.dueDate),
    }))

    downloadCSV(exportData, {
      filename: 'invoices',
      columns: [
        { key: 'invoiceId', header: 'Invoice ID' },
        { key: 'client', header: 'Client' },
        { key: 'amount', header: 'Amount' },
        { key: 'status', header: 'Status' },
        { key: 'date', header: 'Date' },
        { key: 'dueDate', header: 'Due Date' },
      ],
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Invoices & Payments</h1>
            <p className="text-muted-foreground">Manage transactions and payment status</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by invoice ID or client..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleExportCSV} disabled={!filteredInvoices.length}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceId}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "Paid"
                            ? "default"
                            : invoice.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="View PDF"
                          onClick={() => {
                            setSelectedInvoice(invoice)
                            setShowPreview(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {invoice.status === "Overdue" && (
                          <Button variant="ghost" size="icon" title="Retry Payment">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" title="Resend">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

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
                    <h2 className="text-2xl font-bold text-foreground">INVOICE</h2>
                    <p className="text-muted-foreground text-sm">{selectedInvoice.invoiceId}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-muted-foreground text-sm mb-2">Bill To:</p>
                      <p className="font-semibold text-foreground">{selectedInvoice.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm mb-2">Invoice Details:</p>
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
                            ? "text-yellow-500"
                            : "text-destructive"
                      }`}
                    >
                      Status: {selectedInvoice.status}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              {selectedInvoice && (
                <PDFExportButton
                  endpoint="/api/export/invoice"
                  payload={{ invoiceId: selectedInvoice.id }}
                  filename={`invoice-${selectedInvoice.invoiceId}.pdf`}
                  label="Download PDF"
                />
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
