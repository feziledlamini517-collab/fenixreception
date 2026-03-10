"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Filter, ArrowUpDown } from "lucide-react"

interface VehicleFiltersProps {
  categories: string[]
  currentCategory?: string
  currentSort?: string
}

export function VehicleFilters({ categories, currentCategory, currentSort }: VehicleFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/fleet?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Category Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter("category", "all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !currentCategory || currentCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => updateFilter("category", category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-5 h-5 text-muted-foreground" />
        <select
          value={currentSort || "featured"}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="featured">Featured First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  )
}
