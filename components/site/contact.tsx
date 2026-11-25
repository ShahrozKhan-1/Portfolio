"use client"

import type { FormEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, CheckCircle2, Github, Linkedin, Loader2, Mail, MapPin, XCircle } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/reveal"
import { CopyButton } from "@/components/site/copy-button"
import { LocalTime } from "@/components/site/local-time"
import type { ContactFormState } from "@/hooks/use-contact-form"
import type { Profile } from "@/lib/site-types"

type ContactProps = {
  profile: Profile
  contactState: ContactFormState | null
  isSubmitting: boolean
  handleContactSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="group block">
      <div className="mb-2 flex items-baseline gap-1.5 font-mono text-[0.6rem] uppercase tracking-label text-white/60">
        <label htmlFor={htmlFor}>{label}</label>
        <span aria-hidden="true" className="text-primary/80">
          *
        </span>
        {hint ? (
          <span className="ml-auto normal-case tracking-normal text-white/60">{hint}</span>
        ) : null}
      </div>
      {children}
    </div>
  )
}

export function Contact({ profile, contactState, isSubmitting, handleContactSubmit }: ContactProps) {
  return (
    <section id="contact" className="relative py-section">
      <div className="shell">
        <div className="panel relative overflow-hidden p-6 sm:p-10 lg:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(200,250,79,0.14),transparent_65%)] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(140,124,255,0.16),transparent_65%)] blur-3xl"
          />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.02fr] lg:gap-16">
            <div className="flex flex-col justify-between">
              <div>
                <SectionHeading
                  index="05"
                  label="Contact"
                  title={
                    <>
                      Have a system
                      <br />
                      that needs <span className="font-serif italic text-primary">building?</span>
                    </>
                  }
                  description="Tell me what you're working on. I reply to every serious enquiry within one business day."
                />

                <Reveal delay={0.15}>
                  <div className="mt-10">
                    <a
                      href={`mailto:${profile.email}`}
                      className="group inline-flex min-h-11 items-center gap-2 font-display text-[clamp(1.3rem,2.8vw,2.1rem)] leading-none tracking-tight text-white transition-colors hover:text-primary"
                    >
                      {profile.email}
                      <span className="sr-only"> (opens your email app)</span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 -translate-y-1 text-white/55 transition-all group-hover:-translate-y-1.5 group-hover:translate-x-1 group-hover:text-primary"
                      />
                    </a>
                    <div className="mt-4">
                      <CopyButton value={profile.email} label="Copy email" toastLabel="Email copied" />
                    </div>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.2}>
                <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-white/[0.08] pt-8">
                  <div>
                    <p className="font-mono text-[0.55rem] uppercase tracking-label text-white/60">
                      Location
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-[0.85rem] text-white/75">
                      <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-primary/70" />
                      Lahore, Pakistan
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.55rem] uppercase tracking-label text-white/60">
                      Local time
                    </p>
                    <p className="mt-2 text-[0.85rem] text-white/75">
                      <LocalTime />
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.55rem] uppercase tracking-label text-white/60">
                      Response
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-[0.85rem] text-white/75">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Within 24 hours
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.55rem] uppercase tracking-label text-white/60">
                      Elsewhere
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      {[
                        {
                          href: profile.githubUrl,
                          label: "GitHub",
                          icon: Github,
                          external: true,
                        },
                        {
                          href: profile.linkedinUrl,
                          label: "LinkedIn",
                          icon: Linkedin,
                          external: true,
                        },
                        {
                          href: `mailto:${profile.email}`,
                          label: "Email",
                          icon: Mail,
                          external: false,
                        },
                      ].map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                          aria-label={`${item.label}${item.external ? " (opens in a new tab)" : ""}`}
                          className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.08] text-white/60 transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          <item.icon aria-hidden="true" className="h-4 w-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-white/[0.09] bg-ink/45 p-6 backdrop-blur-xl sm:p-8">
                <div className="mb-7 flex items-center justify-between gap-4">
                  <h3 className="font-display text-lg tracking-tight text-white">Send a message</h3>
                  <span className="font-mono text-[0.55rem] uppercase tracking-label text-white/60">
                    Replies within 24h
                  </span>
                </div>

                <form
                  onSubmit={handleContactSubmit}
                  aria-busy={isSubmitting}
                  aria-describedby="form-required-note"
                  className="space-y-4"
                >
                  <input type="hidden" name="recipientEmail" value={profile.email} />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name" htmlFor="name">
                      <input
                        id="name"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        className="field"
                      />
                    </Field>
                    <Field label="Email" htmlFor="email">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@company.com"
                        className="field"
                      />
                    </Field>
                  </div>

                  <Field label="Subject" htmlFor="subject">
                    <input
                      id="subject"
                      name="subject"
                      required
                      placeholder="Project, role or idea"
                      className="field"
                    />
                  </Field>

                  <Field label="Message" htmlFor="message" hint="A short brief is plenty">
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="What are you building, and what does success look like?"
                      className="field min-h-[130px] resize-none py-3"
                    />
                  </Field>

                  <p
                    id="form-required-note"
                    className="font-mono text-[0.6rem] uppercase tracking-label text-white/60"
                  >
                    All fields are required
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="btn-signal group w-full disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                        Sending message
                      </>
                    ) : (
                      <>
                        Send message
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>

                  <AnimatePresence mode="wait">
                    {contactState ? (
                      <motion.div
                        key={contactState.message}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        role={contactState.success ? "status" : "alert"}
                        aria-live={contactState.success ? "polite" : "assertive"}
                        className={
                          contactState.success
                            ? "flex items-start gap-2.5 rounded-xl border border-primary/25 bg-primary/[0.07] p-3.5 text-[0.8rem] leading-relaxed text-primary/90"
                            : "flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/[0.08] p-3.5 text-[0.8rem] leading-relaxed text-red-300"
                        }
                      >
                        {contactState.success ? (
                          <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                        ) : (
                          <XCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                        )}
                        <span>{contactState.message}</span>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
