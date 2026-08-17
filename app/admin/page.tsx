import { redirect } from "next/navigation"
import { getSiteData } from "@/lib/site-data"
import { isAdminAuthenticated } from "@/lib/auth"
import AdminDashboard from "@/components/admin-dashboard"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!isAdminAuthenticated()) {
    redirect("/admin/login")
  }

  const siteData = await getSiteData()

  return <AdminDashboard data={siteData} />
}

