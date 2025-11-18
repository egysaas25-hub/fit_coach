"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils/cn"
import { MessageSquare, Mail, Send } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ThreadCardProps {
  clientCode: string
  clientName: string
  unreadCount: number
  lastMessage: string
  lastMessageTime: Date
  channel: "whatsapp" | "email" | "telegram" | "signal" | "instagram" | "facebook"
  isActive?: boolean
  onClick?: () => void
}

const channelIcons = {
  whatsapp: { icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10" },
  email: { icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" },
  telegram: { icon: Send, color: "text-sky-500", bg: "bg-sky-500/10" },
  signal: { icon: MessageSquare, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  instagram: { icon: MessageSquare, color: "text-pink-500", bg: "bg-pink-500/10" },
  facebook: { icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-600/10" },
}

export function ThreadCard({
  clientCode,
  clientName,
  unreadCount,
  lastMessage,
  lastMessageTime,
  channel,
  isActive = false,
  onClick,
}: ThreadCardProps) {
  const channelConfig = channelIcons[channel]
  const ChannelIcon = channelConfig.icon

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true })
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-4 border-b cursor-pointer transition-colors hover:bg-accent/50",
        isActive && "bg-accent border-l-4 border-l-primary",
        unreadCount > 0 && "bg-accent/30"
      )}
    >
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={`/api/placeholder/avatar/${clientCode}`} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials(clientName)}
          </AvatarFallback>
        </Avatar>
        {/* Channel Badge */}
        <div
          className={cn(
            "absolute -bottom-1 -right-1 rounded-full p-1",
            channelConfig.bg
          )}
        >
          <ChannelIcon className={cn("h-3 w-3", channelConfig.color)} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              {clientCode}
            </span>
            <span className="text-sm font-semibold truncate">
              {clientName}
            </span>
          </div>
          {unreadCount > 0 && (
            <Badge
              variant="default"
              className="h-5 min-w-[20px] px-1.5 text-xs shrink-0"
            >
              {unreadCount}
            </Badge>
          )}
        </div>

        <p
          className={cn(
            "text-sm text-muted-foreground truncate",
            unreadCount > 0 && "font-medium text-foreground"
          )}
        >
          {lastMessage}
        </p>

        <span className="text-xs text-muted-foreground mt-1 block">
          {formatTime(lastMessageTime)}
        </span>
      </div>
    </div>
  )
}
