"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Shield,
  Key,
  Activity,
  UserPlus,
  BarChart3,
  Users2,
  FileText,
  AlertCircle,
  Settings,
  User,
  LogOut,
  Sparkles,
  ScrollText,
  MessageSquare,
  CreditCard,
  Bell,
  HelpCircle,
  Zap,
  ShoppingCart,
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
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Customers", href: "/admin/customers", icon: ShoppingCart },
  { name: "Conversations", href: "/admin/conversations", icon: MessageSquare },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { name: "Role Management", href: "/admin/roles", icon: Shield },
  { name: "Permissions", href: "/admin/permissions", icon: Key },
  { name: "Referrals", href: "/admin/referrals", icon: UserPlus },
  { name: "Team Dashboard", href: "/admin/teams/dashboard", icon: Users2 },
  { name: "Global Analytics", href: "/admin/analytics/global", icon: BarChart3 },
  { name: "System Monitor", href: "/admin/system", icon: Activity },
  { name: "Audit Log", href: "/admin/audit", icon: FileText },
  { name: "Error Queue", href: "/admin/errors", icon: AlertCircle },
  { name: "Message Templates", href: "/admin/message-templates", icon: MessageSquare },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Integrations", href: "/admin/integrations", icon: Zap },
  { name: "Support", href: "/admin/support", icon: HelpCircle },
  { name: "AI Templates", href: "/admin/ai/templates", icon: Sparkles },
  { name: "AI Logs", href: "/admin/ai/logs", icon: ScrollText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xl font-bold">VTrack Admin</span>
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
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin User" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
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