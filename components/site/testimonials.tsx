"use client"

import { Star } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/reveal"
import { Marquee } from "@/components/site/marquee"
import type { Review } from "@/lib/site-types"

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const hasRealAvatar = review.avatarUrl && !review.avatarUrl.includes("placeholder")

  return (
    <figure className="mr-4 flex w-[19rem] shrink-0 flex-col justify-between whitespace-normal rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-colors duration-500 hover:border-primary/25 hover:bg-white/[0.045] sm:mr-5 sm:w-[23rem] sm:p-7">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1" role="img" aria-label={`${review.rating || 5} out of 5 stars`}>
            {Array.from({ length: Math.max(1, Math.min(review.rating || 5, 5)) }).map((_, starIndex) => (
              <Star key={starIndex} aria-hidden="true" className="h-3.5 w-3.5 fill-primary text-primary" />
            ))}
          </div>
          <span className="font-serif text-4xl leading-none text-white/50">&rdquo;</span>
        </div>

        <blockquote className="mt-5 text-[0.92rem] leading-[1.75] text-white/60">
          {review.content}
        </blockquote>
      </div>

      <figcaption className="mt-7 flex items-center gap-3 border-t border-white/[0.07] pt-5">
        {hasRealAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.avatarUrl}
            alt={review.name}
            loading="lazy"
            className="h-10 w-10 rounded-full border border-white/15 object-cover"
          />
        ) : (
          <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full border border-primary/25 bg-primary/10 font-mono text-[0.7rem] text-primary">
            {initials(review.name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-[0.85rem] font-medium text-white/85">{review.name}</p>
          <p className="truncate font-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/60">
            {review.role}
          </p>
        </div>
        <span aria-hidden="true" className="ml-auto font-mono text-[0.55rem] text-white/60">
          {String(index + 1).padStart(2, "0")}
        </span>
      </figcaption>
    </figure>
  )
}

export function Testimonials({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null

  const loop = [...reviews, ...reviews, ...reviews]
  const average =
    reviews.reduce((total, review) => total + (review.rating || 5), 0) / reviews.length

  return (
    <section className="relative overflow-hidden py-section">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            index="04"
            label="Client feedback"
            title={
              <>
                Work that people
                <br />
                <span className="font-serif italic text-primary">trust</span> to ship.
              </>
            }
          />
          <Reveal delay={0.1}>
            <div className="flex items-center gap-6 lg:pb-3">
              <div>
                <p className="font-display text-4xl leading-none tracking-tight text-white">
                  {average.toFixed(1)}
                  <span className="text-lg text-white/55">/5</span>
                </p>
                <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-label text-white/55">
                  {String(reviews.length).padStart(2, "0")} reviews
                </p>
              </div>
              <span className="h-12 w-px bg-white/10" />
              <div className="flex -space-x-3">
                {reviews.map((review) => (
                  <span
                    key={review.id}
                    aria-hidden="true"
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-ink-3 font-mono text-[0.6rem] text-white/60"
                  >
                    {initials(review.name)}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.12} className="mt-14">
        <div className="relative">
          <Marquee duration={64} className="mask-fade-x py-2">
            {loop.map((review, index) => (
              <ReviewCard key={`${review.id}-${index}`} review={review} index={index % reviews.length} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent sm:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent sm:w-32" />
        </div>
      </Reveal>
    </section>
  )
}
