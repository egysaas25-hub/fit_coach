import { Sidebar } from "@/components/sidebar"
import { ConsultationManagement } from "@/components/consultation-management"

export default function ConsultationsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ConsultationManagement />
      </main>
    </div>
  )
}
