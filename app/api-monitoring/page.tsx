import { Sidebar } from "@/components/sidebar"
import { ApiMonitoring } from "@/components/api-monitoring"

export default function ApiMonitoringPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ApiMonitoring />
      </main>
    </div>
  )
}
