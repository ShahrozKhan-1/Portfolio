import { NextResponse } from "next/server"

const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 8
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminCookieOptions,
  getAuthCredentials,
} from "@/lib/auth"

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const now = Date.now()
  const record = attempts.get(ip)
  if (record && record.resetAt > now && record.count >= MAX_ATTEMPTS) {
    return NextResponse.redirect(new URL("/admin/login?error=1&locked=1", request.url), 303)
  }
  const credentials = getAuthCredentials()
  if (!credentials.username || !credentials.password || !credentials.secret) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303)
  }

  const formData = await request.formData()
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "").trim()

  if (username !== credentials.username || password !== credentials.password) {
    const next = record && record.resetAt > now ? { count: record.count + 1, resetAt: record.resetAt } : { count: 1, resetAt: now + WINDOW_MS }
    attempts.set(ip, next)
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303)
  }

  attempts.delete(ip)

  const response = NextResponse.redirect(new URL("/admin", request.url), 303)
  response.cookies.set(getAdminCookieName(), createAdminSessionToken(), getAdminCookieOptions())
  return response
}
