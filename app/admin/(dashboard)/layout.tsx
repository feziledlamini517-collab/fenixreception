import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!adminProfile) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-muted">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader adminName={adminProfile.full_name || adminProfile.email} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
