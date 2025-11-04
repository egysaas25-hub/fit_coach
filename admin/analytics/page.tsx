export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Analytics</h1>
        <p className="text-muted-foreground mt-2">Track business performance and client metrics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-2">Monthly Revenue</div>
          <div className="text-2xl font-bold">$24,500</div>
          <div className="text-sm text-primary mt-2">+12% from last month</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-2">Active Clients</div>
          <div className="text-2xl font-bold">156</div>
          <div className="text-sm text-primary mt-2">+8 new this month</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-2">Retention Rate</div>
          <div className="text-2xl font-bold">94%</div>
          <div className="text-sm text-primary mt-2">+2% improvement</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-sm text-muted-foreground mb-2">Avg Session Rate</div>
          <div className="text-2xl font-bold">87%</div>
          <div className="text-sm text-muted-foreground mt-2">Completion rate</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {[65, 72, 68, 80, 85, 78, 90, 88, 95, 92, 98, 100].map((height, i) => (
            <div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
