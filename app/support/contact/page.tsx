"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTicket } from '@/lib/hooks/api/useSupport';
import { TicketCategory, TicketPriority } from '@/types/domain/support';

export default function ContactSupportPage() {
  const createTicket = useCreateTicket();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Contact Support</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <Textarea placeholder="Your message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button onClick={() => createTicket.mutate({ subject, category: TicketCategory.General, priority: TicketPriority.Medium })} disabled={createTicket.isPending}>Send message</Button>
        </CardContent>
      </Card>
    </div>
  );
}
