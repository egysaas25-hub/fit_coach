import { Sidebar } from "@/components/sidebar"
import { SessionManagement } from "@/components/session-management"

export default function SessionsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <SessionManagement />
      </main>
    </div>
  )
}
