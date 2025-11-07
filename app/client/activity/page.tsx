'use client';
export const dynamic = "force-dynamic";
import { ClientActivity } from "@/components/features/client/client-stats";
import { Sidebar } from "@/components/ui/sidebar";


export default function ActivityPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ClientActivity
         />
      </main>
    </div>
  )
}
