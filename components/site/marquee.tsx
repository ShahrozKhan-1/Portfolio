import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

type MarqueeProps = {
  children: ReactNode
  duration?: number
  reverse?: boolean
  pauseOnHover?: boolean
  className?: string
}

export function Marquee({
  children,
  duration = 38,
  reverse = false,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn("relative overflow-hidden", pauseOnHover && "marquee-paused", className)}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div className={cn("marquee", reverse ? "animate-marquee-reverse" : "animate-marquee")}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
