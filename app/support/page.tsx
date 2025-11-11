'use client';
export const dynamic = "force-dynamic";

import { Sidebar } from "@/components/ui/sidebar";
import { useTickets, useCreateTicket, useTicketStats } from "@/lib/hooks/api/useSupport";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { TicketPriority, TicketCategory } from "@/types/domain/support";

export default function SupportPage() {
  const { data: ticketsData, isLoading: ticketsLoading } = useTickets();
  const { data: stats } = useTicketStats();
  const { mutate: createTicket, isPending } = useCreateTicket();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const tickets = ticketsData || [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Support Center</h1>
          <p className="text-muted-foreground">Get help and submit support tickets</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <div>Open: {stats?.open ?? 0}</div>
                <div>In Progress: {stats?.inProgress ?? 0}</div>
                <div>Resolved: {stats?.resolved ?? 0}</div>
                <div>Avg Response: {stats?.avgResponseTime ?? "--"}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                <Label htmlFor="message">Message</Label>
                <Input id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button
                  disabled={isPending || !subject || !message}
                  onClick={() => createTicket({ subject, category: TicketCategory.General, priority: TicketPriority.Medium })}
                >
                  {isPending ? "Submitting..." : "Submit Ticket"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              {ticketsLoading ? (
                <div className="text-sm text-muted-foreground">Loading tickets...</div>
              ) : (
                <ul className="space-y-2">
                  {tickets.map((t: any) => (
                    <li key={t.id} className="p-3 border border-border rounded">
                      <div className="font-medium">{t.subject}</div>
                      <div className="text-sm text-muted-foreground">Status: {t.status}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
