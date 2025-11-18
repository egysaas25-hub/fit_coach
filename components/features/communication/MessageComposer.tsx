"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Paperclip, Send, Smile } from "lucide-react"
import { cn } from "@/lib/utils/cn"

interface MessageComposerProps {
  onSend: (message: string, template?: string) => void
  placeholder?: string
  disabled?: boolean
  showTemplates?: boolean
  className?: string
}

const templates = [
  { id: "greeting", name: "Greeting", content: "Hi {{client_name}}, how can I help you today?" },
  { id: "checkin", name: "Check-in Reminder", content: "Hi {{client_name}}, it's time for your weekly check-in!" },
  { id: "plan_ready", name: "Plan Ready", content: "Your personalized plan is ready! Check it out in your portal." },
]

export function MessageComposer({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  showTemplates = true,
  className,
}: MessageComposerProps) {
  const [message, setMessage] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  const handleSend = () => {
    if (!message.trim()) return
    onSend(message, selectedTemplate || undefined)
    setMessage("")
    setSelectedTemplate("")
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setMessage(template.content)
      setSelectedTemplate(templateId)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn("border-t bg-background p-4 space-y-3", className)}>
      {/* Template Selector */}
      {showTemplates && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Template:</span>
          <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
            <SelectTrigger className="w-[200px] h-8">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[80px] resize-none"
            aria-label="Message content"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4 mr-1" />
              Attach
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              disabled={disabled}
            >
              <Smile className="h-4 w-4 mr-1" />
              Emoji
            </Button>
            <span className="text-xs text-muted-foreground ml-auto">
              Ctrl+Enter to send
            </span>
          </div>
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="lg"
          className="h-[80px]"
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  )
}
