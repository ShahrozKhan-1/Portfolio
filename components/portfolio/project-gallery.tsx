"use client"

import { useEffect, useState } from "react"
import type { ProjectImage } from "@/lib/site-types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"

export function ProjectGallery({ images }: { images: ProjectImage[] }) {
  const [active, setActive] = useState<number | null>(null)
  const current = active === null ? null : images[active]

  useEffect(() => {
    if (active === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight")
        setActive((value) => (value === null ? 0 : (value + 1) % images.length))
      if (event.key === "ArrowLeft")
        setActive((value) => (value === null ? 0 : (value - 1 + images.length) % images.length))
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active, images.length])

  if (!images.length) return null

  return (
    <section aria-labelledby="gallery-heading" className="mt-14">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.6rem] uppercase tracking-label text-primary">06</span>
        <span className="h-px w-8 bg-white/20" />
        <h2
          id="gallery-heading"
          className="flex items-center gap-2 font-display text-2xl tracking-tight text-white/90"
        >
          <ImageIcon aria-hidden="true" className="h-4 w-4 text-primary/70" />
          Gallery
        </h2>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Open image ${index + 1} of ${images.length}: ${image.alt}`}
            className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 focus-visible:border-primary"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.alt}
              loading="lazy"
              className="aspect-video w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {image.caption ? (
              <span className="block p-3 font-mono text-[0.6rem] uppercase tracking-label text-white/55">
                {image.caption}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-5xl border-white/10 bg-ink-2 p-2 text-white sm:p-4">
          <DialogTitle className="sr-only">
            {current
              ? `Gallery image ${active! + 1} of ${images.length}: ${current.alt}`
              : "Project gallery image"}
          </DialogTitle>
          {current ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.url}
                alt={current.alt}
                className="max-h-[75vh] w-full rounded-xl object-contain"
              />
              <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
                <Button
                  size="icon"
                  variant="secondary"
                  aria-label="Previous image"
                  onClick={() => setActive((active! - 1 + images.length) % images.length)}
                >
                  <ChevronLeft aria-hidden="true" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  aria-label="Next image"
                  onClick={() => setActive((active! + 1) % images.length)}
                >
                  <ChevronRight aria-hidden="true" />
                </Button>
              </div>
              <p
                aria-live="polite"
                className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded-full bg-black/70 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-label text-white/80"
              >
                {active! + 1} / {images.length}
              </p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default ProjectGallery
