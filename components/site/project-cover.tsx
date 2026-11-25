import { cn } from "@/lib/utils"
import type { Project } from "@/lib/site-types"

const TINTS = [
  "from-[#2B1F60] via-[#15112B] to-[#0A0A14]",
  "from-[#0C3F42] via-[#0A1B22] to-[#0A0E16]",
  "from-[#3D1334] via-[#1B0D1F] to-[#0B0D16]",
  "from-[#2E3612] via-[#161A0D] to-[#0A0F14]",
]

const GLOWS = [
  "bg-[radial-gradient(circle,rgba(140,124,255,0.55),transparent_62%)]",
  "bg-[radial-gradient(circle,rgba(91,231,210,0.45),transparent_62%)]",
  "bg-[radial-gradient(circle,rgba(255,122,182,0.45),transparent_62%)]",
  "bg-[radial-gradient(circle,rgba(200,250,79,0.42),transparent_62%)]",
]

const NODES = [
  { x: 54, y: 74, r: 4 },
  { x: 132, y: 46, r: 3 },
  { x: 148, y: 128, r: 5 },
  { x: 228, y: 72, r: 3 },
  { x: 250, y: 168, r: 4 },
  { x: 322, y: 116, r: 5 },
  { x: 348, y: 214, r: 3 },
  { x: 196, y: 224, r: 3 },
  { x: 88, y: 196, r: 4 },
]

const EDGES = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 5],
  [4, 7],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 0],
  [2, 8],
]

export function ProjectCover({
  project,
  index,
  variant = "preview",
}: {
  project: Project
  index: number
  variant?: "preview" | "compact"
}) {
  const isPlaceholder = !project.imageUrl || project.imageUrl.includes("placeholder")

  if (!isPlaceholder) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.imageUrl}
        alt={`${project.title} preview`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    )
  }

  const compact = variant === "compact"
  const tint = TINTS[index % TINTS.length]
  const glow = GLOWS[index % GLOWS.length]
  const tags = project.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-gradient-to-br", tint)}>
      <div aria-hidden="true" className={cn("absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl", glow)} />
      <div aria-hidden="true" className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.10),transparent_65%)] blur-3xl" />
      <div aria-hidden="true" className="absolute inset-0 grid-bg opacity-[0.4]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(120deg,transparent_35%,rgba(255,255,255,0.055)_48%,transparent_62%)]"
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 400 280"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {EDGES.map(([from, to]) => {
          const a = NODES[from]
          const b = NODES[to]
          return (
            <line
              key={`${from}-${to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.9"
              strokeDasharray="3 5"
            />
          )
        })}
        {NODES.map((node, nodeIndex) => (
          <g key={nodeIndex}>
            {nodeIndex % 4 === 0 ? (
              <circle cx={node.x} cy={node.y} r={node.r * 3} fill="rgba(200,250,79,0.16)" />
            ) : null}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={nodeIndex % 4 === 0 ? "#C8FA4F" : "rgba(255,255,255,0.72)"}
            />
          </g>
        ))}
      </svg>

      <span
        aria-hidden="true"
        className={cn(
          "absolute right-2 font-display leading-none text-stroke opacity-30",
          compact ? "bottom-12 text-[4rem]" : "bottom-14 text-[clamp(4rem,7vw,6rem)]",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div
        className={cn(
          "relative flex h-full flex-col justify-between",
          compact ? "p-4" : "p-5 sm:p-6",
        )}
      >
        <div className="flex items-center justify-between font-mono text-[0.55rem] uppercase tracking-label text-white/60">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-primary" />
            Case study
          </span>
          {!compact ? <span>{String(index + 1).padStart(2, "0")}</span> : null}
        </div>

        <div className="max-w-[85%]">
          {!compact ? (
            <p className="font-display text-[clamp(1.25rem,2.2vw,1.6rem)] leading-tight tracking-tight text-white/95">
              {project.title}
            </p>
          ) : null}
          <p
            className={cn(
              "font-mono text-[0.55rem] uppercase leading-relaxed tracking-[0.14em] text-white/55",
              !compact && "mt-2",
            )}
          >
            {tags.slice(0, 3).join(" · ")}
          </p>
        </div>
      </div>
    </div>
  )
}
