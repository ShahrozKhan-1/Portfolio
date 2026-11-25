"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type CopyButtonProps = {
  value: string
  label?: string
  className?: string
  toastLabel?: string
}

export function CopyButton({ value, label = "Copy", className, toastLabel }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const area = document.createElement("textarea")
      area.value = value
      area.style.position = "fixed"
      area.style.opacity = "0"
      document.body.appendChild(area)
      area.select()
      document.execCommand("copy")
      document.body.removeChild(area)
    }
    setCopied(true)
    toast.success(toastLabel ?? "Copied to clipboard", {
      description: value,
    })
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? "Email address copied" : "Copy email address to clipboard"}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2.5 rounded-full pr-1 transition-colors",
        className,
      )}
    >
      <span className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.04] transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
        {copied ? (
          <Check aria-hidden="true" className="h-4 w-4 text-primary" />
        ) : (
          <Copy aria-hidden="true" className="h-4 w-4" />
        )}
      </span>
      <span
        aria-live="polite"
        className="font-mono text-[0.65rem] uppercase tracking-label text-white/55 transition-colors group-hover:text-white"
      >
        {copied ? "Copied" : label}
      </span>
    </button>
  )
}
