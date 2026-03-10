"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Vehicle {
  id: string
  name: string
  category: string
  description: string
  price_per_day: number
  image_url: string
}

interface HeroSliderProps {
  vehicles: Vehicle[]
}

export function HeroSlider({ vehicles }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % vehicles.length)
  }, [vehicles.length])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + vehicles.length) % vehicles.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  if (vehicles.length === 0) {
    return (
      <section className="relative h-[600px] lg:h-[700px] bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No featured vehicles available</p>
      </section>
    )
  }

  const currentVehicle = vehicles[currentSlide]

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
      {/* Slides */}
      {vehicles.map((vehicle, index) => (
        <div
          key={vehicle.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <Image
            src={vehicle.image_url}
            alt={vehicle.name}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-2xl">
          <span className="inline-block bg-accent text-accent-foreground text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            {currentVehicle.category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-4 text-balance">
            {currentVehicle.name}
          </h1>
          <p className="text-lg md:text-xl text-background/80 mb-6 leading-relaxed">
            {currentVehicle.description}
          </p>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-4xl font-bold text-accent">E{currentVehicle.price_per_day}</span>
            <span className="text-background/70">/ per day</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/book?vehicle=${currentVehicle.id}`}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
            >
              Book This Vehicle
            </Link>
            <Link
              href="/fleet"
              className="bg-background/20 hover:bg-background/30 text-background border border-background/30 px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center backdrop-blur-sm"
            >
              View All Fleet
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-background/20 hover:bg-background/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-background" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-background/20 hover:bg-background/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-background" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {vehicles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-accent w-8"
                : "bg-background/50 hover:bg-background/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
