import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth"
import { updateProjectVisibility } from "@/lib/site-data"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = (await request.json().catch(() => null)) as { visible?: boolean } | null
  const projectId = Number(id)
  if (!Number.isInteger(projectId) || typeof body?.visible !== "boolean") return NextResponse.json({ error: "Invalid visibility setting" }, { status: 400 })
  await updateProjectVisibility(projectId, body.visible)
  revalidatePath("/")
  revalidatePath("/projects/[slug]", "page")
  revalidatePath("/admin")
  return NextResponse.json({ message: "Project visibility updated" })
}
