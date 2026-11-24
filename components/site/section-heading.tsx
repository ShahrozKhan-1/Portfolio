import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/site/reveal"

type SectionHeadingProps = {
  index: string
  label: string
  title: ReactNode
  description?: ReactNode
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({
  index,
  label,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "flex flex-col items-center text-center", className)}>
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.6875rem] uppercase tracking-label text-primary">
            {index}
          </span>
          <span className="h-px w-8 bg-white/20" />
          <span className="eyebrow">{label}</span>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 className="mt-6 font-display text-display-sm text-foreground">{title}</h2>
      </Reveal>

      {description ? (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "mt-6 max-w-xl text-[0.975rem] leading-[1.75] text-muted-foreground",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  )
}
