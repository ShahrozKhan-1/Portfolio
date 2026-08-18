import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth"
import { deleteReview, parseOrderIndex, updateReview } from "@/lib/site-data"

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
    return NextResponse.json({ error: "Invalid review id." }, { status: 400 })
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

  await updateReview(numericId, { name, role, content, avatarUrl, rating, orderIndex })
  revalidatePath("/")
  revalidatePath("/admin")

  return NextResponse.json({ message: "Review updated successfully." })
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
    return NextResponse.json({ error: "Invalid review id." }, { status: 400 })
  }

  await deleteReview(numericId)
  revalidatePath("/")
  revalidatePath("/admin")

  return NextResponse.json({ message: "Review deleted successfully." })
}
