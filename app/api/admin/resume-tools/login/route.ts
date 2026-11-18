import { createHash, timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import {
  createResumeToolsSession,
  RESUME_TOOLS_COOKIE,
  resumeToolsCookieOptions,
  resumeToolsEnabled,
} from "@/lib/resume-tools-auth"
import { getRequestClientKey } from "@/lib/resume-tools-rate-limit"

const MAX_REQUEST_BYTES = 2_048
const FAILURE_WINDOW_MS = 15 * 60 * 1000
const MAX_FAILURES = 5
const failuresByIp = new Map<string, { count: number; resetAt: number }>()

function jsonResponse(body: object, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  })
}

function passwordsMatch(candidate: string, expected: string) {
  const candidateHash = createHash("sha256").update(candidate).digest()
  const expectedHash = createHash("sha256").update(expected).digest()
  return timingSafeEqual(candidateHash, expectedHash)
}

export async function POST(request: NextRequest) {
  if (!resumeToolsEnabled()) return jsonResponse({ error: "Not found." }, 404)

  const origin = request.headers.get("origin")
  if (!origin || origin !== new URL(request.url).origin) {
    return jsonResponse({ error: "Invalid request origin." }, 403)
  }

  const clientKey = getRequestClientKey(request)
  const expected = process.env.ADMIN_SECRET ?? ""
  if (expected.length < 32 || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    return jsonResponse({ error: "Resume tools are not configured." }, 503)
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ error: "Invalid request." }, 415)
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (contentLength > MAX_REQUEST_BYTES) return jsonResponse({ error: "The request is too large." }, 413)

  let body: unknown
  try {
    const reader = request.body?.getReader()
    if (!reader) return jsonResponse({ error: "Invalid request." }, 400)
    const decoder = new TextDecoder()
    const chunks: string[] = []
    let totalBytes = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      totalBytes += value.byteLength
      if (totalBytes > MAX_REQUEST_BYTES) {
        await reader.cancel()
        return jsonResponse({ error: "The request is too large." }, 413)
      }
      chunks.push(decoder.decode(value, { stream: true }))
    }
    chunks.push(decoder.decode())
    body = JSON.parse(chunks.join(""))
  } catch {
    return jsonResponse({ error: "Invalid request." }, 400)
  }

  const candidate = typeof body === "object" && body !== null && "password" in body
    ? (body as { password?: unknown }).password
    : undefined
  if (typeof candidate !== "string" || candidate.length === 0 || candidate.length > 1024) {
    return jsonResponse({ error: "Invalid request." }, 400)
  }

  const now = Date.now()
  const existing = failuresByIp.get(clientKey)
  const current = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + FAILURE_WINDOW_MS }
  if (current.count >= MAX_FAILURES) {
    return jsonResponse({ error: "Too many attempts. Try again in 15 minutes." }, 429)
  }

  const isValid = passwordsMatch(candidate, expected)
  if (!isValid) {
    // This in-memory throttle resets on cold starts and is best-effort across serverless instances.
    if (failuresByIp.size >= 10_000) failuresByIp.delete(failuresByIp.keys().next().value ?? clientKey)
    failuresByIp.set(clientKey, { count: current.count + 1, resetAt: current.resetAt })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return jsonResponse({ error: "The password could not be verified." }, 401)
  }

  failuresByIp.delete(clientKey)

  try {
    const token = await createResumeToolsSession()
    const response = jsonResponse({ ok: true }, 200)
    response.cookies.set(RESUME_TOOLS_COOKIE, token, resumeToolsCookieOptions())
    return response
  } catch {
    return jsonResponse({ error: "Resume tools are not configured." }, 503)
  }
}
