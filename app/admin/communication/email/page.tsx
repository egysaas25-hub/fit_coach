"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Send, Inbox, Archive, Star, Paperclip, Reply, Forward } from "lucide-react"

const emailThreads = [
  {
    id: 1,
    from: "sarah.johnson@email.com",
    clientName: "Sarah Johnson",
    subject: "Question about nutrition plan",
    preview: "Hi, I have a question about the meal timing in my nutrition plan...",
    timestamp: "10:30 AM",
    unread: true,
    starred: false,
    hasAttachment: false,
  },
  {
    id: 2,
    from: "mike.chen@email.com", 
    clientName: "Mike Chen",
    subject: "Progress update - Week 4",
    preview: "Wanted to share my progress after 4 weeks of following the program...",
    timestamp: "Yesterday",
    unread: false,
    starred: true,
    hasAttachment: true,
  },
  {
    id: 3,
    from: "emily.davis@email.com",
    clientName: "Emily Davis",
    subject: "Re: Workout modifications",
    preview: "Thank you for the modifications! The new exercises are much better...",
    timestamp: "2 days ago",
    unread: false,
    starred: false,
    hasAttachment: false,
  },
  {
    id: 4,
    from: "alex.rodriguez@email.com",
    clientName: "Alex Rodriguez",
    subject: "Scheduling next session",
    preview: "Could we schedule our next session for next week? I'm available...",
    timestamp: "3 days ago",
    unread: true,
    starred: false,
    hasAttachment: false,
  },
]

const selectedEmail = {
  id: 1,
  from: "sarah.johnson@email.com",
  to: "trainer@fitcoach.com",
  subject: "Question about nutrition plan",
  timestamp: "Today at 10:30 AM",
  body: `Hi there!

I hope you're doing well. I have a question about the meal timing in my nutrition plan.

I've been following the plan for the past week, but I'm finding it difficult to eat the pre-workout meal 2 hours before my evening workouts. I usually work out around 6 PM, which means I need to eat at 4 PM, but I'm still at work and it's not always convenient.

Would it be okay to adjust the timing or perhaps have a smaller snack instead? I don't want to compromise my performance or results.

Also, I wanted to mention that I'm really enjoying the variety in the meal plan. The recipes are delicious and easy to prepare!

Looking forward to your guidance.

Best regards,
Sarah Johnson`,
  attachments: [],
}

export default function EmailPage() {
  const [selectedThread, setSelectedThread] = useState(emailThreads[0])
  const [replyText, setReplyText] = useState("")
  const [showReply, setShowReply] = useState(false)

  const handleSendReply = () => {
    if (replyText.trim()) {
      // Handle sending reply
      setReplyText("")
      setShowReply(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Email List */}
      <div className="w-96 border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Conversations
          </h2>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Inbox className="h-3 w-3" />
              <span>Inbox ({emailThreads.filter(e => e.unread).length})</span>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto">
          {emailThreads.map((email) => (
            <div
              key={email.id}
              className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                selectedThread.id === email.id ? "bg-accent" : ""
              } ${email.unread ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
              onClick={() => setSelectedThread(email)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium text-foreground truncate ${email.unread ? "font-semibold" : ""}`}>
                      {email.clientName}
                    </h3>
                    {email.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                    {email.hasAttachment && <Paperclip className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <p className={`text-sm truncate mb-1 ${email.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    {email.subject}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {email.preview}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 ml-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{email.timestamp}</span>
                  {email.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col">
        {/* Email Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">{selectedEmail.subject}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Archive className="h-4 w-4 mr-1" />
                Archive
              </Button>
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-1" />
                Star
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">{selectedEmail.from}</span>
              <span className="mx-2">to</span>
              <span>{selectedEmail.to}</span>
            </div>
            <span>{selectedEmail.timestamp}</span>
          </div>
        </div>

        {/* Email Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {selectedEmail.body}
            </div>
            
            {selectedEmail.attachments.length > 0 && (
              <div className="mt-6 p-4 border rounded-lg bg-muted">
                <h4 className="font-medium text-foreground mb-2">Attachments</h4>
                {/* Attachment list would go here */}
              </div>
            )}
          </div>
        </div>

        {/* Reply Section */}
        <div className="border-t bg-card">
          {!showReply ? (
            <div className="p-4 flex gap-2">
              <Button onClick={() => setShowReply(true)} className="flex items-center gap-2">
                <Reply className="h-4 w-4" />
                Reply
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Forward className="h-4 w-4" />
                Forward
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Reply to {selectedEmail.from}</h4>
                <Button variant="ghost" size="sm" onClick={() => setShowReply(false)}>
                  Cancel
                </Button>
              </div>
              
              <Textarea
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-32 resize-none"
              />
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-1" />
                    Attach
                  </Button>
                </div>
                <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                  <Send className="h-4 w-4 mr-1" />
                  Send Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Client Info Panel */}
      <div className="w-80 border-l bg-card p-4">
        <h3 className="font-semibold text-foreground mb-4">Client Information</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-foreground">{selectedEmail.from}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Client Name</p>
            <p className="font-medium text-foreground">Sarah Johnson</p>
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
            <p className="text-sm text-muted-foreground">Email Frequency</p>
            <p className="font-medium text-foreground">2-3 times/week</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Button variant="outline" className="w-full">
            View Full Profile
          </Button>
          <Button variant="outline" className="w-full">
            View Email History
          </Button>
          <Button variant="outline" className="w-full">
            Schedule Call
          </Button>
        </div>
      </div>
    </div>
  )
}