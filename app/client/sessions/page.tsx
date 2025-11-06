import { SessionManagement } from "@/components/features/session-management";
import { Sidebar } from "@/components/ui/sidebar";

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
