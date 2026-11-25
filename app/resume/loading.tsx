export default function ResumeLoading() {
  return (
    <div className="relative min-h-screen pt-28 pb-20">
      <div className="shell max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div className="h-4 w-32 animate-pulse rounded-full bg-white/[0.06]" />
          <div className="h-11 w-36 animate-pulse rounded-full bg-white/[0.06]" />
        </div>

        <div className="mt-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="h-10 w-64 animate-pulse rounded-xl bg-white/[0.07]" />
              <div className="h-4 w-48 animate-pulse rounded-full bg-white/[0.05]" />
              <div className="h-4 w-56 animate-pulse rounded-full bg-white/[0.04]" />
            </div>
            <div className="h-24 w-24 animate-pulse rounded-full bg-white/[0.05]" />
          </div>

          <div className="mt-10 space-y-8">
            {Array.from({ length: 3 }).map((_, section) => (
              <div key={section} className="space-y-4">
                <div className="h-3 w-28 animate-pulse rounded-full bg-primary/20" />
                {Array.from({ length: section === 0 ? 3 : 2 }).map((_, row) => (
                  <div key={row} className="space-y-2">
                    <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/[0.06]" />
                    <div className="h-4 w-full animate-pulse rounded-full bg-white/[0.04]" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
