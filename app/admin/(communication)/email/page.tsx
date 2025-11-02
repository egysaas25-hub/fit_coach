"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/layouts/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Send, Inbox, Archive, Trash2, Star, Mail } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockEmails = [
  {
    id: 1,
    from: "Anna Carter",
    email: "anna@example.com",
    subject: "Question about workout plan",
    preview: "Hi, I wanted to ask about the new exercises...",
    date: "2 hours ago",
    status: "unread",
    starred: true,
  },
  {
    id: 2,
    from: "John Smith",
    email: "john@example.com",
    subject: "Payment confirmation",
    preview: "Thank you for the updated meal plan...",
    date: "5 hours ago",
    status: "read",
    starred: false,
  },
  {
    id: 3,
    from: "Sarah Lee",
    email: "sarah@example.com",
    subject: "Schedule change request",
    preview: "Can we move tomorrow's session to...",
    date: "1 day ago",
    status: "read",
    starred: false,
  },
]

export default function CommunicationEmailPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("inbox")

  const filteredEmails = mockEmails.filter(email =>
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Email Communication</h1>
              <p className="text-sm text-muted-foreground">Manage client email communications</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Send className="mr-2 h-4 w-4" />
              Compose
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockEmails.length}</div>
                <p className="text-xs text-muted-foreground mt-1">All conversations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {mockEmails.filter(e => e.status === "unread").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Starred</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {mockEmails.filter(e => e.starred).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Important</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.5h</div>
                <p className="text-xs text-muted-foreground mt-1">Average</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>Email Messages</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                <TabsList>
                  <TabsTrigger value="inbox">
                    <Inbox className="mr-2 h-4 w-4" />
                    Inbox
                  </TabsTrigger>
                  <TabsTrigger value="sent">
                    <Send className="mr-2 h-4 w-4" />
                    Sent
                  </TabsTrigger>
                  <TabsTrigger value="archived">
                    <Archive className="mr-2 h-4 w-4" />
                    Archived
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmails.map((email) => (
                    <TableRow key={email.id} className={email.status === "unread" ? "bg-accent/50" : ""}>
                      <TableCell>
                        <button className="text-muted-foreground hover:text-yellow-500">
                          <Star className={`h-4 w-4 ${email.starred ? "fill-yellow-500 text-yellow-500" : ""}`} />
                        </button>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className={`font-medium ${email.status === "unread" ? "font-bold" : ""}`}>
                            {email.from}
                          </div>
                          <div className="text-xs text-muted-foreground">{email.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className={email.status === "unread" ? "font-bold" : ""}>
                        {email.subject}
                      </TableCell>
                      <TableCell className="text-muted-foreground truncate max-w-xs">
                        {email.preview}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{email.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Archive className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}