import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

const contentTypes: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" }

export async function GET(_request: Request, { params }: { params: { filename: string } }) {
  const filename = path.basename(params.filename)
  const extension = path.extname(filename).slice(1).toLowerCase()
  if (!contentTypes[extension]) return new NextResponse("Not found", { status: 404 })

  try {
    const file = await readFile(path.join(process.cwd(), "data", "images", filename))
    return new NextResponse(file, { headers: { "Content-Type": contentTypes[extension], "Cache-Control": "public, max-age=31536000, immutable" } })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}
