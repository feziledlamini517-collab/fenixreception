import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSlider } from "@/components/hero-slider"
import { BookingForm } from "@/components/booking-form"
import { FeaturedVehicles } from "@/components/featured-vehicles"
import { WhyChooseUs } from "@/components/why-choose-us"
import { Testimonials } from "@/components/testimonials"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredVehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("featured", true)
    .eq("available", true)
    .order("created_at", { ascending: false })

  const { data: allVehicles } = await supabase
    .from("vehicles")
    .select("id, name, price_per_day")
    .eq("available", true)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Slider */}
        <HeroSlider vehicles={featuredVehicles || []} />

        {/* Quick Booking Form */}
        <section className="relative z-20 px-4">
          <BookingForm vehicles={allVehicles || []} variant="inline" />
        </section>

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Featured Vehicles */}
        <FeaturedVehicles vehicles={featuredVehicles || []} />

        {/* Testimonials */}
        <Testimonials />
      </main>

      <Footer />
    </div>
  )
}
