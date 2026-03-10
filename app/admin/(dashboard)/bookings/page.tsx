import { createClient } from "@/lib/supabase/server"
import { BookingsTable } from "@/components/admin/bookings-table"

export const metadata = {
  title: "Manage Bookings | Fenix Car Hire Admin"
}

interface BookingsPageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("bookings")
    .select("*, vehicles(name, category)")
    .order("created_at", { ascending: false })

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status)
  }

  const { data: bookings } = await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Bookings</h1>
        <p className="text-muted-foreground">View and manage all booking requests</p>
      </div>

      <BookingsTable bookings={bookings || []} currentStatus={params.status} />
    </div>
  )
}
