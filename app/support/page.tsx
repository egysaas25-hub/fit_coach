import { Sidebar } from "@/components/sidebar"
import { CustomerSupport } from "@/components/customer-support"

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
