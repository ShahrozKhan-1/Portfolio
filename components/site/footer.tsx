import Link from "next/link"
import { ArrowUp, ArrowUpRight, FileText, Github, Linkedin, Mail } from "lucide-react"
import { Marquee } from "@/components/site/marquee"
import { LocalTime } from "@/components/site/local-time"
import type { Profile } from "@/lib/site-types"

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#projects" },
  { label: "Contact", href: "#contact" },
]

export function SiteFooter({ profile, basePath = "" }: { profile: Profile; basePath?: string }) {
  return (
    <footer className="relative mt-8 border-t border-white/[0.08] bg-ink/40">
      <div className="relative overflow-hidden border-b border-white/[0.08] py-5">
        <Marquee duration={52} pauseOnHover={false}>
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className="flex items-center">
              <span className="px-5 font-display text-[clamp(2.2rem,6.5vw,4.5rem)] uppercase leading-none tracking-tightest text-stroke">
                Shahroz Khan
              </span>
              <span className="px-2 text-[clamp(1.4rem,3vw,2.2rem)] text-primary/70">✳</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="shell grid gap-10 py-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Link href="/" className="inline-flex min-h-10 items-center gap-2.5 rounded-full">
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-full bg-primary font-display text-[12px] font-bold text-primary-foreground"
            >
              SK
            </span>
            <span className="font-display text-base tracking-tight text-white/90">
              Shahroz Khan
            </span>
            <span className="sr-only">home</span>
          </Link>
          <p className="mt-5 max-w-sm text-[0.9rem] leading-relaxed text-white/55">
            Python backend developer building reliable APIs, data pipelines and automation systems
            from Lahore, Pakistan.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.09] px-3 py-1.5">
            <span aria-hidden="true" className="availability-dot h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-mono text-[0.6rem] uppercase tracking-label text-white/60">
              Available for new projects
            </span>
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="font-mono text-[0.55rem] uppercase tracking-label text-white/60">Sitemap</p>
          <ul className="mt-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={`${basePath}${link.href}`}
                  className="link-underline inline-flex min-h-11 items-center text-[0.85rem] text-white/65 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="font-mono text-[0.55rem] uppercase tracking-label text-white/60">Elsewhere</p>
          <ul className="mt-3 space-y-1">
            {[
              { label: "GitHub", href: profile.githubUrl, icon: Github, external: true },
              { label: "LinkedIn", href: profile.linkedinUrl, icon: Linkedin, external: true },
              { label: "Email", href: `mailto:${profile.email}`, icon: Mail, external: false },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="group inline-flex min-h-11 items-center gap-2 text-[0.85rem] text-white/65 transition-colors hover:text-white"
                >
                  <item.icon aria-hidden="true" className="h-3.5 w-3.5 text-white/60 transition-colors group-hover:text-primary" />
                  {item.label}
                  {item.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/resume"
                className="group inline-flex min-h-11 items-center gap-2 text-[0.85rem] text-white/65 transition-colors hover:text-white"
              >
                <FileText aria-hidden="true" className="h-3.5 w-3.5 text-white/60 transition-colors group-hover:text-primary" />
                Résumé
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="font-mono text-[0.55rem] uppercase tracking-label text-white/60">Direct</p>
          <a
            href={`mailto:${profile.email}`}
            className="group mt-4 flex items-start justify-between gap-3 rounded-xl border border-white/[0.08] p-3.5 transition-colors hover:border-primary/30 hover:bg-white/[0.03]"
          >
            <span className="min-w-0">
              <span className="block truncate text-[0.82rem] text-white/80">{profile.email}</span>
              <span className="mt-1 block font-mono text-[0.55rem] uppercase tracking-label text-white/60">
                Usually replies in a day
              </span>
              <span className="sr-only"> (opens your email app)</span>
            </span>
            <ArrowUpRight aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </a>
          <p className="mt-5 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-label text-white/60">
            <LocalTime /> · Lahore
          </p>
        </div>
      </div>

      <div className="shell flex flex-col items-start justify-between gap-4 border-t border-white/[0.08] py-6 sm:flex-row sm:items-center">
        <p className="font-mono text-[0.6rem] uppercase tracking-label text-white/60">
          © 2026 Shahroz Khan. All rights reserved
        </p>
        <p className="font-mono text-[0.6rem] uppercase tracking-label text-white/60">
          Next.js · Tailwind · Framer Motion · WebGL
        </p>
        <Link
          href={basePath ? "#content" : "#home"}
          className="group inline-flex min-h-10 items-center gap-2 font-mono text-[0.6rem] uppercase tracking-label text-white/60 transition-colors hover:text-primary"
        >
          Back to top
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 transition-colors group-hover:border-primary/50">
            <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </footer>
  )
}
