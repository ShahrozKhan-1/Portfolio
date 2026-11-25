import { Reveal } from "@/components/site/reveal"

export function Statement() {
  return (
    <section aria-label="Philosophy" className="relative border-y border-white/[0.07] py-16 sm:py-24">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-16">
          <Reveal>
            <span className="font-mono text-[0.6rem] uppercase tracking-label text-white/55">
              On craft
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-4xl font-display text-[clamp(1.6rem,3.6vw,2.9rem)] leading-[1.25] tracking-tight text-white/85">
              Good backends are{" "}
              <span className="font-serif italic text-primary">quiet.</span> They don&apos;t ask for
              attention. They keep their promises, fail loudly where it matters, and stay easy to
              change a year later.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.6rem] uppercase tracking-label text-white/55">
              <span>Explicit contracts</span>
              <span className="h-1 w-1 rounded-full bg-primary/50" />
              <span>Observable systems</span>
              <span className="h-1 w-1 rounded-full bg-primary/50" />
              <span>Boring where it counts</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
