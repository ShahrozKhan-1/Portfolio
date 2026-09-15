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
      if (event.key === "ArrowRight") setActive((value) => value === null ? 0 : (value + 1) % images.length)
      if (event.key === "ArrowLeft") setActive((value) => value === null ? 0 : (value - 1 + images.length) % images.length)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active, images.length])
  if (!images.length) return null
  return <section aria-labelledby="gallery-heading" className="mt-16">
    <div className="mb-5 flex items-center gap-3"><ImageIcon className="size-5 text-purple-500" /><h2 id="gallery-heading" className="text-2xl font-bold">Gallery</h2></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => <button key={`${image.url}-${index}`} type="button" onClick={() => setActive(index)} className="group overflow-hidden rounded-2xl border border-border bg-card/40 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
        <img src={image.url} alt={image.alt} loading="lazy" className="aspect-video w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
        {image.caption ? <span className="block p-3 text-sm text-slate-600 dark:text-slate-300">{image.caption}</span> : null}
      </button>)}
    </div>
    <Dialog open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
      <DialogContent className="max-w-5xl bg-slate-950 p-2 text-white sm:p-4"><DialogTitle className="sr-only">Project gallery image</DialogTitle>
        {current ? <div className="relative"><img src={current.url} alt={current.alt} className="max-h-[75vh] w-full rounded-xl object-contain" />
          <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between"><Button size="icon" variant="secondary" aria-label="Previous image" onClick={() => setActive((active! - 1 + images.length) % images.length)}><ChevronLeft /></Button><Button size="icon" variant="secondary" aria-label="Next image" onClick={() => setActive((active! + 1) % images.length)}><ChevronRight /></Button></div>
        </div> : null}
      </DialogContent>
    </Dialog>
  </section>
}

export default ProjectGallery
