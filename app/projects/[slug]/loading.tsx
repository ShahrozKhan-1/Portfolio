export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="h-16 border-b bg-white/70 dark:bg-slate-950/70" />
      <main className="container px-4 pb-16 pt-10 md:px-6 md:pt-16">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,.9fr)]">
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-8 dark:border-slate-800 dark:bg-slate-900/70 sm:p-10">
            <div className="h-6 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="mt-8 h-16 max-w-xl animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="mt-6 h-20 max-w-2xl animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60" />
          </div>
          <div className="min-h-[300px] animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800 sm:min-h-[360px]" />
        </section>
      </main>
    </div>
  )
}
