import { Sidebar } from "@/components/sidebar"
import { ReportsAnalytics } from "@/components/reports-analytics"

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ReportsAnalytics />
      </main>
    </div>
  )
}
