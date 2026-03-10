import { createClient } from "@/lib/supabase/server"
import { AdminSettings } from "@/components/admin/admin-settings"

export const metadata = {
  title: "Settings | Fenix Car Hire Admin"
}

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your admin account settings</p>
      </div>

      <AdminSettings profile={adminProfile} userEmail={user?.email || ""} />
    </div>
  )
}
