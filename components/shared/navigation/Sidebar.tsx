"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Dumbbell,
  Apple,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Shield,
  Activity,
  UserPlus,
  BarChart3,
  Users2,
  FileText,
  User,
  Sparkles,
  ScrollText,
  CreditCard,
  HelpCircle,
  Zap,
  ShoppingCart,
  Table,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  children?: NavItem[]
}

interface SidebarProps {
  role: "admin" | "trainer" | "client"
  tenantId?: string
}

const adminNavItems: NavItem[] = [
  // Overview Section
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    children: [
      { title: "Business Analytics", href: "/admin/dashboard/analytics/business", icon: BarChart3 },
      { title: "Client Analytics", href: "/admin/dashboard/analytics/clients", icon: Users },
      { title: "Trainer Analytics", href: "/admin/dashboard/analytics/trainers", icon: Users2 },
      { title: "System Health", href: "/admin/dashboard/analytics/system", icon: Activity },
    ],
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },

  // Users Section
  {
    title: "Clients",
    href: "/admin/clients",
    icon: Users,
  },
  {
    title: "Team",
    href: "/admin/teams",
    icon: Users2,
    children: [
      { title: "Members", href: "/admin/teams/members", icon: Users },
      { title: "Analytics", href: "/admin/teams/analytics", icon: BarChart3 },
      { title: "Roles & Permissions", href: "/admin/teams/roles", icon: Shield },
    ],
  },

  // Communication Section
  {
    title: "Communication",
    href: "/admin/communication",
    icon: MessageSquare,
    badge: 5,
    children: [
      { title: "WhatsApp", href: "/admin/communication/whatsapp", icon: MessageSquare },
      { title: "Email", href: "/admin/communication/email", icon: MessageSquare },
      { title: "Conversations", href: "/admin/communication/conversations", icon: MessageSquare },
      { title: "Templates", href: "/admin/communication/templates", icon: MessageSquare },
    ],
  },

  // Plans & Programs Section
  {
    title: "Programs",
    href: "/admin/programs",
    icon: Target,
    children: [
      { title: "Training Plans", href: "/admin/programs/training/new", icon: Dumbbell },
      { title: "Nutrition Plans", href: "/admin/programs/nutrition/new", icon: Apple },
      { title: "Assignments", href: "/admin/programs/assignments", icon: Table },
      { title: "Goal Templates", href: "/admin/programs/goals", icon: Target },
    ],
  },
  {
    title: "Exercises",
    href: "/admin/exercises",
    icon: Dumbbell,
    children: [
      { title: "Library", href: "/admin/exercises/library", icon: Table },
      { title: "Custom", href: "/admin/exercises/custom", icon: Table },
      { title: "AI Generator", href: "/admin/exercises/ai", icon: Sparkles },
    ],
  },
  {
    title: "Nutrition",
    href: "/admin/nutrition",
    icon: Apple,
    children: [
      { title: "Ingredients", href: "/admin/nutrition/ingredients", icon: Table },
      { title: "Templates", href: "/admin/nutrition/templates", icon: Table },
      { title: "AI Generator", href: "/admin/nutrition/ai", icon: Sparkles },
      { title: "Client Logs", href: "/admin/nutrition/logs", icon: ScrollText },
    ],
  },
  {
    title: "Workouts",
    href: "/admin/workouts",
    icon: Dumbbell,
  },

  // Business Section
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
    children: [
      { title: "Plans & Pricing", href: "/admin/subscriptions/plans", icon: CreditCard },
      { title: "Invoices & Payments", href: "/admin/subscriptions/invoices", icon: FileText },
      { title: "Renewal Automation", href: "/admin/subscriptions/renewals", icon: Zap },
    ],
  },
  {
    title: "Referrals",
    href: "/admin/referrals",
    icon: UserPlus,
  },

  // Automation Section
  {
    title: "Automation",
    href: "/admin/automation",
    icon: Zap,
    children: [
      { title: "Library", href: "/admin/automation/library", icon: ScrollText },
      { title: "Triggers & Events", href: "/admin/automation/triggers", icon: Zap },
      { title: "AI Alerts", href: "/admin/automation/alerts", icon: Bell },
      { title: "Workflows", href: "/admin/automation/workflows", icon: Zap },
    ],
  },
  {
    title: "AI Tools",
    href: "/admin/ai",
    icon: Sparkles,
    children: [
      { title: "Logs", href: "/admin/ai/logs", icon: FileText },
      { title: "Templates", href: "/admin/ai/templates", icon: Table },
    ],
  },

  // System Section
  {
    title: "System",
    href: "/admin/system",
    icon: Activity,
    children: [
      { title: "Monitor", href: "/admin/system", icon: Activity },
      { title: "Audit Log", href: "/admin/audit", icon: FileText },
      { title: "Notifications", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    children: [
      { title: "Integrations", href: "/admin/settings/integrations", icon: Zap },
      { title: "WhatsApp", href: "/admin/settings/whatsapp", icon: MessageSquare },
      { title: "Branding", href: "/admin/settings/branding", icon: Settings },
      { title: "Account", href: "/admin/settings/account", icon: User },
      { title: "Billing & Usage", href: "/admin/settings/billing", icon: CreditCard },
      { title: "General", href: "/admin/settings/general", icon: Settings },
    ],
  },
  {
    title: "Support",
    href: "/admin/support",
    icon: HelpCircle,
  },
]

export function Sidebar({ role, tenantId }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const navItems = role === "admin" ? adminNavItems : []

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-lg font-bold">Trainer SaaS</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("ml-auto", collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <div key={item.href}>
              <Link
                href={item.children ? "#" : (tenantId ? `/t/${tenantId}${item.href}` : item.href)}
                onClick={(e) => {
                  if (item.children) {
                    e.preventDefault()
                    toggleExpanded(item.title)
                  }
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive(item.href) && "bg-accent text-accent-foreground font-medium",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>

              {/* Children */}
              {item.children && !collapsed && expandedItems.includes(item.title) && (
                <div className="ml-6 mt-1 space-y-1 border-l pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={tenantId ? `/t/${tenantId}${child.href}` : child.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                        isActive(child.href) && "bg-accent text-accent-foreground font-medium"
                      )}
                    >
                      <child.icon className="h-3 w-3" />
                      <span>{child.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Notification Center Toggle */}
      {!collapsed && (
        <div className="border-t p-3">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              3
            </span>
          </Button>
        </div>
      )}
    </div>
  )
}
