import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/auth"
import { uploadPortfolioImage } from "@/lib/cloudinary"

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await request.formData()
  const files = formData.getAll("files").filter((value): value is File => value instanceof File)
  if (!files.length) return NextResponse.json({ error: "Choose at least one image file." }, { status: 400 })
  if (files.length > 12) return NextResponse.json({ error: "You can upload up to 12 images at a time." }, { status: 400 })

  const requestedFolder = formData.get("folder")
  const folder = requestedFolder === "profile" || requestedFolder === "testimonials" ? requestedFolder : "projects"
  const uploads: Array<{ secure_url: string; public_id: string; format: string }> = []

  try {
    for (const file of files) {
      const upload = await uploadPortfolioImage(file, folder)
      if (!upload.secure_url.startsWith("https://")) {
        return NextResponse.json({ error: "The image provider returned an insecure URL." }, { status: 502 })
      }
      uploads.push({ secure_url: upload.secure_url, public_id: upload.public_id, format: upload.format })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image upload failed."
    const status = message.startsWith("Cloudinary is not configured") || message.includes("supported") || message.includes("5 MB") ? 400 : 502
    return NextResponse.json({ error: message }, { status })
  }

  return NextResponse.json({ uploads, paths: uploads.map((upload) => upload.secure_url) })
}

