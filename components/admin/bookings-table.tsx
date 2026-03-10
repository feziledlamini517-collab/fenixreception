"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Check, X, Trash2, Loader2 } from "lucide-react"

interface Booking {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  pickup_date: string
  return_date: string
  pickup_location: string
  total_price: number | null
  status: string
  created_at: string
  vehicles: { name: string; category: string } | null
}

interface BookingsTableProps {
  bookings: Booking[]
  currentStatus?: string
}

export function BookingsTable({ bookings, currentStatus }: BookingsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const updateFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status && status !== "all") {
      params.set("status", status)
    } else {
      params.delete("status")
    }
    router.push(`/admin/bookings?${params.toString()}`)
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setLoadingId(bookingId)
    try {
      const supabase = createClient()
      await supabase
        .from("bookings")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", bookingId)
      
      router.refresh()
    } catch (error) {
      console.error("Failed to update booking:", error)
    } finally {
      setLoadingId(null)
    }
  }

  const deleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return
    
    setLoadingId(bookingId)
    try {
      const supabase = createClient()
      await supabase.from("bookings").delete().eq("id", bookingId)
      router.refresh()
    } catch (error) {
      console.error("Failed to delete booking:", error)
    } finally {
      setLoadingId(null)
    }
  }

  const statuses = ["all", "pending", "confirmed", "cancelled", "completed"]

  return (
    <div className="bg-card rounded-xl shadow-sm">
      {/* Filters */}
      <div className="p-4 border-b border-border flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => updateFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              (currentStatus || "all") === status
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Customer</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Vehicle</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Dates</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Location</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border last:border-0">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-foreground">{booking.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{booking.customer_email}</p>
                      <p className="text-sm text-muted-foreground">{booking.customer_phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-foreground">{booking.vehicles?.name || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">{booking.vehicles?.category}</p>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <p className="text-foreground">{new Date(booking.pickup_date).toLocaleDateString()}</p>
                    <p className="text-muted-foreground">to {new Date(booking.return_date).toLocaleDateString()}</p>
                  </td>
                  <td className="py-4 px-6 text-foreground text-sm">{booking.pickup_location}</td>
                  <td className="py-4 px-6 font-medium text-foreground">
                    E{booking.total_price?.toLocaleString() || "0"}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                      booking.status === "pending" ? "bg-amber-100 text-amber-700" :
                      booking.status === "cancelled" ? "bg-red-100 text-red-700" :
                      booking.status === "completed" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {loadingId === booking.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          {booking.status === "pending" && (
                            <>
                              <button
                                onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                title="Confirm"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, "completed")}
                              className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                              title="Mark Complete"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteBooking(booking.id)}
                            className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
