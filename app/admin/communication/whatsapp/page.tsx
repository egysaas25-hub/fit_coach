"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Users, Clock, CheckCircle, AlertCircle } from "lucide-react"

const whatsappThreads = [
  {
    id: 1,
    clientCode: "C001",
    clientName: "Sarah Johnson",
    lastMessage: "Thanks for the workout plan! When should I start?",
    timestamp: "2 min ago",
    unreadCount: 2,
    status: "active",
  },
  {
    id: 2,
    clientCode: "C002", 
    clientName: "Mike Chen",
    lastMessage: "Can we reschedule tomorrow's session?",
    timestamp: "15 min ago",
    unreadCount: 1,
    status: "active",
  },
  {
    id: 3,
    clientCode: "C003",
    clientName: "Emily Davis",
    lastMessage: "Completed today's workout! 💪",
    timestamp: "1 hour ago",
    unreadCount: 0,
    status: "delivered",
  },
  {
    id: 4,
    clientCode: "C004",
    clientName: "Alex Rodriguez", 
    lastMessage: "Having trouble with the meal plan...",
    timestamp: "3 hours ago",
    unreadCount: 3,
    status: "active",
  },
]

const messages = [
  {
    id: 1,
    sender: "client",
    message: "Hi! I just received my workout plan. It looks great!",
    timestamp: "10:30 AM",
    status: "delivered",
  },
  {
    id: 2,
    sender: "trainer",
    message: "Great to hear! Remember to start with lighter weights and focus on form first.",
    timestamp: "10:32 AM", 
    status: "read",
  },
  {
    id: 3,
    sender: "client",
    message: "Thanks for the workout plan! When should I start?",
    timestamp: "10:45 AM",
    status: "delivered",
  },
]

export default function WhatsAppPage() {
  const [selectedThread, setSelectedThread] = useState(whatsappThreads[0])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("")
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Threads List */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            WhatsApp Conversations
          </h2>
          <div className="flex gap-4 mt-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Online</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span className="text-muted-foreground">{whatsappThreads.length} conversations</span>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto">
          {whatsappThreads.map((thread) => (
            <div
              key={thread.id}
              className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                selectedThread.id === thread.id ? "bg-accent" : ""
              }`}
              onClick={() => setSelectedThread(thread)}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-foreground">
                  {thread.clientCode}–{thread.clientName}
                </h3>
                {thread.unreadCount > 0 && (
                  <Badge variant="default" className="text-xs">
                    {thread.unreadCount}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate mb-1">
                {thread.lastMessage}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{thread.timestamp}</span>
                <div className="flex items-center gap-1">
                  {thread.status === "delivered" && <CheckCircle className="h-3 w-3 text-green-500" />}
                  {thread.status === "active" && <Clock className="h-3 w-3 text-yellow-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">
                {selectedThread.clientCode}–{selectedThread.clientName}
              </h3>
              <p className="text-sm text-muted-foreground">Last seen 2 minutes ago</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View Profile
              </Button>
              <Button variant="outline" size="sm">
                Call
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "trainer" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "trainer"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-70">{message.timestamp}</span>
                  {message.sender === "trainer" && (
                    <CheckCircle className="h-3 w-3 opacity-70" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 min-h-[40px] max-h-32 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Client Info Panel */}
      <div className="w-80 border-l bg-card p-4">
        <h3 className="font-semibold text-foreground mb-4">Client Information</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Client Code</p>
            <p className="font-medium text-foreground">{selectedThread.clientCode}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium text-foreground">{selectedThread.clientName}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant="outline">Active Client</Badge>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Goal</p>
            <p className="font-medium text-foreground">Weight Loss</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Trainer</p>
            <p className="font-medium text-foreground">Sarah Johnson</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Last Check-in</p>
            <p className="font-medium text-foreground">2 days ago</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Button variant="outline" className="w-full">
            View Full Profile
          </Button>
          <Button variant="outline" className="w-full">
            Assign Plan
          </Button>
          <Button variant="outline" className="w-full">
            Schedule Session
          </Button>
        </div>
      </div>
    </div>
  )
}