import { MessagingSystem } from "@/components/features/messaging/chat-interface";
import { Header } from "@/components/navigation/navbar";
import { Sidebar } from "@/components/ui/sidebar";

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
