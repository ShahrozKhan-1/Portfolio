import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth"
import { createSkill, parseOrderIndex } from "@/lib/site-data"

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

  await createSkill({ name, category, description, iconKey, accent, orderIndex })
  revalidatePath("/")
  revalidatePath("/admin")

  return NextResponse.json({ message: "Skill added successfully." })
}

