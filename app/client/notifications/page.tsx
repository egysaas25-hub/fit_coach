"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useNotifications, useMarkNotificationRead } from '@/lib/hooks/api/useNotifications';

export default function NotificationsPage() {
  const { data, isLoading, error } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;
  const total = data?.total || 0;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Your latest updates and alerts</p>
          </div>
        </div>

        {error ? (
          <div className="text-destructive">Failed to load notifications</div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? '...' : total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">
                    {isLoading ? '...' : unreadCount}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Latest</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? '...' : Math.min(total, 3)}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading notifications...</div>
                ) : notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification: { id: string; type: string; message: string; createdAt: string; read: boolean }) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border ${
                          !notification.read ? "bg-accent/50" : ""
                        }`}
                      >
                        <div className="mt-0.5">{getIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold">{notification.type.toUpperCase()}</h3>
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                        {!notification.read ? (
                          <Badge
                            variant="default"
                            onClick={() => markRead(notification.id)}
                            className="cursor-pointer"
                          >
                            Mark Read
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Read</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No notifications</div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}