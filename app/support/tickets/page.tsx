"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useTickets, useCreateTicket, useTicketStats } from '@/lib/hooks/api/useSupport';
import { TicketCategory, TicketPriority } from '@/types/domain/support';

export default function TicketsPage() {
  const { data: tickets = [] } = useTickets();
  const { data: stats } = useTicketStats();
  const createTicket = useCreateTicket();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>(TicketCategory.General);
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.Medium);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Ticket Stats</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-border rounded-md p-3">Open: {stats?.open ?? 0}</div>
          <div className="border border-border rounded-md p-3">In Progress: {stats?.inProgress ?? 0}</div>
          <div className="border border-border rounded-md p-3">Resolved: {stats?.resolved ?? 0}</div>
          <div className="border border-border rounded-md p-3">Avg Response: {stats?.avgResponseTime ?? '—'}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Create Ticket</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Category</label>
              <Select value={category} onValueChange={(v) => setCategory(v as TicketCategory)}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={TicketCategory.Technical}>Technical</SelectItem>
                  <SelectItem value={TicketCategory.Billing}>Billing</SelectItem>
                  <SelectItem value={TicketCategory.FeatureRequest}>Feature Request</SelectItem>
                  <SelectItem value={TicketCategory.General}>General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm">Priority</label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={TicketPriority.Low}>Low</SelectItem>
                  <SelectItem value={TicketPriority.Medium}>Medium</SelectItem>
                  <SelectItem value={TicketPriority.High}>High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => createTicket.mutate({ subject, category, priority })} disabled={createTicket.isPending}>Submit Ticket</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Tickets</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {tickets.map((t: any) => (
            <div key={t.id} className="border border-border rounded-md p-3">
              <div className="font-medium">{t.subject}</div>
              <div className="text-xs text-muted-foreground">{t.category} · {t.priority} · {t.status}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
