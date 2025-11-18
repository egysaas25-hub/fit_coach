"use client"

import { Sidebar } from "@/components/shared/navigation/Sidebar"
import { TopNav } from "@/components/shared/navigation/TopNav"
import { useAuthStore } from "@/lib/store/auth.store"

interface AdminLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    role: string
    avatar?: string
  }
}

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const { tenantId } = useAuthStore()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="admin" tenantId={tenantId || undefined} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav user={user} />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
