"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
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
  Target,
  Dumbbell,
  Table,
} from "lucide-react"
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
import { cn } from "@/lib/utils/cn"
import { useAuthStore } from "@/lib/store/auth.store"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, section: "Overview" },
  { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3, section: "Overview" },
  
  { name: "Customers", href: "/admin/clients", icon: ShoppingCart, section: "Users" },
  { name: "Team Dashboard", href: "/admin/teams", icon: Users2, section: "Users" },
  { name: "Team Members", href: "/admin/teams/members", icon: Users, section: "Users" },
  { name: "Team Analytics", href: "/admin/teams/analytics", icon: BarChart3, section: "Users" },
  { name: "Roles & Permissions", href: "/admin/teams/roles", icon: Shield, section: "Users" },
  
  { name: "Workout", href: "/admin/workouts", icon: Dumbbell, section: "plans" },
  { name: "Nutrition", href: "/admin/nutrition", icon: Target, section: "plans" },
  { name: "Custom Exercises", href: "/admin/exercises/custom", icon: Table, section: "plans" },
  { name: "Exercise AI", href: "/admin/exercises/ai", icon: Sparkles, section: "plans" },
  { name: "Meal Templates", href: "/admin/nutrition/templates", icon: Table, section: "plans" },
  { name: "Ingredients", href: "/admin/nutrition/ingredients", icon: Table, section: "plans" },
  { name: "AI Meal Builder", href: "/admin/nutrition/ai", icon: Sparkles, section: "plans" },
  { name: "Client Meal Logs", href: "/admin/nutrition/logs", icon: ScrollText, section: "plans" },
  { name: "Programs", href: "/admin/programs", icon: Table, section: "plans" },
  { name: "Goal Templates", href: "/admin/programs/goals", icon: Target, section: "plans" },
  
  { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard, section: "Business" },
  { name: "Plans & Pricing", href: "/admin/subscriptions/plans", icon: CreditCard, section: "Business" },
  { name: "Invoices & Payments", href: "/admin/subscriptions/invoices", icon: FileText, section: "Business" },
  { name: "Renewal Automation", href: "/admin/subscriptions/renewals", icon: Zap, section: "Business" },
  { name: "Referrals", href: "/admin/referrals", icon: UserPlus, section: "Business" },
  
  { name: "Automation Library", href: "/admin/automation/library", icon: ScrollText, section: "Automation" },
  { name: "Triggers & Events", href: "/admin/automation/triggers", icon: Zap, section: "Automation" },
  { name: "AI Alerts", href: "/admin/automation/alerts", icon: Bell, section: "Automation" },
  
  { name: "System Monitor", href: "/admin/system", icon: Activity, section: "System" },
  { name: "Audit Log", href: "/admin/audit", icon: FileText, section: "System" },
  { name: "Error Queue", href: "/admin/errors", icon: AlertCircle, section: "System" },
  { name: "Notifications", href: "/admin/notifications", icon: Bell, section: "System" },
  { name: "Integrations", href: "/admin/settings/integrations", icon: Zap, section: "System" },
  { name: "Branding", href: "/admin/settings/branding", icon: Settings, section: "System" },
  { name: "Account Settings", href: "/admin/settings/account", icon: User, section: "System" },
  { name: "Billing & Usage", href: "/admin/settings/billing", icon: CreditCard, section: "System" },
  { name: "Support", href: "/admin/support", icon: HelpCircle, section: "System" },
  { name: "Settings", href: "/admin/settings/general", icon: Settings, section: "System" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [openSection, setOpenSection] = useState<string>("Overview")
  const { tenantId } = useAuthStore.getState()

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
          {Object.entries(
            navigation.reduce((acc, item) => {
              if (!acc[item.section]) acc[item.section] = []
              acc[item.section].push(item)
              return acc
            }, {} as Record<string, typeof navigation>)
          ).map(([section, items]) => (
            <div key={section} className="mb-4">
              <button type="button" className="w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between" onClick={() => setOpenSection(openSection === section ? '' : section)}>
                {section}
                <span className="text-muted-foreground">{openSection === section ? '−' : '+'}</span>
              </button>
              {openSection === section && items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={tenantId ? `/t/${tenantId}${item.href}` : item.href}
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
            </div>
          ))}
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