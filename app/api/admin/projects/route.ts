import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth"
import { createProject, parseOrderIndex } from "@/lib/site-data"

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const title = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const tags = String(formData.get("tags") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim()
  const linkUrl = String(formData.get("linkUrl") ?? "").trim()
  const orderIndex = parseOrderIndex(formData.get("orderIndex"), 0)

  if (!title || !description || !tags || !imageUrl) {
    return NextResponse.json({ error: "Please fill in all project fields." }, { status: 400 })
  }

  await createProject({ title, description, tags, imageUrl, linkUrl, orderIndex })
  revalidatePath("/")
  revalidatePath("/admin")

  return NextResponse.json({ message: "Project added successfully." })
}

