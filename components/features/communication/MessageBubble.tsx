"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils/cn"
import { format } from "date-fns"
import { MoreVertical, Reply, MessageSquare, Flag } from "lucide-react"

interface MessageBubbleProps {
  id: string
  content: string
  sender: "client" | "trainer"
  senderName?: string
  trainerTag?: string // e.g., "@Ahmed (JT)"
  timestamp: Date
  isRead?: boolean
  hasInternalComments?: boolean
  isFlagged?: boolean
  flagSeverity?: "info" | "coach" | "warning" | "critical"
  onReply?: () => void
  onComment?: () => void
  onFlag?: () => void
}

const flagColors = {
  info: "text-blue-500 bg-blue-500/10",
  coach: "text-green-500 bg-green-500/10",
  warning: "text-yellow-500 bg-yellow-500/10",
  critical: "text-red-500 bg-red-500/10",
}

export function MessageBubble({
  id,
  content,
  sender,
  senderName,
  trainerTag,
  timestamp,
  isRead = true,
  hasInternalComments = false,
  isFlagged = false,
  flagSeverity,
  onReply,
  onComment,
  onFlag,
}: MessageBubbleProps) {
  const isClient = sender === "client"

  return (
    <div
      className={cn(
        "flex gap-3 group",
        !isClient && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={`/api/placeholder/avatar/${senderName}`} />
        <AvatarFallback className={cn(
          "text-xs",
          isClient ? "bg-muted" : "bg-primary/10 text-primary"
        )}>
          {senderName?.slice(0, 2).toUpperCase() || (isClient ? "CL" : "TR")}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn("flex flex-col gap-1 max-w-[70%]", !isClient && "items-end")}>
        {/* Sender Info */}
        <div className={cn("flex items-center gap-2 text-xs", !isClient && "flex-row-reverse")}>
          <span className="font-medium">{senderName || (isClient ? "Client" : "Trainer")}</span>
          {trainerTag && (
            <Badge variant="outline" className="text-xs font-mono">
              {trainerTag}
            </Badge>
          )}
          <span className="text-muted-foreground">
            {format(timestamp, "HH:mm")}
          </span>
          {!isRead && <span className="w-2 h-2 rounded-full bg-primary" />}
        </div>

        {/* Message Bubble */}
        <div
          className={cn(
            "rounded-lg px-4 py-2 relative",
            isClient
              ? "bg-muted text-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          {isFlagged && flagSeverity && (
            <div className={cn(
              "absolute -top-2 -right-2 rounded-full p-1",
              flagColors[flagSeverity]
            )}>
              <Flag className="h-3 w-3" />
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        </div>

        {/* Indicators */}
        <div className="flex items-center gap-2">
          {hasInternalComments && (
            <Badge variant="secondary" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              Internal comments
            </Badge>
          )}
        </div>

        {/* Actions (visible on hover) */}
        <div className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1",
          !isClient && "flex-row-reverse"
        )}>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={onReply}
          >
            <Reply className="h-3 w-3 mr-1" />
            Reply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={onComment}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Comment
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isClient ? "start" : "end"}>
              <DropdownMenuItem onClick={onFlag}>
                <Flag className="h-3 w-3 mr-2" />
                Flag Message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
