import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sibusiso Dlamini",
    role: "Business Executive",
    content: "Excellent service! The Toyota Fortuner was in perfect condition and the booking process was seamless. Highly recommend Fenix Car Hire for anyone visiting Eswatini.",
    rating: 5
  },
  {
    name: "Sarah van der Berg",
    role: "Tourist from South Africa",
    content: "We rented a Land Cruiser for our safari trip and it exceeded all expectations. The team was professional and the vehicle was spotless. Will definitely use again!",
    rating: 5
  },
  {
    name: "Thabo Mkhonto",
    role: "Wedding Planner",
    content: "Fenix provided luxury vehicles for multiple weddings I've organized. Always reliable, always on time, and the drivers are impeccably professional.",
    rating: 5
  }
]

export function Testimonials() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary-foreground/70 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mt-2 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our valued customers have to say about their experience with Fenix Car Hire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-background rounded-xl p-6 shadow-lg"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
