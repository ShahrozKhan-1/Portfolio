import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth"
import { deleteSkill } from "@/lib/site-data"

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
    return NextResponse.json({ error: "Invalid skill id." }, { status: 400 })
  }

  await deleteSkill(numericId)
  revalidatePath("/")
  revalidatePath("/admin")

  return NextResponse.json({ message: "Skill deleted successfully." })
}
