import Image from "next/image"
import Link from "next/link"
import { Users, Fuel, Settings } from "lucide-react"

interface Vehicle {
  id: string
  name: string
  category: string
  description: string
  price_per_day: number
  seats: number
  transmission: string
  fuel_type: string
  image_url: string
}

interface FeaturedVehiclesProps {
  vehicles: Vehicle[]
}

export function FeaturedVehicles({ vehicles }: FeaturedVehiclesProps) {
  if (vehicles.length === 0) return null

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Fleet</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Featured Vehicles</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular vehicles, maintained to the highest standards for your comfort and safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.slice(0, 6).map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
            >
              {/* Vehicle Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={vehicle.image_url}
                  alt={vehicle.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {vehicle.category}
                  </span>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{vehicle.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{vehicle.description}</p>

                {/* Specs */}
                <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{vehicle.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="w-4 h-4" />
                    <span>{vehicle.transmission}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="w-4 h-4" />
                    <span>{vehicle.fuel_type}</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">E{vehicle.price_per_day}</span>
                    <span className="text-muted-foreground text-sm"> / day</span>
                  </div>
                  <Link
                    href={`/book?vehicle=${vehicle.id}`}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
          >
            View All Vehicles
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
