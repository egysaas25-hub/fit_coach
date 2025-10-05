export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Send Feedback</h1>
          <p className="text-muted-foreground mt-2">Help us improve VTrack by sharing your thoughts</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <form className="space-y-6">
            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Feedback Type</label>
              <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground">
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>General Feedback</option>
                <option>Complaint</option>
                <option>Compliment</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
              <input
                type="text"
                placeholder="Brief description of your feedback"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground">
                <option>Workouts</option>
                <option>Nutrition</option>
                <option>Progress Tracking</option>
                <option>User Interface</option>
                <option>Performance</option>
                <option>Mobile App</option>
                <option>Other</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
              <div className="flex gap-3">
                {["Low", "Medium", "High", "Critical"].map((priority) => (
                  <label key={priority} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="priority" className="text-primary" />
                    <span className="text-sm text-foreground">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                rows={6}
                placeholder="Please provide as much detail as possible..."
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum 20 characters</p>
            </div>

            {/* Screenshots */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Screenshots (Optional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <svg
                  className="w-12 h-12 mx-auto text-muted-foreground mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm text-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email (Optional)</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">We'll use this to follow up on your feedback</p>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Previous Feedback */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Your Previous Feedback</h2>
          <div className="space-y-3">
            {[
              { subject: "Workout timer not working", status: "Resolved", date: "Dec 10, 2024" },
              { subject: "Add dark mode support", status: "In Progress", date: "Dec 5, 2024" },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">{item.subject}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "Resolved" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
