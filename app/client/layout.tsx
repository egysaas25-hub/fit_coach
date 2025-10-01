import { ClientSidebar } from "@/components/client-sidebar"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <ClientSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}