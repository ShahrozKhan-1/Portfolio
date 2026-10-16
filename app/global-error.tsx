'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[v0] Global portfolio error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <main className="shell flex min-h-screen flex-col items-start justify-center gap-5">
          <p className="eyebrow">System error</p>
          <h1>Something went wrong.</h1>
          <p className="section-note">The page could not finish rendering. Try the request again.</p>
          <button className="button button-primary" onClick={() => reset()}>Try again</button>
        </main>
      </body>
    </html>
  )
}
