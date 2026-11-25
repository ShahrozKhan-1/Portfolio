import { AuroraCanvas } from "@/components/site/aurora-canvas"
import { PointerGlow } from "@/components/site/pointer-glow"

/**
 * Fixed, full-viewport atmosphere: shader aurora, technical grid, film grain
 * and vignette. Purely decorative and never intercepts pointer events.
 */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink print:hidden">
      {/* Deep base wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_50%_-8%,rgba(124,92,255,0.16),transparent_72%)]" />

      {/* Layered CSS aurora: instant fallback and colour body behind the shader */}
      <div className="aurora-fallback absolute -inset-[18%] opacity-90 [mix-blend-mode:screen]">
        <div className="absolute -left-[8%] top-[-16%] h-[80vh] w-[72vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,92,255,0.30),transparent_60%)] blur-[120px]" />
        <div className="aurora-fallback absolute right-[-14%] top-[16%] h-[62vh] w-[58vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(47,211,192,0.16),transparent_62%)] blur-[120px] [animation-delay:-9s]" />
        <div className="aurora-fallback absolute bottom-[-14%] left-[14%] h-[58vh] w-[62vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,250,79,0.10),transparent_64%)] blur-[120px] [animation-delay:-18s]" />
      </div>

      <AuroraCanvas />

      {/* Technical grid, faded away from the top */}
      <div className="absolute inset-0 grid-bg opacity-[0.55] [mask-image:radial-gradient(ellipse_95%_65%_at_50%_0%,black,transparent_82%)]" />

      {/* A single soft light beam */}
      <div className="absolute -top-1/3 left-1/2 h-[70vh] w-[75vw] -translate-x-1/2 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0deg,rgba(200,250,79,0.05)_90deg,transparent_180deg)] opacity-60 blur-3xl" />

      {/* Edge vignette + lower fade so content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_35%,rgba(7,7,10,0.55)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[38vh] bg-gradient-to-t from-ink/95 via-ink/50 to-transparent" />

      {/* Film grain */}
      <div className="absolute inset-0 grain opacity-[0.07] [mix-blend-mode:overlay]" />

      <PointerGlow />
    </div>
  )
}
