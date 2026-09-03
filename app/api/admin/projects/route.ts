import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth"
import { createProject, parseOrderIndex } from "@/lib/site-data"
import { getTextField, validateProjectFields } from "@/lib/project-validation"

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
  const description = getTextField(formData, "description")
  const tags = getTextField(formData, "tags")
  const imageUrl = getTextField(formData, "imageUrl")
  const linkUrl = getTextField(formData, "linkUrl")
  const orderIndex = parseOrderIndex(formData.get("orderIndex"), 0)

  const validationError = validateProjectFields({ title, description, tags, imageUrl, linkUrl })
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  try {
    await createProject({ title, description, tags, imageUrl, linkUrl, orderIndex })
    revalidatePath("/")
    revalidatePath("/admin")
  } catch (error) {
    console.error("Unable to create portfolio project", error)
    return NextResponse.json(
      { error: "The project could not be saved. Please try again, or contact the site administrator if the problem continues." },
      { status: 500 },
    )
  }

  return NextResponse.json({ message: "Project added successfully." })
}
