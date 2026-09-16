import { NextResponse } from "next/server"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"
import { isAdminAuthenticated } from "@/lib/auth"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
])

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await request.formData()
  const files = formData.getAll("files").filter((value): value is File => value instanceof File)
  if (!files.length) return NextResponse.json({ error: "Choose at least one image file." }, { status: 400 })
  if (files.length > 12) return NextResponse.json({ error: "You can upload up to 12 images at a time." }, { status: 400 })

  const imageDirectory = path.join(process.cwd(), "data", "images")
  await mkdir(imageDirectory, { recursive: true })
  const paths: string[] = []

  for (const file of files) {
    const extension = allowedTypes.get(file.type)
    if (!extension) return NextResponse.json({ error: "Only JPG, PNG, WebP, and GIF images are supported." }, { status: 400 })
    if (file.size === 0 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Each image must be smaller than 5 MB." }, { status: 400 })

    const filename = `${Date.now()}-${randomUUID()}${extension}`
    await writeFile(path.join(imageDirectory, filename), Buffer.from(await file.arrayBuffer()))
    paths.push(`/api/images/${filename}`)
  }

  return NextResponse.json({ paths })
}

