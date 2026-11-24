import {
  siDocker,
  siDjango,
  siFastapi,
  siN8n,
  siPostgresql,
  siPython,
  siRedis,
  siSelenium,
  siZapier,
} from "simple-icons"
import {
  Code,
  Database,
  FigmaIcon,
  Server,
  Smartphone,
  Terminal,
  Zap,
} from "lucide-react"
import type { ReactNode } from "react"
import type { Skill } from "@/lib/site-types"
import { cn } from "@/lib/utils"

type BrandIcon = {
  path: string
  hex: string
}

const brandSkillIcons: Record<string, BrandIcon> = {
  python: siPython,
  django: siDjango,
  fastapi: siFastapi,
  postgresql: siPostgresql,
  selenium: siSelenium,
  docker: siDocker,
  redis: siRedis,
  automation: siZapier,
  zapier: siZapier,
  n8n: siN8n,
}

const fallbackSkillIcons: Record<string, ReactNode> = {
  code: <Code className="h-8 w-8" />,
  database: <Database className="h-8 w-8" />,
  figma: <FigmaIcon className="h-8 w-8" />,
  server: <Server className="h-8 w-8" />,
  smartphone: <Smartphone className="h-8 w-8" />,
  terminal: <Terminal className="h-8 w-8" />,
  zap: <Zap className="h-8 w-8" />,
} as const

function resolveBrandIcon(skill: Skill): BrandIcon | undefined {
  const normalizedName = skill.name.trim().toLowerCase()
  const normalizedKey = skill.iconKey.trim().toLowerCase()
  return brandSkillIcons[normalizedName] ?? brandSkillIcons[normalizedKey]
}

// A few brand marks ship with very dark colours that disappear on an ink canvas.
const BRAND_COLOR_OVERRIDES: Record<string, string> = {
  django: "#44B78B",
}

function resolveBrandColor(skill: Skill, icon: BrandIcon): string {
  return BRAND_COLOR_OVERRIDES[skill.name.trim().toLowerCase()] ?? `#${icon.hex}`
}

export function getSkillBrandColor(skill: Skill): string | null {
  const icon = resolveBrandIcon(skill)
  return icon ? resolveBrandColor(skill, icon) : null
}

export function SkillIcon({
  skill,
  className,
  glow = false,
}: {
  skill: Skill
  className?: string
  glow?: boolean
}) {
  const brandIcon = resolveBrandIcon(skill)

  if (brandIcon) {
    const color = resolveBrandColor(skill, brandIcon)
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        role="img"
        viewBox="0 0 24 24"
        className={cn("h-8 w-8", className)}
        style={{
          color,
          filter: glow
            ? `drop-shadow(0 0 10px ${color}88) brightness(1.28) saturate(1.08)`
            : undefined,
        }}
      >
        <path fill="currentColor" d={brandIcon.path} />
      </svg>
    )
  }

  const normalizedKey = skill.iconKey.trim().toLowerCase()

  return (
    <span className={cn("inline-flex text-white/80", className)}>
      {fallbackSkillIcons[normalizedKey] ?? <Code className="h-8 w-8" />}
    </span>
  )
}
