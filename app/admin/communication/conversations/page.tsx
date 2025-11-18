"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MessageSquare, Search, Filter, Archive, Star, MoreHorizontal } from "lucide-react"

const conversations = [
  {
    id: 1,
    clientCode: "C001",
    clientName: "Sarah Johnson",
    channels: ["whatsapp", "email"],
    lastMessage: "Thanks for the workout plan! When should I start?",
    timestamp: "2 min ago",
    unreadCount: 2,
    priority: "high",
    status: "active",
    trainer: "Mike Chen",
  },
  {
    id: 2,
    clientCode: "C002",
    clientName: "Alex Rodriguez",
    channels: ["whatsapp"],
    lastMessage: "Can we reschedule tomorrow's session?",
    timestamp: "15 min ago", 
    unreadCount: 1,
    priority: "medium",
    status: "active",
    trainer: "Sarah Johnson",
  },
  {
    id: 3,
    clientCode: "C003",
    clientName: "Emily Davis",
    channels: ["email", "instagram"],
    lastMessage: "Completed today's workout! 💪",
    timestamp: "1 hour ago",
    unreadCount: 0,
    priority: "low",
    status: "resolved",
    trainer: "Mike Chen",
  },
  {
    id: 4,
    clientCode: "C004",
    clientName: "John Smith",
    channels: ["whatsapp", "email", "telegram"],
    lastMessage: "Having trouble with the meal plan...",
    timestamp: "3 hours ago",
    unreadCount: 3,
    priority: "high",
    status: "active",
    trainer: "Emily Wilson",
  },
  {
    id: 5,
    clientCode: "C005",
    clientName: "Lisa Brown",
    channels: ["email"],
    lastMessage: "Thank you for the progress report!",
    timestamp: "1 day ago",
    unreadCount: 0,
    priority: "low",
    status: "resolved",
    trainer: "Sarah Johnson",
  },
]

const channelIcons = {
  whatsapp: "💬",
  email: "📧",
  instagram: "📷",
  telegram: "✈️",
  facebook: "👥",
}

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500", 
  low: "bg-green-500",
}

export default function ConversationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.clientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter
    const matchesPriority = priorityFilter === "all" || conv.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">All Conversations</h1>
          <p className="text-muted-foreground">Unified view of all client communications across channels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Archive Selected
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations.length}</div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <Badge variant="destructive" className="h-4 w-4 rounded-full p-0 text-xs">
              {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.filter(conv => conv.priority === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.filter(conv => conv.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Ongoing discussions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <div className="space-y-2">
        {filteredConversations.map((conversation) => (
          <Card key={conversation.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Priority Indicator */}
                  <div className={`w-1 h-12 rounded-full ${priorityColors[conversation.priority]}`}></div>
                  
                  {/* Client Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">
                        {conversation.clientCode}–{conversation.clientName}
                      </h3>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                      <Badge variant={conversation.status === "active" ? "default" : "secondary"} className="text-xs">
                        {conversation.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Trainer: {conversation.trainer}</span>
                      <span>{conversation.timestamp}</span>
                      <div className="flex items-center gap-1">
                        <span>Channels:</span>
                        {conversation.channels.map((channel) => (
                          <span key={channel} title={channel}>
                            {channelIcons[channel]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConversations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No conversations found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}