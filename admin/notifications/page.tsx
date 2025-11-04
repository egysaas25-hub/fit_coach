export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Notifications</h1>
        <p className="text-muted-foreground mt-2">Manage your notification preferences</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
        <div className="space-y-4">
          {[
            { title: "New client signup", message: "John Doe has signed up for training", time: "5 min ago" },
            { title: "Payment received", message: "$150 payment from Jane Smith", time: "1 hour ago" },
            {
              title: "Session reminder",
              message: "Training session with Mike Wilson in 30 minutes",
              time: "2 hours ago",
            },
          ].map((notification, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-background rounded-lg">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{notification.message}</div>
                <div className="text-xs text-muted-foreground mt-2">{notification.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
