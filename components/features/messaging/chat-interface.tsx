"use client"

import { useState } from "react"
import { Search, Send, Paperclip, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const conversations = [
  {
    id: 1,
    name: "Sarah Miller",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Thanks for the workout plan!",
    time: "2m ago",
    unread: 2,
  },
  {
    id: 2,
    name: "John Doe",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Can we reschedule tomorrow's session?",
    time: "1h ago",
    unread: 0,
  },
  {
    id: 3,
    name: "Jane Smith",
    avatar: "/placeholder-user.jpg",
    lastMessage: "The nutrition plan is working great!",
    time: "3h ago",
    unread: 1,
  },
]

const messages = [
  {
    id: 1,
    sender: "Sarah Miller",
    content: "Hi! I just finished today's workout. It was challenging but great!",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    content: "That's awesome! How are you feeling? Any muscle soreness?",
    time: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Sarah Miller",
    content: "A bit sore in my legs, but nothing too bad. Ready for tomorrow!",
    time: "10:35 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "You",
    content: "Perfect! That's normal. Make sure to stretch and stay hydrated. I'll send over tomorrow's plan shortly.",
    time: "10:37 AM",
    isOwn: true,
  },
  {
    id: 5,
    sender: "Sarah Miller",
    content: "Thanks for the workout plan!",
    time: "10:40 AM",
    isOwn: false,
  },
]

export function MessagingSystem() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageInput, setMessageInput] = useState("")

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle sending message
      setMessageInput("")
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations List */}
      <div className="w-80 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search conversations" className="pl-9" />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-9rem)]">
          <div className="p-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors",
                  selectedConversation.id === conversation.id && "bg-accent",
                )}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                  <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm truncate">{conversation.name}</span>
                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    {conversation.unread > 0 && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} alt={selectedConversation.name} />
              <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{selectedConversation.name}</h2>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.isOwn && "justify-end")}>
                <div className={cn("max-w-[70%] space-y-1", message.isOwn && "items-end")}>
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2",
                      message.isOwn ? "bg-primary text-primary-foreground" : "bg-accent",
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground px-1">{message.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Textarea
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            <Button onClick={handleSendMessage} size="icon" className="shrink-0">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
