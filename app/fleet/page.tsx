import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VehicleCard } from "@/components/vehicle-card"
import { VehicleFilters } from "@/components/vehicle-filters"

export const metadata = {
  title: "Our Fleet | Fenix Car Hire",
  description: "Browse our extensive fleet of quality vehicles for rent in Eswatini. From economy cars to luxury SUVs."
}

interface FleetPageProps {
  searchParams: Promise<{ category?: string; sort?: string }>
}

export default async function FleetPage({ searchParams }: FleetPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("vehicles")
    .select("*")
    .eq("available", true)

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category)
  }

  if (params.sort === "price_asc") {
    query = query.order("price_per_day", { ascending: true })
  } else if (params.sort === "price_desc") {
    query = query.order("price_per_day", { ascending: false })
  } else {
    query = query.order("featured", { ascending: false }).order("name")
  }

  const { data: vehicles } = await query

  // Get unique categories
  const { data: allVehicles } = await supabase.from("vehicles").select("category")
  const categories = [...new Set(allVehicles?.map(v => v.category) || [])]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Page Header */}
        <section className="bg-primary py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Our Vehicle Fleet
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              Choose from our wide selection of well-maintained vehicles. From compact cars for city driving to luxury SUVs for special occasions.
            </p>
          </div>
        </section>

        {/* Filters and Vehicle Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <VehicleFilters 
              categories={categories} 
              currentCategory={params.category} 
              currentSort={params.sort} 
            />

            {vehicles && vehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  No vehicles found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
