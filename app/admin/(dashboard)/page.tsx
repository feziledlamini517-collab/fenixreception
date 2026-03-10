import { createClient } from "@/lib/supabase/server"
import { Car, Calendar, DollarSign, Clock } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Admin Dashboard | Fenix Car Hire"
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch stats
  const { count: totalVehicles } = await supabase
    .from("vehicles")
    .select("*", { count: "exact", head: true })

  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })

  const { count: pendingBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, vehicles(name)")
    .order("created_at", { ascending: false })
    .limit(5)

  // Calculate total revenue (confirmed bookings only)
  const { data: confirmedBookings } = await supabase
    .from("bookings")
    .select("total_price")
    .eq("status", "confirmed")

  const totalRevenue = confirmedBookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0

  const stats = [
    { label: "Total Vehicles", value: totalVehicles || 0, icon: Car, color: "bg-blue-500" },
    { label: "Total Bookings", value: totalBookings || 0, icon: Calendar, color: "bg-green-500" },
    { label: "Pending Bookings", value: pendingBookings || 0, icon: Clock, color: "bg-amber-500" },
    { label: "Total Revenue", value: `E${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-primary" }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Fenix Car Hire admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-card rounded-xl shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-primary text-sm font-medium hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Vehicle</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Dates</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border last:border-0">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-foreground">{booking.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{booking.customer_email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-foreground">
                      {(booking.vehicles as { name: string } | null)?.name || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground text-sm">
                      {new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                        booking.status === "pending" ? "bg-amber-100 text-amber-700" :
                        booking.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-foreground">
                      E{booking.total_price?.toLocaleString() || "0"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No bookings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
