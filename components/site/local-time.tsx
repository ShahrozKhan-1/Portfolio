"use client"

import { useEffect, useState } from "react"

export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    const update = () => setTime(formatter.format(new Date()))
    update()
    const interval = window.setInterval(update, 20_000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <span className={className} suppressHydrationWarning>
      {time || "--:--"} <span className="text-white/55">PKT</span>
    </span>
  )
}
