'use client'

import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ClientNotesTabProps {
  clientId: string
  notes: string | null
  isEditing: boolean
}

export function ClientNotesTab({
  clientId,
  notes,
  isEditing,
}: ClientNotesTabProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <Label>Internal Notes</Label>
          <p className="text-sm text-muted-foreground mb-2">
            These notes are only visible to staff members
          </p>
        </div>
        <Textarea
          value={notes || ''}
          placeholder="Add notes about this client..."
          disabled={!isEditing}
          rows={10}
          className="resize-none"
        />
      </div>
    </Card>
  )
}
