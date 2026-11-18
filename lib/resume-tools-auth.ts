import "server-only"

import { SignJWT, jwtVerify } from "jose"

export const RESUME_TOOLS_COOKIE = "resume_tools_session"
const SESSION_ISSUER = "portfolio-resume-tools"
const SESSION_AUDIENCE = "resume-tools"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12

function getSessionKey() {
  const secret = process.env.SESSION_SECRET
  return secret ? new TextEncoder().encode(secret) : null
}

export async function createResumeToolsSession() {
  const key = getSessionKey()
  if (!key) throw new Error("Session configuration is unavailable.")

  return new SignJWT({ scope: SESSION_AUDIENCE })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setSubject("owner")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(key)
}

export async function verifyResumeToolsSession(token: string | null | undefined) {
  const key = getSessionKey()
  if (!token || !key) return false

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    })
    return payload.sub === "owner" && payload.scope === SESSION_AUDIENCE
  } catch {
    return false
  }
}

export function resumeToolsCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  }
}

export function resumeToolsEnabled() {
  return process.env.ENABLE_RESUME_TOOLS === "true"
}
