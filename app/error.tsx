'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[v0] Portfolio route error:', error)
  }, [error])

  return (
    <main className="shell flex min-h-screen flex-col items-start justify-center gap-5">
      <p className="eyebrow">System error</p>
      <h1>Something went wrong.</h1>
      <p className="section-note">The page could not finish rendering. Try the request again.</p>
      <button className="button button-primary" onClick={() => reset()}>Try again</button>
    </main>
  )
}
