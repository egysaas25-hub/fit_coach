"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications, useMarkNotificationRead } from '@/lib/hooks/api/useNotifications';

export default function NotificationsPage() {
  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();
  const items = data?.notifications ?? [];

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your latest alerts</p>
        </div>
        
        <Card>
          <CardHeader><CardTitle>Recent Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {items.length > 0 ? (
              items.map((n) => (
                <div key={n.id} className="flex items-center justify-between border border-border rounded-md p-3">
                  <div>
                    <div className="font-medium">{n.message}</div>
                    <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  {!n.read && (
                    <Button size="sm" variant="outline" onClick={() => markRead.mutate(n.id)}>Mark read</Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No notifications yet
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
