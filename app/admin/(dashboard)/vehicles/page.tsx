import { createClient } from "@/lib/supabase/server"
import { VehiclesManager } from "@/components/admin/vehicles-manager"

export const metadata = {
  title: "Manage Vehicles | Fenix Car Hire Admin"
}

export default async function VehiclesPage() {
  const supabase = await createClient()

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Vehicles</h1>
        <p className="text-muted-foreground">Add, edit, or remove vehicles from your fleet</p>
      </div>

      <VehiclesManager vehicles={vehicles || []} />
    </div>
  )
}
