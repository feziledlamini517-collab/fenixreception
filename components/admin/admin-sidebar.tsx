"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Car, Calendar, Users, Settings, ExternalLink } from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/settings", label: "Settings", icon: Settings }
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-foreground text-background hidden lg:block">
      {/* Logo */}
      <div className="p-6 border-b border-muted/20">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">F</span>
          </div>
          <div>
            <span className="text-xl font-bold">FENIX</span>
            <span className="block text-xs text-muted tracking-wider">ADMIN</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:bg-muted/10 hover:text-background"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* View Site Link */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-muted/20">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-muted/10 hover:text-background transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          <span className="font-medium">View Site</span>
        </Link>
      </div>
    </aside>
  )
}
