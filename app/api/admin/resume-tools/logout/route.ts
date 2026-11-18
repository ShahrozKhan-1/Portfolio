import { NextRequest, NextResponse } from "next/server"
import {
  RESUME_TOOLS_COOKIE,
  resumeToolsCookieOptions,
  resumeToolsEnabled,
} from "@/lib/resume-tools-auth"

export async function POST(request: NextRequest) {
  if (!resumeToolsEnabled()) return NextResponse.json({ error: "Not found." }, { status: 404 })

  const origin = request.headers.get("origin")
  if (!origin || origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(RESUME_TOOLS_COOKIE, "", { ...resumeToolsCookieOptions(), maxAge: 0 })
  return response
}
