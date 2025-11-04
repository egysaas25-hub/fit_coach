"use client"

import { useState } from "react"
import { useConversations, useMessages, useSendMessage } from "@/hooks/api/use-messages"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Search, Send, Paperclip, Flag, MoreVertical, MessageSquare, Mail, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

const channelIcons = {
  whatsapp: Phone,
  email: Mail,
  telegram: MessageSquare,
  signal: MessageSquare,
  instagram: MessageSquare,
  facebook: MessageSquare,
}

const channelColors = {
  whatsapp: "text-green-500",
  email: "text-blue-500",
  telegram: "text-sky-500",
  signal: "text-indigo-500",
  instagram: "text-pink-500",
  facebook: "text-blue-600",
}

export default function MessagesPage() {
  const [selectedChannel, setSelectedChannel] = useState<string>("all")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const { data: conversationsData, isLoading: conversationsLoading } = useConversations({
    channel: selectedChannel === "all" ? undefined : selectedChannel,
  })

  const { data: messagesData, isLoading: messagesLoading } = useMessages(selectedConversation || "")
  const sendMessage = useSendMessage()

  const conversations = conversationsData?.data || []
  const messages = messagesData?.data || []

  const filteredConversations = conversations.filter(
    (conv: any) =>
      conv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.clientCode.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return

    await sendMessage.mutateAsync({
      conversationId: selectedConversation,
      data: { content: messageText },
    })

    setMessageText("")
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Conversations List */}
      <Card className="w-80 flex flex-col">
        <div className="p-4 border-b border-border space-y-4">
          <h2 className="font-semibold text-lg">Messages</h2>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Channel Tabs */}
          <Tabs value={selectedChannel} onValueChange={setSelectedChannel}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          {conversationsLoading ? (
            <ConversationsSkeleton />
          ) : (
            <div className="p-2 space-y-1">
              {filteredConversations.map((conv: any) => {
                const ChannelIcon = channelIcons[conv.channel as keyof typeof channelIcons]
                const isSelected = selectedConversation === conv.id

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-colors",
                      isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-accent",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{conv.clientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">
                              {conv.clientCode} - {conv.clientName}
                            </span>
                            <ChannelIcon
                              className={cn("w-3 h-3", channelColors[conv.channel as keyof typeof channelColors])}
                            />
                          </div>
                          {conv.unreadCount > 0 && (
                            <Badge variant="default" className="bg-primary text-primary-foreground">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(conv.lastMessageTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Messages Area */}
      {selectedConversation ? (
        <Card className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {conversations.find((c: any) => c.id === selectedConversation)?.clientName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {conversations.find((c: any) => c.id === selectedConversation)?.clientName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {conversations.find((c: any) => c.id === selectedConversation)?.clientCode}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Flag className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messagesLoading ? (
              <MessagesSkeleton />
            ) : (
              <div className="space-y-4">
                {messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={cn("flex gap-3", msg.sender === "trainer" ? "justify-end" : "justify-start")}
                  >
                    {msg.sender === "client" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>C</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg p-3",
                        msg.sender === "trainer" ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          msg.sender === "trainer" ? "text-primary-foreground/70" : "text-muted-foreground",
                        )}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {msg.sender === "trainer" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>T</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Textarea
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="min-h-[60px] resize-none"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || sendMessage.isPending}
                className="self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a conversation to start messaging</p>
          </div>
        </Card>
      )}
    </div>
  )
}

function ConversationsSkeleton() {
  return (
    <div className="p-2 space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-3 space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function MessagesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className={cn("flex gap-3", i % 2 === 0 ? "justify-end" : "justify-start")}>
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-20 w-64 rounded-lg" />
        </div>
      ))}
    </div>
  )
}
