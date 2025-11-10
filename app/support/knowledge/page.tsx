"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const RESOURCES = [
  { id: 'kb-1', title: 'Getting Started', body: 'Learn the basics of using the platform.' },
  { id: 'kb-2', title: 'Managing Clients', body: 'How to add, edit, and organize clients.' },
  { id: 'kb-3', title: 'Reports & Analytics', body: 'Understanding dashboards and reports.' },
  { id: 'kb-4', title: 'Billing & Subscriptions', body: 'Handle payments and plans.' },
];

export default function KnowledgeBasePage() {
  const [q, setQ] = useState('');
  const results = RESOURCES.filter(r => r.title.toLowerCase().includes(q.toLowerCase()) || r.body.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Knowledge Base</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search articles" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="space-y-2">
            {results.map(r => (
              <div key={r.id} className="border border-border rounded-md p-3">
                <div className="font-medium">{r.title}</div>
                <div className="text-sm text-muted-foreground">{r.body}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
