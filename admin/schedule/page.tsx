export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Schedule</h1>
        <p className="text-muted-foreground mt-2">Manage appointments and sessions</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
        <div className="space-y-4">
          {[
            { time: "09:00 AM", client: "John Doe", type: "Training Session", trainer: "Sarah Johnson" },
            { time: "10:30 AM", client: "Jane Smith", type: "Nutrition Consult", trainer: "Emma Davis" },
            { time: "02:00 PM", client: "Mike Wilson", type: "Progress Check", trainer: "Mike Chen" },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-muted-foreground w-24">{session.time}</div>
                <div>
                  <div className="font-medium">{session.client}</div>
                  <div className="text-sm text-muted-foreground">{session.type}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{session.trainer}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
