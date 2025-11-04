export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Reports</h1>
        <p className="text-muted-foreground mt-2">Generate and export business reports</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          { name: "Monthly Revenue Report", description: "Detailed breakdown of revenue by service", icon: "📊" },
          { name: "Client Progress Report", description: "Track client achievements and milestones", icon: "📈" },
          { name: "Trainer Performance", description: "Evaluate trainer metrics and client satisfaction", icon: "⭐" },
          { name: "Retention Analysis", description: "Client retention and churn analysis", icon: "🔄" },
        ].map((report) => (
          <div key={report.name} className="bg-card border border-border rounded-xl p-6">
            <div className="text-3xl mb-3">{report.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{report.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
            <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20">
              Generate Report
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
