'use client';
export const dynamic = "force-dynamic";

import { ConsultationManagement } from "@/components/features/consultation-management";
import { Sidebar } from "@/components/ui/sidebar";

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
