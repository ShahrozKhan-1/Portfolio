import { createHash, timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import {
  createResumeToolsSession,
  RESUME_TOOLS_COOKIE,
  resumeToolsCookieOptions,
  resumeToolsEnabled,
} from "@/lib/resume-tools-auth"

const FAILURE_WINDOW_MS = 15 * 60 * 1000
const MAX_FAILURES = 5
const failuresByIp = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: NextRequest) {
  return request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown"
}

function passwordsMatch(candidate: string, expected: string) {
  const candidateHash = createHash("sha256").update(candidate).digest()
  const expectedHash = createHash("sha256").update(expected).digest()
  return timingSafeEqual(candidateHash, expectedHash)
}

export async function POST(request: NextRequest) {
  if (!resumeToolsEnabled()) return NextResponse.json({ error: "Not found." }, { status: 404 })

  const origin = request.headers.get("origin")
  if (!origin || origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const candidate = typeof body === "object" && body !== null && "password" in body
    ? (body as { password?: unknown }).password
    : undefined
  if (typeof candidate !== "string" || candidate.length > 1024) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const ip = getClientIp(request)
  const now = Date.now()
  const existing = failuresByIp.get(ip)
  const current = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + FAILURE_WINDOW_MS }

  if (current.count >= MAX_FAILURES) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 })
  }

  const expected = process.env.ADMIN_SECRET ?? ""
  const isConfigured = expected.length > 0 && Boolean(process.env.SESSION_SECRET)
  const isValid = passwordsMatch(candidate, expected) && isConfigured

  if (!isValid) {
    // This in-memory throttle resets on cold starts and is best-effort across serverless instances.
    failuresByIp.set(ip, { count: current.count + 1, resetAt: current.resetAt })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return NextResponse.json({ error: "The password could not be verified." }, { status: 401 })
  }

  failuresByIp.delete(ip)

  try {
    const token = await createResumeToolsSession()
    const response = NextResponse.json({ ok: true })
    response.cookies.set(RESUME_TOOLS_COOKIE, token, resumeToolsCookieOptions())
    return response
  } catch {
    return NextResponse.json({ error: "Resume tools are not configured." }, { status: 500 })
  }
}
