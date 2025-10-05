import { Sidebar } from "@/components/sidebar"
import { MessagingSystem } from "@/components/messaging-system"

export default function MessagesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <MessagingSystem />
      </main>
    </div>
  )
}