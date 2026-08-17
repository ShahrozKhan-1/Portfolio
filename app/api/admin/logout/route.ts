import { NextResponse } from "next/server"
import { getAdminCookieName, getAdminCookieOptions } from "@/lib/auth"

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url), 303)
  response.cookies.set(getAdminCookieName(), "", {
    ...getAdminCookieOptions(),
    maxAge: 0,
  })
  return response
}
