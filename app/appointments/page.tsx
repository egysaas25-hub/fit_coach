import { Sidebar } from "@/components/sidebar"
import { AppointmentScheduling } from "@/components/appointment-scheduling"

export default function AppointmentsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <AppointmentScheduling />
      </main>
    </div>
  )
}
