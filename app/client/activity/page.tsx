import { Sidebar } from "@/components/sidebar"
import { ClientActivity } from "@/components/client-activity"

export default function ActivityPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ClientActivity />
      </main>
    </div>
  )
}
