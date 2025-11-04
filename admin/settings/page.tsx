export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                defaultValue="Sarah Johnson"
                className="w-full mt-2 px-4 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                defaultValue="sarah@trainersaas.com"
                className="w-full mt-2 px-4 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                type="tel"
                defaultValue="+1 234 567 8900"
                className="w-full mt-2 px-4 py-2 bg-background border border-border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Business Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Business Name</label>
              <input
                type="text"
                defaultValue="Elite Fitness Coaching"
                className="w-full mt-2 px-4 py-2 bg-background border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <select className="w-full mt-2 px-4 py-2 bg-background border border-border rounded-lg">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC+0 (GMT)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
