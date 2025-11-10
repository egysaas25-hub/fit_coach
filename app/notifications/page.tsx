"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications, useMarkNotificationRead } from '@/lib/hooks/api/useNotifications';

export default function NotificationsPage() {
  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();
  const items = data?.notifications ?? [];

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {items.map((n) => (
            <div key={n.id} className="flex items-center justify-between border border-border rounded-md p-3">
              <div>
                <div className="font-medium">{n.message}</div>
                <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              {!n.read && (
                <Button size="sm" variant="outline" onClick={() => markRead.mutate(n.id)}>Mark read</Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
