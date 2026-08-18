import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth"
import { deleteSkill, parseOrderIndex, updateSkill } from "@/lib/site-data"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params
  const numericId = Number(id)
  if (!Number.isFinite(numericId)) {
    return NextResponse.json({ error: "Invalid skill id." }, { status: 400 })
  }

  const formData = await request.formData()
  const name = String(formData.get("name") ?? "").trim()
  const category = String(formData.get("category") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const iconKey = String(formData.get("iconKey") ?? "").trim() || "code"
  const accent = String(formData.get("accent") ?? "").trim() || "from-blue-500 to-cyan-500"
  const orderIndex = parseOrderIndex(formData.get("orderIndex"), 0)

  if (!name || !category || !description) {
    return NextResponse.json({ error: "Please fill in all skill fields." }, { status: 400 })
  }

  await updateSkill(numericId, { name, category, description, iconKey, accent, orderIndex })
  revalidatePath("/")
  revalidatePath("/admin")

  return NextResponse.json({ message: "Skill updated successfully." })
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params
  const numericId = Number(id)
  if (!Number.isFinite(numericId)) {
    return NextResponse.json({ error: "Invalid skill id." }, { status: 400 })
  }

  await deleteSkill(numericId)
  revalidatePath("/")
  revalidatePath("/admin")

  return NextResponse.json({ message: "Skill deleted successfully." })
}
