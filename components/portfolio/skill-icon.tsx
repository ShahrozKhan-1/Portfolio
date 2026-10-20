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

export function hasBrandSkillIcon(skill: Skill): boolean {
  const normalizedName = skill.name.trim().toLowerCase()
  const normalizedKey = skill.iconKey.trim().toLowerCase()
  return Boolean(brandSkillIcons[normalizedName] ?? brandSkillIcons[normalizedKey])
}

export function SkillIcon({ skill }: { skill: Skill }) {
  const normalizedName = skill.name.trim().toLowerCase()
  const normalizedKey = skill.iconKey.trim().toLowerCase()
  const brandIcon = brandSkillIcons[normalizedName] ?? brandSkillIcons[normalizedKey]

  if (brandIcon) {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        role="img"
        viewBox="0 0 24 24"
        className="h-8 w-8"
        style={{ color: `#${brandIcon.hex}` }}
      >
        <path fill="currentColor" d={brandIcon.path} />
      </svg>
    )
  }

  return fallbackSkillIcons[normalizedKey] ?? (
    <Code className="h-8 w-8" />
  )
}
