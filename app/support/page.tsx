import { CustomerSupport } from "@/components/features/customer-support";
import { Sidebar } from "@/components/ui/sidebar";

export default function SupportPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <CustomerSupport />
      </main>
    </div>
  )
}
