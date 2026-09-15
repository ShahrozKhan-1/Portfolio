import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth"
import { createProject, parseOrderIndex, SiteDataStorageError } from "@/lib/site-data"
import { getTextField, validateProjectFields } from "@/lib/project-validation"
import type { ProjectFields } from "@/lib/project-validation"

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "Project data could not be read. Please submit the form again." }, { status: 400 })
  }

  const title = getTextField(formData, "title")
  const slug = getTextField(formData, "slug") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const description = getTextField(formData, "description")
  const longDescription = getTextField(formData, "longDescription")
  const tags = getTextField(formData, "tags")
  const imageUrl = getTextField(formData, "imageUrl")
  const linkUrl = getTextField(formData, "linkUrl")
  const liveUrl = getTextField(formData, "liveUrl")
  const repoUrl = getTextField(formData, "repoUrl")
  const status = (getTextField(formData, "status") || "completed") as ProjectFields["status"]
  const startDate = getTextField(formData, "startDate")
  const endDate = getTextField(formData, "endDate")
  const split = (name: string) => getTextField(formData, name).split(/[,\n]/).map((item) => item.trim()).filter(Boolean)
  const orderIndex = parseOrderIndex(formData.get("orderIndex"), 0)

  const validationError = validateProjectFields({ title, slug, description, longDescription, tags, imageUrl, linkUrl, liveUrl, repoUrl, status, startDate, endDate })
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  try {
    await createProject({ title, slug, description, longDescription, problem: getTextField(formData, "problem"), solution: getTextField(formData, "solution"), role: getTextField(formData, "role"), contributions: split("contributions"), features: split("features"), challenges: split("challenges"), results: split("results"), techStack: split("techStack"), tags, imageUrl, gallery: split("gallery").map((url) => ({ url, alt: title })), linkUrl, liveUrl, repoUrl, status, startDate, endDate, orderIndex })
    revalidatePath("/")
    revalidatePath("/admin")
  } catch (error) {
    console.error("Unable to create portfolio project", error)
    return NextResponse.json(
      {
        error:
          error instanceof SiteDataStorageError
            ? error.message
            : "The project could not be saved. Please try again, or contact the site administrator if the problem continues.",
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ message: "Project added successfully." })
}
