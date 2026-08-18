import Link from "next/link"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export const dynamic = "force-dynamic"

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: {
    error?: string
  }
}) {
  const error = searchParams?.error

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10 text-slate-950 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-white">
      <Card className="w-full max-w-md border border-slate-200/70 bg-white/90 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <CardContent className="p-6 md:p-8">
          <div className="mb-8">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20">
              <Lock className="h-5 w-5" />
            </div>
            <p className="text-sm uppercase tracking-[0.25em] text-purple-600 dark:text-purple-300">Admin Login</p>
            <h1 className="mt-2 text-3xl font-bold">Portfolio control panel</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Sign in with the single admin account configured in your environment variables.
            </p>
          </div>

          {error ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-100">
              Invalid credentials or missing admin environment variables.
            </div>
          ) : null}

          <form action="/api/admin/login" method="post" className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input id="username" name="username" autoComplete="username" required placeholder="Admin username" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Admin password"
              />
            </div>
            <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            <Link href="/" className="text-purple-600 hover:underline dark:text-purple-300">
              Back to portfolio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

