"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2, User, Lock, Plus } from "lucide-react"

interface AdminProfile {
  id: string
  email: string
  full_name: string | null
  role: string
}

interface AdminSettingsProps {
  profile: AdminProfile | null
  userEmail: string
}

export function AdminSettings({ profile, userEmail }: AdminSettingsProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // For adding new admin
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [newAdminPassword, setNewAdminPassword] = useState("")
  const [newAdminName, setNewAdminName] = useState("")
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage(null)

    try {
      const supabase = createClient()
      await supabase
        .from("admin_profiles")
        .update({ full_name: fullName })
        .eq("id", profile?.id)

      setMessage({ type: "success", text: "Profile updated successfully" })
      router.refresh()
    } catch {
      setMessage({ type: "error", text: "Failed to update profile" })
    } finally {
      setIsUpdating(false)
    }
  }

  const addNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingAdmin(true)
    setMessage(null)

    try {
      const supabase = createClient()
      
      // Create new user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
          data: {
            full_name: newAdminName
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("Failed to create user")

      // Add to admin_profiles
      const { error: profileError } = await supabase.from("admin_profiles").insert({
        id: authData.user.id,
        email: newAdminEmail,
        full_name: newAdminName,
        role: "admin"
      })

      if (profileError) throw profileError

      setMessage({ type: "success", text: "Admin user created! They will receive a confirmation email." })
      setNewAdminEmail("")
      setNewAdminPassword("")
      setNewAdminName("")
      setShowAddAdmin(false)
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to create admin user" })
    } finally {
      setIsAddingAdmin(false)
    }
  }

  return (
    <div className="space-y-8">
      {message && (
        <div className={`px-4 py-3 rounded-lg ${
          message.type === "success" 
            ? "bg-green-50 border border-green-200 text-green-700" 
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-card rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
            <p className="text-sm text-muted-foreground">Update your account information</p>
          </div>
        </div>

        <form onSubmit={updateProfile} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>

      {/* Add New Admin */}
      <div className="bg-card rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Admin Users</h2>
              <p className="text-sm text-muted-foreground">Manage admin access</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddAdmin(!showAddAdmin)}
            className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Admin
          </button>
        </div>

        {showAddAdmin && (
          <form onSubmit={addNewAdmin} className="space-y-4 max-w-md border-t border-border pt-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <input
                type="text"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isAddingAdmin}
                className="bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isAddingAdmin ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Admin"
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAddAdmin(false)}
                className="bg-muted hover:bg-muted/80 text-foreground px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
