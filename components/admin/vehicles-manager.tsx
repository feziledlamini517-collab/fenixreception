"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react"

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
  available: boolean
}

interface VehiclesManagerProps {
  vehicles: Vehicle[]
}

const emptyVehicle = {
  name: "",
  category: "Sedan",
  description: "",
  price_per_day: 0,
  seats: 5,
  transmission: "Automatic",
  fuel_type: "Petrol",
  image_url: "",
  featured: false,
  available: true
}

export function VehiclesManager({ vehicles }: VehiclesManagerProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState(emptyVehicle)

  const openAddModal = () => {
    setEditingVehicle(null)
    setFormData(emptyVehicle)
    setIsModalOpen(true)
  }

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      name: vehicle.name,
      category: vehicle.category,
      description: vehicle.description,
      price_per_day: vehicle.price_per_day,
      seats: vehicle.seats,
      transmission: vehicle.transmission,
      fuel_type: vehicle.fuel_type,
      image_url: vehicle.image_url,
      featured: vehicle.featured,
      available: vehicle.available
    })
    setIsModalOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : 
               type === "number" ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      if (editingVehicle) {
        await supabase
          .from("vehicles")
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq("id", editingVehicle.id)
      } else {
        await supabase.from("vehicles").insert(formData)
      }

      setIsModalOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Failed to save vehicle:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteVehicle = async (vehicleId: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return

    try {
      const supabase = createClient()
      await supabase.from("vehicles").delete().eq("id", vehicleId)
      router.refresh()
    } catch (error) {
      console.error("Failed to delete vehicle:", error)
    }
  }

  const toggleAvailability = async (vehicle: Vehicle) => {
    try {
      const supabase = createClient()
      await supabase
        .from("vehicles")
        .update({ available: !vehicle.available })
        .eq("id", vehicle.id)
      router.refresh()
    } catch (error) {
      console.error("Failed to update vehicle:", error)
    }
  }

  return (
    <>
      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-card rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-40">
              <Image
                src={vehicle.image_url}
                alt={vehicle.name}
                fill
                className="object-cover"
              />
              {!vehicle.available && (
                <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Unavailable
                  </span>
                </div>
              )}
              {vehicle.featured && (
                <div className="absolute top-2 left-2">
                  <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
                    Featured
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{vehicle.name}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.category}</p>
                </div>
                <p className="text-lg font-bold text-primary">E{vehicle.price_per_day}</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => openEditModal(vehicle)}
                  className="flex-1 flex items-center justify-center gap-1 bg-muted hover:bg-muted/80 text-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => toggleAvailability(vehicle)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    vehicle.available
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {vehicle.available ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => deleteVehicle(vehicle.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground">
                  {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Vehicle Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Luxury SUV">Luxury SUV</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Crossover">Crossover</option>
                      <option value="Minibus">Minibus</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Price per Day (E)</label>
                    <input
                      type="number"
                      name="price_per_day"
                      value={formData.price_per_day}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Seats</label>
                    <input
                      type="number"
                      name="seats"
                      value={formData.seats}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Transmission</label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Fuel Type</label>
                    <select
                      name="fuel_type"
                      value={formData.fuel_type}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    required
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm text-foreground">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm text-foreground">Available</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingVehicle ? "Update Vehicle" : "Add Vehicle"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
