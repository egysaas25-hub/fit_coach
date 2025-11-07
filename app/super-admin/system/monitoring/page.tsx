'use client';
export const dynamic = "force-dynamic";

import { ApiMonitoring } from "@/components/features/api-monitoring";
import { Sidebar } from "@/components/ui/sidebar";

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
