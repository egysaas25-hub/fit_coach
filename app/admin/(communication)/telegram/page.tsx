"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, Phone, Video, MoreVertical } from "lucide-react"

const mockConversations = [
  {
    id: 1,
    name: "Anna Carter",
    avatar: "AC",
    lastMessage: "Thanks for the workout tips!",
    time: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "John Smith",
    avatar: "JS",
    lastMessage: "Can we reschedule tomorrow?",
    time: "9:45 AM",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Sarah Lee",
    avatar: "SL",
    lastMessage: "Perfect, see you then!",
    time: "Yesterday",
    unread: 0,
    online: true,
  },
]

const mockMessages = [
  {
    id: 1,
    sender: "Anna Carter",
    content: "Hi! I have a question about the new workout plan.",
    time: "10:25 AM",
    isClient: true,
  },
  {
    id: 2,
    sender: "You",
    content: "Of course! What would you like to know?",
    time: "10:26 AM",
    isClient: false,
  },
  {
    id: 3,
    sender: "Anna Carter",
    content: "Should I do the cardio before or after strength training?",
    time: "10:28 AM",
    isClient: true,
  },
  {
    id: 4,
    sender: "You",
    content: "Great question! For your goals, I'd recommend doing strength training first, then finishing with 15-20 minutes of cardio.",
    time: "10:29 AM",
    isClient: false,
  },
  {
    id: 5,
    sender: "Anna Carter",
    content: "Thanks for the workout tips!",
    time: "10:30 AM",
    isClient: true,
  },
]

export default function CommunicationTelegramPage() {
  const [selectedConv, setSelectedConv] = useState(mockConversations[0])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConvs = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-background">
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Telegram Communication</h1>
              <p className="text-sm text-muted-foreground">Chat with clients via Telegram</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Connected
              </Badge>
            </div>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          <div className="w-80 border-r bg-card flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-accent transition-colors border-b ${
                    selectedConv?.id === conv.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>{conv.avatar}</AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{conv.name}</span>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                      {conv.unread > 0 && (
                        <Badge className="ml-2">{conv.unread}</Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="border-b bg-card px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>{selectedConv.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedConv.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedConv.online ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {mockMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isClient ? "" : "justify-end"}`}>
                  <div className={`max-w-md ${msg.isClient ? "" : "text-right"}`}>
                    <div
                      className={`inline-block rounded-lg px-4 py-2 ${
                        msg.isClient ? "bg-accent" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t bg-card p-4">
              <div className="flex gap-2">
                <Input placeholder="Type a message..." className="flex-1" />
                <Button>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}