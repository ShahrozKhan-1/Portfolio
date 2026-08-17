import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth"
import { createReview, parseOrderIndex } from "@/lib/site-data"

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const name = String(formData.get("name") ?? "").trim()
  const role = String(formData.get("role") ?? "").trim()
  const content = String(formData.get("content") ?? "").trim()
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim()
  const rating = Math.min(5, Math.max(1, Number(formData.get("rating") ?? 5) || 5))
  const orderIndex = parseOrderIndex(formData.get("orderIndex"), 0)

  if (!name || !role || !content || !avatarUrl) {
    return NextResponse.json({ error: "Please fill in all review fields." }, { status: 400 })
  }

  await createReview({ name, role, content, avatarUrl, rating, orderIndex })
  revalidatePath("/")
  revalidatePath("/admin")

  return NextResponse.json({ message: "Review added successfully." })
}

