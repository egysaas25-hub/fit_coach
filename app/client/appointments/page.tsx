'use client';
export const dynamic = "force-dynamic";

import { AppointmentScheduling } from "@/components/features/appointment-scheduling";
import { Sidebar } from "@/components/ui/sidebar";

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
