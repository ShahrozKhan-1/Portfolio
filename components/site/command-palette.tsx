"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpRight,
  Copy,
  FileText,
  Github,
  Linkedin,
  Mail,
} from "lucide-react"
import { toast } from "sonner"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { Profile, Project } from "@/lib/site-types"

type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  sections: string[]
  projects: Project[]
  profile: Profile
}

const SECTION_LABELS: Record<string, string> = {
  home: "Home",
  about: "About",
  skills: "Skills",
  projects: "Work",
  contact: "Contact",
}

const itemClass =
  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-white/75 outline-none data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-white"

export function CommandPalette({
  open,
  onOpenChange,
  sections,
  projects,
  profile,
}: CommandPaletteProps) {
  const router = useRouter()

  const go = useCallback(
    (href: string) => {
      onOpenChange(false)
      router.push(href)
    },
    [onOpenChange, router],
  )

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      toast.success("Email copied", { description: profile.email })
    } catch {
      toast.error("Could not copy email")
    }
    onOpenChange(false)
  }, [onOpenChange, profile.email])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[14%] max-w-2xl translate-y-0 overflow-hidden border-white/10 bg-[#0A0A10]/95 p-0 shadow-[0_50px_140px_-40px_rgba(0,0,0,1)] backdrop-blur-2xl sm:rounded-3xl">
        <DialogTitle className="sr-only">Command menu</DialogTitle>
        <Command className="bg-transparent text-foreground">
          <div className="flex items-center border-b border-white/[0.07] px-5 pr-12 [&_[cmdk-input-wrapper]]:w-full [&_[cmdk-input-wrapper]]:border-0 [&_[cmdk-input-wrapper]]:px-0">
            <CommandInput
              autoFocus
              placeholder="Search sections, projects, actions…"
              className="h-16 flex-1 border-0 bg-transparent px-0 text-[14px] outline-none placeholder:text-white/30 focus:outline-none focus-visible:outline-none focus:ring-0"
            />
          </div>

          <CommandList className="max-h-[min(58vh,420px)] overflow-y-auto p-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.6rem] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-label [&_[cmdk-group-heading]]:text-white/35">
            <CommandEmpty className="py-10 text-center text-sm text-white/45">
              Nothing found. Try “projects” or “email”.
            </CommandEmpty>

            <CommandGroup heading="Navigate">
              {sections.map((section, index) => (
                <CommandItem
                  key={section}
                  value={`${SECTION_LABELS[section] ?? section} ${section}`}
                  onSelect={() => go(`/#${section}`)}
                  className={itemClass}
                >
                  <span className="font-mono text-[0.65rem] text-primary/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{SECTION_LABELS[section] ?? section}</span>
                  <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-white/30" />
                </CommandItem>
              ))}
            </CommandGroup>

            {projects.length ? (
              <>
                <CommandSeparator className="my-1 bg-white/[0.06]" />
                <CommandGroup heading="Projects">
                  {projects.map((project) => (
                    <CommandItem
                      key={project.id}
                      value={`${project.title} ${project.tags}`}
                      onSelect={() => go(`/projects/${project.slug}`)}
                      className={itemClass}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                      <span>{project.title}</span>
                      <span className="ml-auto font-mono text-[0.6rem] uppercase tracking-widest text-white/30">
                        Case study
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            ) : null}

            <CommandSeparator className="my-1 bg-white/[0.06]" />
            <CommandGroup heading="Elsewhere">
              <CommandItem value="copy email address" onSelect={copyEmail} className={itemClass}>
                <Copy className="h-3.5 w-3.5 text-white/40" />
                <span>Copy email address</span>
                <span className="ml-auto font-mono text-[0.6rem] text-white/30">{profile.email}</span>
              </CommandItem>
              <CommandItem value="email me contact" onSelect={() => go("/#contact")} className={itemClass}>
                <Mail className="h-3.5 w-3.5 text-white/40" />
                <span>Start a project enquiry</span>
              </CommandItem>
              <CommandItem value="resume cv" onSelect={() => go("/resume")} className={itemClass}>
                <FileText className="h-3.5 w-3.5 text-white/40" />
                <span>Open résumé</span>
              </CommandItem>
              <CommandItem
                value="github profile"
                onSelect={() => {
                  onOpenChange(false)
                  window.open(profile.githubUrl, "_blank", "noreferrer")
                }}
                className={itemClass}
              >
                <Github className="h-3.5 w-3.5 text-white/40" />
                <span>GitHub</span>
                <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-white/25" />
              </CommandItem>
              <CommandItem
                value="linkedin profile"
                onSelect={() => {
                  onOpenChange(false)
                  window.open(profile.linkedinUrl, "_blank", "noreferrer")
                }}
                className={itemClass}
              >
                <Linkedin className="h-3.5 w-3.5 text-white/40" />
                <span>LinkedIn</span>
                <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-white/25" />
              </CommandItem>
            </CommandGroup>
          </CommandList>

          <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2.5 font-mono text-[0.6rem] uppercase tracking-label text-white/30">
            <span>Command menu</span>
            <span className="flex items-center gap-3">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
