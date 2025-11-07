'use client';
export const dynamic = "force-dynamic";
import { ReportsAnalytics } from "@/components/features/analytics/revenue-chart";
import { Sidebar } from "@/components/ui/sidebar";

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
