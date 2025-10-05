export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Activity History</h1>
          <p className="text-muted-foreground mt-2">View your complete activity timeline</p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <select className="px-4 py-2 bg-background border border-border rounded-lg text-foreground">
              <option>All Activities</option>
              <option>Workouts</option>
              <option>Nutrition</option>
              <option>Measurements</option>
              <option>Messages</option>
            </select>
            <select className="px-4 py-2 bg-background border border-border rounded-lg text-foreground">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>All Time</option>
            </select>
            <input
              type="search"
              placeholder="Search activities..."
              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {[
            {
              date: "Today",
              time: "2:30 PM",
              type: "Workout",
              title: "Completed Upper Body Strength",
              desc: "45 minutes • 8 exercises",
              icon: "💪",
            },
            {
              date: "Today",
              time: "9:00 AM",
              type: "Nutrition",
              title: "Logged Breakfast",
              desc: "520 calories • 35g protein",
              icon: "🍳",
            },
            {
              date: "Yesterday",
              time: "6:00 PM",
              type: "Measurement",
              title: "Updated Body Weight",
              desc: "175 lbs (-2 lbs from last week)",
              icon: "⚖️",
            },
            {
              date: "Yesterday",
              time: "3:15 PM",
              type: "Workout",
              title: "Completed Cardio Session",
              desc: "30 minutes • Running",
              icon: "🏃",
            },
            {
              date: "Dec 14",
              time: "10:30 AM",
              type: "Message",
              title: "Message from Trainer",
              desc: "Great progress this week! Keep it up.",
              icon: "💬",
            },
            {
              date: "Dec 14",
              time: "7:00 AM",
              type: "Workout",
              title: "Completed Leg Day",
              desc: "60 minutes • 10 exercises",
              icon: "💪",
            },
          ].map((activity, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                  {activity.icon}
                </div>
                {i < 5 && <div className="w-0.5 h-full bg-border mt-2" />}
              </div>
              <div className="flex-1 pb-6">
                <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        {activity.date} • {activity.time}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground mt-1">{activity.title}</h3>
                    </div>
                    <span className="px-2 py-1 bg-accent text-foreground rounded text-xs font-medium">
                      {activity.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-accent">
            Load More Activities
          </button>
        </div>
      </div>
    </div>
  )
}
