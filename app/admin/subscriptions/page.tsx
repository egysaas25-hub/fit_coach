export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Subscriptions</h1>
          <p className="text-muted-foreground mt-2">Manage your subscription plans and billing</p>
        </div>

        {/* Current Plan */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Current Plan</h2>
              <p className="text-sm text-muted-foreground mt-1">Your active subscription</p>
            </div>
            <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">Active</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Plan Name</p>
              <p className="text-lg font-semibold text-foreground mt-1">Premium Monthly</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-lg font-semibold text-foreground mt-1">$49.99/month</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Billing Date</p>
              <p className="text-lg font-semibold text-foreground mt-1">Jan 15, 2025</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              Upgrade Plan
            </button>
            <button className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-accent">
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Available Plans */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Basic", price: "$29.99", features: ["5 Workouts/month", "Basic Nutrition", "Email Support"] },
              {
                name: "Premium",
                price: "$49.99",
                features: ["Unlimited Workouts", "Custom Nutrition", "Priority Support", "Progress Tracking"],
                current: true,
              },
              {
                name: "Elite",
                price: "$99.99",
                features: ["Everything in Premium", "1-on-1 Coaching", "Video Consultations", "Custom Meal Plans"],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`bg-card border rounded-lg p-6 ${plan.current ? "border-primary" : "border-border"}`}
              >
                {plan.current && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium mb-3 inline-block">
                    Current Plan
                  </span>
                )}
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {plan.price}
                  <span className="text-sm text-muted-foreground">/month</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full mt-6 px-4 py-2 rounded-lg ${plan.current ? "bg-accent text-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                >
                  {plan.current ? "Current Plan" : "Select Plan"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Billing History</h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-accent">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-foreground">Description</th>
                  <th className="text-left p-4 text-sm font-medium text-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-foreground">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "Dec 15, 2024", desc: "Premium Monthly", amount: "$49.99", status: "Paid" },
                  { date: "Nov 15, 2024", desc: "Premium Monthly", amount: "$49.99", status: "Paid" },
                  { date: "Oct 15, 2024", desc: "Premium Monthly", amount: "$49.99", status: "Paid" },
                ].map((invoice, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-4 text-sm text-foreground">{invoice.date}</td>
                    <td className="p-4 text-sm text-foreground">{invoice.desc}</td>
                    <td className="p-4 text-sm text-foreground">{invoice.amount}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-medium">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-primary hover:underline text-sm">Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
