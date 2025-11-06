import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "info",
      title: "New Appointment",
      message: "You have a new session scheduled with Mike Johnson",
      time: "10m ago",
      read: false,
    },
    {
      id: 2,
      type: "success",
      title: "Goal Achieved",
      message: "Congratulations! You've reached your weekly goal",
      time: "1h ago",
      read: true,
    },
    {
      id: 3,
      type: "warning",
      title: "Payment Due",
      message: "Your subscription payment is due in 3 days",
      time: "2h ago",
      read: false,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
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

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">
                {notifications.filter((n) => !n.read).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    !notification.read ? "bg-accent/50" : ""
                  }`}
                >
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  {!notification.read && <Badge variant="default">New</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}