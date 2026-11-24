export default function ProjectLoading() {
  return (
    <div className="relative min-h-screen">
      <div className="shell pt-28">
        <div className="h-4 w-40 animate-pulse rounded-full bg-white/[0.06]" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div>
            <div className="h-6 w-28 animate-pulse rounded-full bg-white/[0.06]" />
            <div className="mt-7 h-16 w-full max-w-md animate-pulse rounded-2xl bg-white/[0.07]" />
            <div className="mt-4 h-16 w-3/4 animate-pulse rounded-2xl bg-white/[0.05]" />
            <div className="mt-6 h-20 w-full max-w-lg animate-pulse rounded-2xl bg-white/[0.04]" />
            <div className="mt-8 h-12 w-48 animate-pulse rounded-full bg-white/[0.06]" />
          </div>
          <div className="aspect-[4/3] animate-pulse rounded-3xl bg-white/[0.05]" />
        </div>
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse bg-ink/80" />
          ))}
        </div>
      </div>
    </div>
  )
}
