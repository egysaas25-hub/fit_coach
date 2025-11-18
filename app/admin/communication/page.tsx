"use client"

import { useState } from "react"

import { ThreadCard } from "@/components/features/communication/ThreadCard"
import { MessageBubble } from "@/components/features/communication/MessageBubble"
import { MessageComposer } from "@/components/features/communication/MessageComposer"
import { InternalComment } from "@/components/features/communication/InternalComment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, MessageSquare, Mail, Send } from "lucide-react"

// Mock data
const mockThreads = [
  {
    id: "1",
    clientCode: "C102",
    clientName: "Sara Ahmed",
    unreadCount: 3,
    lastMessage: "Thanks for the meal plan! Quick question about breakfast...",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    channel: "whatsapp" as const,
  },
  {
    id: "2",
    clientCode: "C097",
    clientName: "Omar Hassan",
    unreadCount: 0,
    lastMessage: "Perfect! I'll start tomorrow morning.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    channel: "email" as const,
  },
  {
    id: "3",
    clientCode: "C056",
    clientName: "Mina Adel",
    unreadCount: 1,
    lastMessage: "Can we adjust my workout schedule?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    channel: "telegram" as const,
  },
]

const mockMessages = [
  {
    id: "1",
    content: "Hi Coach! I just finished my workout for today.",
    sender: "client" as const,
    senderName: "Sara Ahmed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    isRead: true,
  },
  {
    id: "2",
    content: "That's great Sara! How did you feel during the session?",
    sender: "trainer" as const,
    senderName: "Ahmed Reda",
    trainerTag: "@Ahmed (JT)",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
    isRead: true,
  },
  {
    id: "3",
    content: "It was challenging but I managed to complete all sets!",
    sender: "client" as const,
    senderName: "Sara Ahmed",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    isRead: true,
    hasInternalComments: true,
  },
]

export default function CommunicationCenterPage() {
  const [selectedThread, setSelectedThread] = useState(mockThreads[0])
  const [activeChannel, setActiveChannel] = useState("all")
  const [showInternalComment, setShowInternalComment] = useState(false)

  const user = {
    name: "Ahmed Reda",
    email: "ahmed@trainersaas.com",
    role: "admin",
  }

  const handleSendMessage = (message: string, template?: string) => {
    console.log("Sending message:", message, template)
    // TODO: Implement actual message sending
  }

  const handleSaveComment = (content: string) => {
    console.log("Saving internal comment:", content)
    setShowInternalComment(false)
    // TODO: Implement actual comment saving
  }

  return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Communication Center</h1>
          <p className="text-muted-foreground">
            Unified inbox across all messaging channels
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          {/* Thread List */}
          <Card className="col-span-3 flex flex-col">
            <CardHeader className="pb-3">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10"
                  />
                </div>
                <Tabs value={activeChannel} onValueChange={setActiveChannel}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all" className="text-xs">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="whatsapp" className="text-xs">
                      <MessageSquare className="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger value="email" className="text-xs">
                      <Mail className="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger value="telegram" className="text-xs">
                      <Send className="h-3 w-3" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1">
              {mockThreads.map((thread) => (
                <ThreadCard
                  key={thread.id}
                  {...thread}
                  isActive={selectedThread.id === thread.id}
                  onClick={() => setSelectedThread(thread)}
                />
              ))}
            </ScrollArea>
          </Card>

          {/* Message Thread */}
          <Card className="col-span-6 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {selectedThread.clientCode} – {selectedThread.clientName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedThread.channel}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {mockMessages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <MessageBubble
                      {...message}
                      onReply={() => console.log("Reply")}
                      onComment={() => setShowInternalComment(true)}
                      onFlag={() => console.log("Flag")}
                    />
                    {message.hasInternalComments && (
                      <InternalComment
                        content="Great progress! @Mina please follow up with nutrition check."
                        author="Ahmed Reda"
                        authorRole="Superior"
                        timestamp={new Date(Date.now() - 1000 * 60 * 25)}
                        mentions={["@Mina"]}
                      />
                    )}
                  </div>
                ))}

                {showInternalComment && (
                  <InternalComment
                    isEditing
                    onSave={handleSaveComment}
                    onCancel={() => setShowInternalComment(false)}
                  />
                )}
              </div>
            </ScrollArea>

            <MessageComposer onSend={handleSendMessage} />
          </Card>

          {/* Client Panel */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Client Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
              <div>
                <p className="text-sm font-medium">Current Plan</p>
                <p className="text-sm text-muted-foreground">3-Month Fat Loss</p>
              </div>
              <div>
                <p className="text-sm font-medium">Check-in Round</p>
                <p className="text-sm text-muted-foreground">Round 2/6</p>
              </div>
              <div>
                <p className="text-sm font-medium">Trainer</p>
                <p className="text-sm text-muted-foreground">Ahmed Reda (JT)</p>
              </div>
              <Button className="w-full" variant="outline">
                View Full Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
