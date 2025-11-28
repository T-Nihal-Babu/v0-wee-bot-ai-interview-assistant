"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Brain, Code2, Home, Zap, TrendingUp, Settings } from "lucide-react"

interface DashboardSidebarProps {
  user: any
  onLogout: () => void
}

export default function DashboardSidebar({ user, onLogout }: DashboardSidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/communication", label: "Communication", icon: Brain },
    { href: "/coding", label: "Coding", icon: Code2 },
    { href: "/progress", label: "Progress", icon: TrendingUp },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              WeeBot
            </h2>
            <p className="text-xs text-muted-foreground">Interview Prep</p>
          </div>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user.username}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={active ? "default" : "ghost"}
                className={`w-full justify-start gap-2 ${active ? "bg-accent text-accent-foreground" : ""}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </aside>
  )
}
