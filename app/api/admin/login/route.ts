import { NextResponse } from "next/server"
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminCookieOptions,
  getAuthCredentials,
} from "@/lib/auth"

export async function POST(request: Request) {
  const credentials = getAuthCredentials()
  if (!credentials.username || !credentials.password || !credentials.secret) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303)
  }

  const formData = await request.formData()
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "").trim()

  if (username !== credentials.username || password !== credentials.password) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303)
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), 303)
  response.cookies.set(getAdminCookieName(), createAdminSessionToken(), getAdminCookieOptions())
  return response
}
