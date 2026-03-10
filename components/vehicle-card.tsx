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
  featured: boolean
}

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
      {/* Vehicle Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={vehicle.image_url}
          alt={vehicle.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            {vehicle.category}
          </span>
          {vehicle.featured && (
            <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Featured
            </span>
          )}
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
  )
}
