import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth"
import { updateVisibility } from "@/lib/site-data"
import type { SiteVisibility } from "@/lib/site-types"

export async function PATCH(request: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = (await request.json().catch(() => null)) as { section?: keyof SiteVisibility; visible?: boolean } | null
  if (!body?.section || typeof body.visible !== "boolean" || !["profile", "skills", "projects", "reviews"].includes(body.section)) {
    return NextResponse.json({ error: "Invalid visibility setting" }, { status: 400 })
  }
  await updateVisibility(body.section, body.visible)
  revalidatePath("/")
  revalidatePath("/admin")
  return NextResponse.json({ message: "Visibility updated" })
}
