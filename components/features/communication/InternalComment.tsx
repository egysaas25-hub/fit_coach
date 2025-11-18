"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils/cn"
import { format } from "date-fns"
import { MessageSquare, X } from "lucide-react"

interface InternalCommentProps {
  id?: string
  content?: string
  author?: string
  authorRole?: string
  timestamp?: Date
  mentions?: string[]
  isEditing?: boolean
  onSave?: (content: string) => void
  onCancel?: () => void
}

export function InternalComment({
  id,
  content,
  author,
  authorRole,
  timestamp,
  mentions = [],
  isEditing = false,
  onSave,
  onCancel,
}: InternalCommentProps) {
  const [editContent, setEditContent] = useState(content || "")

  const handleSave = () => {
    if (editContent.trim() && onSave) {
      onSave(editContent)
    }
  }

  // Editing mode
  if (isEditing) {
    return (
      <Card className="p-4 bg-muted/50 border-dashed border-2 border-primary/20">
        <div className="flex items-start gap-2 mb-2">
          <MessageSquare className="h-4 w-4 text-primary mt-1" />
          <div className="flex-1">
            <Badge variant="outline" className="text-xs">
              Internal Comment (Staff Only)
            </Badge>
          </div>
        </div>
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="Add internal comment (visible to staff only)..."
          className="min-h-[80px] mb-2 bg-background"
          autoFocus
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Use @name to mention team members
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!editContent.trim()}
            >
              Save Comment
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Display mode
  if (!content) return null

  return (
    <Card className="p-4 bg-muted/30 border-l-4 border-l-primary">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={`/api/placeholder/avatar/${author}`} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {author?.slice(0, 2).toUpperCase() || "ST"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">
              Internal
            </Badge>
            <span className="text-sm font-medium">{author}</span>
            {authorRole && (
              <span className="text-xs text-muted-foreground">({authorRole})</span>
            )}
            {timestamp && (
              <span className="text-xs text-muted-foreground">
                {format(timestamp, "MMM d, HH:mm")}
              </span>
            )}
          </div>

          <p className="text-sm text-foreground whitespace-pre-wrap break-words">
            {content}
          </p>

          {mentions.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {mentions.map((mention, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {mention}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
