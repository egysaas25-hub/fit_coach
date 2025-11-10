"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useInvoices, usePayments } from '@/lib/hooks/api/useSubscriptions';

export default function InvoicesPaymentsPage() {
  const [subscriptionId, setSubscriptionId] = useState('');
  const { invoices } = useInvoices(subscriptionId as any);
  const { payments } = usePayments(subscriptionId as any);
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Invoices & Payments</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm">Subscription</label>
              <Select value={subscriptionId} onValueChange={setSubscriptionId}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select subscription" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sub-1">Subscription 1</SelectItem>
                  <SelectItem value="sub-2">Subscription 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-medium mb-2">Invoices</div>
              <div className="space-y-2">
                {(invoices || []).map((i: any) => (
                  <div key={i.id} className="border border-border rounded-md p-3">
                    <div className="font-medium">${i.amount}</div>
                    <div className="text-xs text-muted-foreground">{i.status} · {new Date(i.issuedAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">Payments</div>
              <div className="space-y-2">
                {(payments || []).map((p: any) => (
                  <div key={p.id} className="border border-border rounded-md p-3">
                    <div className="font-medium">${p.amount}</div>
                    <div className="text-xs text-muted-foreground">{p.status} · {new Date(p.processedAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
