import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Clock } from "lucide-react";

export default function AdminConversationsPage() {
  const conversations = [
    {
      client: "Anna Carter",
      trainer: "Mike Johnson",
      lastMessage: "Thanks for the plan!",
      time: "2m ago",
      unread: 2,
      status: "Active",
    },
    {
      client: "John Smith",
      trainer: "Sarah Lee",
      lastMessage: "Can we reschedule?",
      time: "1h ago",
      unread: 0,
      status: "Active",
    },
    {
      client: "Emily Davis",
      trainer: "Mike Johnson",
      lastMessage: "How's my progress?",
      time: "3h ago",
      unread: 1,
      status: "Active",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Conversations</h1>
            <p className="text-muted-foreground">Monitor all client-trainer conversations</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {conversations.filter((c) => c.status === "Active").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">
                {conversations.reduce((sum, c) => sum + c.unread, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversations.map((conv) => (
                <div
                  key={`${conv.client}-${conv.trainer}`}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    conv.unread > 0 ? "bg-accent/50" : ""
                  }`}
                >
                  <Avatar>
                    <AvatarFallback>{conv.client.charAt(0)}</AvatarFallback>
                    <AvatarImage src="" alt={conv.client} />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold">
                        {conv.client} → {conv.trainer}
                      </h3>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge variant="default">{conv.unread}</Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}