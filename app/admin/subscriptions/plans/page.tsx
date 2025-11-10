"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSubscriptions } from '@/lib/hooks/api/useSubscriptions';
import { SubscriptionPlan } from '@/types/domain/subscription';

export default function PlansPricingPage() {
  const { subscriptions } = useSubscriptions();
  const plans: SubscriptionPlan[] = subscriptions.map((s: any) => ({ id: s.planId, name: `Plan ${s.planId}`, price: s.amount, activeCount: 0, billingCycle: 'Monthly' as any }));
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Plans & Pricing</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {plans.map((p) => (
            <div key={p.id} className="border border-border rounded-md p-3">
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-muted-foreground">${p.price}/mo</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
