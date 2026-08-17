import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth"
import { normalizeProfileInput, updateProfile } from "@/lib/site-data"

export async function PUT(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const profile = normalizeProfileInput({
    name: String(formData.get("name") ?? ""),
    role: String(formData.get("role") ?? ""),
    headline: String(formData.get("headline") ?? ""),
    about: String(formData.get("about") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    email: String(formData.get("email") ?? ""),
    location: String(formData.get("location") ?? ""),
    githubUrl: String(formData.get("githubUrl") ?? ""),
    linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
  })

  await updateProfile(profile)
  revalidatePath("/")
  revalidatePath("/admin")

  return NextResponse.json({ message: "Profile updated successfully." })
}

