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
    <button type="button" onClick={copy} className={cn("group inline-flex items-center gap-2", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-full border border-white/12 bg-white/[0.04] transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
        {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
      </span>
      <span className="font-mono text-[0.65rem] uppercase tracking-label text-muted-foreground transition-colors group-hover:text-foreground">
        {copied ? "Copied" : label}
      </span>
    </button>
  )
}
