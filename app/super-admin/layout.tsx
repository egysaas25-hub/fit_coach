import { SuperAdminSidebar } from "@/components/layouts/super-admin-layout"

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}