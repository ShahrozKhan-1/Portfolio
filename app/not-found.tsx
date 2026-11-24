import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

export const metadata = {
  title: "Page not found",
}

export default function NotFound() {
  return (
    <main
      id="content"
      className="relative flex min-h-screen flex-col items-center justify-center px-5 py-24 text-center"
    >
      <span className="eyebrow text-primary">Error 404</span>

      <p
        aria-hidden="true"
        className="mt-6 font-display text-[clamp(6rem,26vw,16rem)] leading-none tracking-tightest text-stroke"
      >
        404
      </p>

      <h1 className="mt-4 font-display text-display-xs text-white">
        This route was never <span className="font-serif italic text-primary">deployed.</span>
      </h1>
      <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/45">
        The page you&apos;re looking for doesn&apos;t exist, moved, or is still sitting in a
        feature branch.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-signal group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to portfolio
        </Link>
        <Link href="/#projects" className="btn-ghost group">
          See selected work
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  )
}
