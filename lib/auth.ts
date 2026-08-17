import "server-only"

import crypto from "crypto"
import { cookies } from "next/headers"

const SESSION_COOKIE = "portfolio_admin_session"
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7

function getAuthConfig() {
  return {
    username: process.env.ADMIN_USERNAME?.trim() || "",
    password: process.env.ADMIN_PASSWORD?.trim() || "",
    secret: process.env.ADMIN_SESSION_SECRET?.trim() || "",
  }
}

function sign(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex")
}

export function createAdminSessionToken() {
  const { username, secret } = getAuthConfig()

  if (!username || !secret) {
    throw new Error("Admin authentication is not configured.")
  }

  const issuedAt = Date.now().toString()
  const payload = `${username}.${issuedAt}`
  return `${payload}.${sign(payload, secret)}`
}

export function verifyAdminSessionToken(token: string | undefined | null) {
  const { username, secret } = getAuthConfig()

  if (!token || !username || !secret) {
    return false
  }

  const parts = token.split(".")
  if (parts.length !== 3) {
    return false
  }

  const [tokenUsername, issuedAt, signature] = parts
  if (tokenUsername !== username) {
    return false
  }

  const expectedSignature = sign(`${tokenUsername}.${issuedAt}`, secret)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return false
  }

  const issuedAtNumber = Number(issuedAt)
  if (!Number.isFinite(issuedAtNumber)) {
    return false
  }

  return Date.now() - issuedAtNumber <= SESSION_MAX_AGE_MS
}

export function getAdminSessionFromCookies() {
  return cookies().get(SESSION_COOKIE)?.value ?? null
}

export function isAdminAuthenticated() {
  return verifyAdminSessionToken(getAdminSessionFromCookies())
}

export function getAuthCredentials() {
  return getAuthConfig()
}

export function getAdminCookieName() {
  return SESSION_COOKIE
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  }
}

