import { Shield, Clock, Award, HeadphonesIcon, MapPin, CreditCard } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Fully Insured",
    description: "All our vehicles are fully insured for your peace of mind and protection."
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock roadside assistance and customer support whenever you need it."
  },
  {
    icon: Award,
    title: "Quality Vehicles",
    description: "Well-maintained, modern fleet with regular servicing and safety checks."
  },
  {
    icon: HeadphonesIcon,
    title: "Easy Booking",
    description: "Simple online booking process with instant confirmation and flexible options."
  },
  {
    icon: MapPin,
    title: "Multiple Locations",
    description: "Convenient pickup and drop-off points across Eswatini including airport service."
  },
  {
    icon: CreditCard,
    title: "Competitive Rates",
    description: "Transparent pricing with no hidden fees. Best rates guaranteed."
  }
]

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Drive with Confidence
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the Fenix difference with our commitment to quality, safety, and exceptional customer service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
