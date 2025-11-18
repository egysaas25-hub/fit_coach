"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/shared/navigation/Sidebar"
import { useAuthStore } from "@/lib/store/auth.store"
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { tenantId } = useAuthStore()
  const basePath = tenantId ? `/t/${tenantId}` : ""
  const relative = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname
  const parts = relative.split("/").filter(Boolean)
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar role="admin" tenantId={tenantId || undefined} />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-card border-b border-border">
          <nav className="px-6 py-3 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center">
              {parts.map((p, i) => {
                const href = (tenantId ? `/t/${tenantId}` : "") + "/" + parts.slice(0, i + 1).join("/")
                const label = p.replace(/-/g, " ")
                return (
                  <li key={href} className="flex items-center">
                    <Link href={href} className="hover:text-foreground">
                      {label}
                    </Link>
                    {i < parts.length - 1 && <span className="mx-2">/</span>}
                  </li>
                )
              })}
            </ol>
          </nav>
        </div>
        {children}
      </main>
    </div>
  )
}