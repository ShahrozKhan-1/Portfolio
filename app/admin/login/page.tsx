import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admin sign in",
  alternates: { canonical: "/admin/login" },
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: {
    error?: string
  }
}) {
  const error = searchParams?.error

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-3xl border border-white/[0.09] bg-ink/70 p-7 shadow-[0_50px_140px_-50px_rgba(0,0,0,1)] backdrop-blur-xl sm:p-9">
        <div className="mb-8">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <p className="font-mono text-[0.6rem] uppercase tracking-label text-primary">Admin</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-white">
            Portfolio control panel
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Sign in with the single admin account configured in your environment variables.
          </p>
        </div>

        {error ? (
          <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-[0.8rem] leading-relaxed text-red-300">
            Invalid credentials or missing admin environment variables.
          </div>
        ) : null}

        <form action="/api/admin/login" method="post" className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="font-mono text-[0.6rem] uppercase tracking-label text-white/60"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              required
              placeholder="Admin username"
              className="field"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="font-mono text-[0.6rem] uppercase tracking-label text-white/60"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Admin password"
              className="field"
            />
          </div>
          <Button type="submit" className="btn-signal h-12 w-full">
            Sign in
          </Button>
        </form>

        <div className="mt-6 border-t border-white/[0.08] pt-5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-label text-white/60 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}
