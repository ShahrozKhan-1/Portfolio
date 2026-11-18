import { z } from "zod"
import { NextRequest, NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/auth"
import { isResumeDownloadEnabled, setResumeDownloadEnabled } from "@/lib/resume-download-setting"

export const dynamic = "force-dynamic"

function jsonResponse(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  })
}

export async function GET() {
  return jsonResponse({ enabled: isResumeDownloadEnabled() })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin")
  if (!origin || origin !== new URL(request.url).origin) {
    return jsonResponse({ error: "Invalid request origin." }, 403)
  }

  if (!isAdminAuthenticated()) return jsonResponse({ error: "Unauthorized." }, 401)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: "Invalid request body." }, 400)
  }

  const parsed = z.object({ enabled: z.boolean() }).strict().safeParse(body)
  if (!parsed.success) return jsonResponse({ error: "Invalid request." }, 400)

  setResumeDownloadEnabled(parsed.data.enabled)
  return jsonResponse({ enabled: parsed.data.enabled })
}
