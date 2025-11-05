"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Building2,
  CreditCard,
  BarChart3,
  Settings,
  User,
  LogOut,
  Database,
  Zap,
  FileCode,
  Globe,
  BookOpen,
  Languages,
  Gauge,
  Wrench,
  Webhook,
  HardDrive,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

const navigation = [
  { name: "Dashboard", href: "/super-admin/dashboard", icon: Home },
  { name: "Tenant Management", href: "/super-admin/tenants", icon: Building2 },
  { name: "Billing & Subscriptions", href: "/super-admin/billing", icon: CreditCard },
  { name: "Platform Analytics", href: "/super-admin/analytics", icon: BarChart3 },
  { name: "System Configuration", href: "/super-admin/config", icon: Settings },
  { name: "ETL Pipeline", href: "/super-admin/etl", icon: Database },
  { name: "Integrations", href: "/super-admin/integrations", icon: Zap },
  { name: "Webhooks", href: "/super-admin/webhooks", icon: Webhook },
  { name: "API Documentation", href: "/super-admin/api/docs", icon: FileCode },
  { name: "Embeddings", href: "/super-admin/embeddings", icon: Globe },
  { name: "Dictionary", href: "/super-admin/dictionary", icon: BookOpen },
  { name: "Translations", href: "/super-admin/translations", icon: Languages },
  { name: "Rate Limits", href: "/super-admin/rate-limits", icon: Gauge },
  { name: "Tools", href: "/super-admin/tools", icon: Wrench },
  { name: "Dispatch", href: "/super-admin/dispatch", icon: Zap },
  { name: "Backup & Restore", href: "/super-admin/backup", icon: HardDrive },
  { name: "Settings", href: "/super-admin/settings", icon: Settings },
]

export function SuperAdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xl font-bold">VTrack Super</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent transition-colors cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Super Admin" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Super Admin</p>
                <p className="text-xs text-muted-foreground">Platform Owner</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}