export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Integrations</h1>
        <p className="text-muted-foreground mt-2">Connect with third-party services</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          { name: "WhatsApp Business", status: "Connected", icon: "💬" },
          { name: "Stripe Payments", status: "Connected", icon: "💳" },
          { name: "Google Calendar", status: "Not Connected", icon: "📅" },
          { name: "Zoom", status: "Not Connected", icon: "🎥" },
        ].map((integration) => (
          <div key={integration.name} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{integration.icon}</div>
                <div>
                  <h3 className="font-semibold">{integration.name}</h3>
                  <div
                    className={`text-sm ${integration.status === "Connected" ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {integration.status}
                  </div>
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded-lg ${integration.status === "Connected" ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
              >
                {integration.status === "Connected" ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
