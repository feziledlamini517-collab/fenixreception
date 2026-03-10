import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookingForm } from "@/components/booking-form"
import Image from "next/image"

export const metadata = {
  title: "Book a Vehicle | Fenix Car Hire",
  description: "Book your rental vehicle with Fenix Car Hire. Easy online booking with instant confirmation."
}

interface BookPageProps {
  searchParams: Promise<{ vehicle?: string }>
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id, name, price_per_day, image_url, category")
    .eq("available", true)

  // Get selected vehicle details if provided
  let selectedVehicle = null
  if (params.vehicle) {
    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", params.vehicle)
      .single()
    selectedVehicle = data
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Page Header */}
        <section className="bg-primary py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Book Your Vehicle
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              Fill out the form below to request your vehicle reservation. We'll confirm your booking within 24 hours.
            </p>
          </div>
        </section>

        {/* Booking Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <BookingForm 
                  vehicles={vehicles || []} 
                  selectedVehicleId={params.vehicle}
                  variant="full"
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Selected Vehicle Preview */}
                {selectedVehicle && (
                  <div className="bg-card rounded-xl overflow-hidden shadow-lg">
                    <div className="relative h-48">
                      <Image
                        src={selectedVehicle.image_url}
                        alt={selectedVehicle.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-semibold text-primary">{selectedVehicle.category}</span>
                      <h3 className="text-lg font-bold text-foreground">{selectedVehicle.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{selectedVehicle.description}</p>
                      <div className="mt-3">
                        <span className="text-2xl font-bold text-primary">E{selectedVehicle.price_per_day}</span>
                        <span className="text-muted-foreground text-sm"> / day</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="bg-card rounded-xl p-6 shadow-lg">
                  <h3 className="font-bold text-foreground mb-4">Need Help?</h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      Our team is available to assist you with your booking.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-medium">Phone:</span>
                      <a href="tel:+26876001234" className="text-primary hover:underline">+268 7600 1234</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-medium">WhatsApp:</span>
                      <a href="https://wa.me/26876001234" className="text-primary hover:underline">+268 7600 1234</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-medium">Email:</span>
                      <a href="mailto:bookings@fenixcarhire.co.sz" className="text-primary hover:underline">bookings@fenixcarhire.co.sz</a>
                    </div>
                  </div>
                </div>

                {/* Important Info */}
                <div className="bg-muted/50 rounded-xl p-6">
                  <h3 className="font-bold text-foreground mb-4">Booking Information</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Valid driver's license required
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Minimum age: 23 years
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Security deposit required
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Free cancellation up to 48 hours
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Airport pickup available
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
