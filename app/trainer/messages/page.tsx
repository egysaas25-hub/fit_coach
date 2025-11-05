import { Header } from "@/components/header"
import { Sidebar } from "@/components/layouts/sidebar"
import { MessagingSystem } from "@/components/messaging-system"

export default function MessagingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <MessagingSystem />
        </main>
      </div>
    </div>
  )
}
