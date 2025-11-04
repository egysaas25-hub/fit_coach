export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Team Management</h1>
        <p className="text-muted-foreground mt-2">Manage your coaching team and assign clients</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm text-muted-foreground mt-1">Active Trainers</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-2xl font-bold">156</div>
          <div className="text-sm text-muted-foreground mt-1">Total Clients</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-2xl font-bold">13</div>
          <div className="text-sm text-muted-foreground mt-1">Avg Clients/Trainer</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        <div className="space-y-4">
          {[
            { name: "Sarah Johnson", role: "Senior Trainer", clients: 18, status: "Active" },
            { name: "Mike Chen", role: "Trainer", clients: 15, status: "Active" },
            { name: "Emma Davis", role: "Nutrition Coach", clients: 12, status: "Active" },
          ].map((member) => (
            <div key={member.name} className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">{member.name[0]}</span>
                </div>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-sm">
                  <span className="text-muted-foreground">Clients: </span>
                  <span className="font-medium">{member.clients}</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">{member.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
