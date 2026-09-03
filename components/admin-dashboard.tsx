"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ExternalLink, LogOut, Pencil, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Project, Review, SiteData, Skill } from "@/lib/site-types"
import { cn } from "@/lib/utils"

type Status = {
  type: "success" | "error"
  message: string
} | null

type StatusType = "success" | "error"

type MutationName = "profile" | "skill" | "project" | "review" | "delete"

type DeleteTarget = {
  kind: "skill" | "project" | "review"
  id: number
  label: string
}

function SectionTitle({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {children}
    </label>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      {message}
    </div>
  )
}

function splitTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function panelBorder() {
  return "border border-slate-200/70 bg-white/90 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/80"
}

function itemCard() {
  return "rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-purple-200 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-purple-900"
}

export default function AdminDashboard({ data }: { data: SiteData }) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>(null)
  const [saving, setSaving] = useState<MutationName | null>(null)

  const [addSkillOpen, setAddSkillOpen] = useState(false)
  const [addProjectOpen, setAddProjectOpen] = useState(false)
  const [addReviewOpen, setAddReviewOpen] = useState(false)

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingReview, setEditingReview] = useState<Review | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleStatus = (type: StatusType, message: string) => {
    setStatus({ type, message })
  }

  const submitJson = async ({
    endpoint,
    method,
    payload,
    mutation,
    successMessage,
  }: {
    endpoint: string
    method: "POST" | "PUT" | "PATCH" | "DELETE"
    payload?: Record<string, string | number>
    mutation: MutationName
    successMessage: string
  }): Promise<boolean> => {
    setSaving(mutation)
    setStatus(null)

    try {
      const response = await fetch(endpoint, {
        method,
        headers: payload ? { "Content-Type": "application/json" } : undefined,
        body: payload ? JSON.stringify(payload) : undefined,
      })

      const result = (await response.json().catch(() => ({}))) as { message?: string; error?: string }

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong")
      }

      handleStatus("success", result.message || successMessage)
      router.refresh()
      return true
    } catch (error) {
      handleStatus("error", error instanceof Error ? error.message : "Something went wrong")
      return false
    } finally {
      setSaving(null)
    }
  }

  const submitFormData = async ({
    endpoint,
    method,
    formData,
    mutation,
    successMessage,
  }: {
    endpoint: string
    method: "POST" | "PUT" | "PATCH"
    formData: FormData
    mutation: MutationName
    successMessage: string
  }): Promise<boolean> => {
    setSaving(mutation)
    setStatus(null)

    try {
      const response = await fetch(endpoint, {
        method,
        body: formData,
      })

      const result = (await response.json().catch(() => ({}))) as { message?: string; error?: string }

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong")
      }

      handleStatus("success", result.message || successMessage)
      router.refresh()
      return true
    } catch (error) {
      handleStatus("error", error instanceof Error ? error.message : "Something went wrong")
      return false
    } finally {
      setSaving(null)
    }
  }

  const requestDelete = (target: DeleteTarget) => {
    setStatus(null)
    setDeleteTarget(target)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    const endpoint = {
      skill: `/api/admin/skills/${deleteTarget.id}`,
      project: `/api/admin/projects/${deleteTarget.id}`,
      review: `/api/admin/reviews/${deleteTarget.id}`,
    }[deleteTarget.kind]

    const label = deleteTarget.kind[0].toUpperCase() + deleteTarget.kind.slice(1)

    const ok = await submitJson({
      endpoint,
      method: "DELETE",
      mutation: "delete",
      successMessage: `${label} deleted successfully.`,
    })

    setDeleting(false)
    if (ok) setDeleteTarget(null)
  }

  const currentTagsCount = data.projects.reduce((total, project) => total + splitTags(project.tags).length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8 text-slate-950 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-white md:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className={cn("rounded-3xl p-6", panelBorder())}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-purple-600 dark:text-purple-300">
                Admin Panel
              </p>
              <h1 className="mt-2 text-3xl font-bold">Portfolio content manager</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
                Update the profile content, and add, edit, or remove skills, projects, and reviews from the local
                JSON data file.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" className="gap-2 bg-transparent">
                <Link href="/" target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  View site
                </Link>
              </Button>
              <form action="/api/admin/logout" method="post">
                <Button type="submit" variant="destructive" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          </div>

          {status ? (
            <div
              className={cn(
                "mt-6 rounded-2xl border p-4 text-sm",
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-100"
                  : "border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-100",
              )}
            >
              {status.message}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { label: "Skills", value: data.skills.length },
              { label: "Projects", value: data.projects.length },
              { label: "Reviews", value: data.reviews.length },
              { label: "Tags", value: currentTagsCount },
            ].map((item) => (
              <Card key={item.label} className="border-0 bg-white/80 dark:bg-slate-900/80">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">{item.value}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-1 sm:grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="skills">Skills ({data.skills.length})</TabsTrigger>
            <TabsTrigger value="projects">Projects ({data.projects.length})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({data.reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className={panelBorder()}>
              <CardContent className="p-6 md:p-8">
                <SectionTitle
                  title="About me"
                  description="Update the hero, about section, and contact information in one place."
                />
                <form
                  className="grid gap-4 md:grid-cols-2"
                  onSubmit={async (event) => {
                    event.preventDefault()
                    const formData = new FormData(event.currentTarget)
                    await submitFormData({
                      endpoint: "/api/admin/profile",
                      method: "PUT",
                      formData,
                      mutation: "profile",
                      successMessage: "Profile updated successfully.",
                    })
                  }}
                >
                  <Field label="Name">
                    <Input name="name" defaultValue={data.profile.name} required />
                  </Field>
                  <Field label="Role">
                    <Input name="role" defaultValue={data.profile.role} required />
                  </Field>
                  <Field label="Headline">
                    <Textarea name="headline" defaultValue={data.profile.headline} className="md:col-span-2" required />
                  </Field>
                  <Field label="About">
                    <Textarea
                      name="about"
                      defaultValue={data.profile.about}
                      className="md:col-span-2 min-h-[120px]"
                      required
                    />
                  </Field>
                  <Field label="Summary">
                    <Textarea
                      name="summary"
                      defaultValue={data.profile.summary}
                      className="md:col-span-2 min-h-[120px]"
                      required
                    />
                  </Field>
                  <Field label="Email">
                    <Input type="email" name="email" defaultValue={data.profile.email} required />
                  </Field>
                  <Field label="Location">
                    <Input name="location" defaultValue={data.profile.location} required />
                  </Field>
                  <Field label="GitHub URL">
                    <Input name="githubUrl" defaultValue={data.profile.githubUrl} required />
                  </Field>
                  <Field label="LinkedIn URL">
                    <Input name="linkedinUrl" defaultValue={data.profile.linkedinUrl} required />
                  </Field>
                  <Field label="Profile image URL">
                    <Input name="imageUrl" defaultValue={data.profile.imageUrl} required />
                  </Field>
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" disabled={saving === "profile"} className="rounded-full">
                      {saving === "profile" ? "Saving..." : "Save profile"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card className={panelBorder()}>
              <CardContent className="p-6 md:p-8">
                <SectionTitle
                  title="Skills"
                  description="Add, edit, or remove the skills you want to show on the homepage."
                  action={
                    <Dialog open={addSkillOpen} onOpenChange={setAddSkillOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" className="gap-2 rounded-full">
                          <Plus className="h-4 w-4" />
                          Add skill
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Add skill</DialogTitle>
                          <DialogDescription>Add a new skill card to the homepage.</DialogDescription>
                        </DialogHeader>
                        <form
                          className="grid gap-4 md:grid-cols-2"
                          onSubmit={async (event) => {
                            event.preventDefault()
                            const form = event.currentTarget
                            const formData = new FormData(form)
                            const ok = await submitFormData({
                              endpoint: "/api/admin/skills",
                              method: "POST",
                              formData,
                              mutation: "skill",
                              successMessage: "Skill added successfully.",
                            })
                            if (ok) {
                              form.reset()
                              setAddSkillOpen(false)
                            }
                          }}
                        >
                          <Field label="Skill name">
                            <Input name="name" placeholder="e.g. Python" required />
                          </Field>
                          <Field label="Category">
                            <Input name="category" placeholder="e.g. Language" required />
                          </Field>
                          <Field label="Description">
                            <Textarea name="description" className="md:col-span-2 min-h-[96px]" required />
                          </Field>
                          <Field label="Icon key">
                            <Input name="iconKey" placeholder="code, server, database, zap, terminal..." required />
                          </Field>
                          <Field label="Accent">
                            <Input name="accent" placeholder="from-blue-500 to-cyan-500" required />
                          </Field>
                          <Field label="Order">
                            <Input name="orderIndex" type="number" defaultValue={0} />
                          </Field>
                          <DialogFooter className="md:col-span-2">
                            <Button type="submit" disabled={saving === "skill"} className="rounded-full">
                              {saving === "skill" ? "Adding..." : "Add skill"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  }
                />

                {data.skills.length === 0 ? (
                  <EmptyState message="No skills yet. Add one to get started." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.skills.map((skill) => (
                      <div key={skill.id} className={itemCard()}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="font-semibold">{skill.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {skill.category} · {skill.iconKey}
                            </p>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{skill.description}</p>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              aria-label={`Edit ${skill.name}`}
                              onClick={() => setEditingSkill(skill)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              aria-label={`Delete ${skill.name}`}
                              onClick={() => requestDelete({ kind: "skill", id: skill.id, label: skill.name })}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card className={panelBorder()}>
              <CardContent className="p-6 md:p-8">
                <SectionTitle
                  title="Projects"
                  description="Manage the portfolio project cards that appear on the homepage."
                  action={
                    <Dialog open={addProjectOpen} onOpenChange={setAddProjectOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" className="gap-2 rounded-full">
                          <Plus className="h-4 w-4" />
                          Add project
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Add project</DialogTitle>
                          <DialogDescription>Add a new project card to the homepage.</DialogDescription>
                        </DialogHeader>
                        <form
                          className="grid gap-4 md:grid-cols-2"
                          onSubmit={async (event) => {
                            event.preventDefault()
                            const form = event.currentTarget
                            const formData = new FormData(form)
                            const ok = await submitFormData({
                              endpoint: "/api/admin/projects",
                              method: "POST",
                              formData,
                              mutation: "project",
                              successMessage: "Project added successfully.",
                            })
                            if (ok) {
                              form.reset()
                              setAddProjectOpen(false)
                            }
                          }}
                        >
                          <Field label="Project title">
                            <Input name="title" placeholder="e.g. VisionIMS" required />
                          </Field>
                          <Field label="Project link">
                            <Input name="linkUrl" placeholder="https://..." />
                          </Field>
                          <Field label="Description">
                            <Textarea name="description" className="md:col-span-2 min-h-[96px]" required />
                          </Field>
                          <Field label="Tags">
                            <Input name="tags" placeholder="Django, PostgreSQL, Docker" required />
                          </Field>
                          <Field label="Image URL (optional)">
                            <Input name="imageUrl" placeholder="https://example.com/project-image.jpg or /project-image.jpg" />
                          </Field>
                          <Field label="Order">
                            <Input name="orderIndex" type="number" defaultValue={0} />
                          </Field>
                          <DialogFooter className="md:col-span-2">
                            <Button type="submit" disabled={saving === "project"} className="rounded-full">
                              {saving === "project" ? "Adding..." : "Add project"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  }
                />

                {data.projects.length === 0 ? (
                  <EmptyState message="No projects yet. Add one to get started." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {data.projects.map((project) => (
                      <div key={project.id} className={itemCard()}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="font-semibold">{project.title}</h3>
                            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                              {project.linkUrl || "No link"}
                            </p>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{project.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {splitTags(project.tags).map((tag) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              aria-label={`Edit ${project.title}`}
                              onClick={() => setEditingProject(project)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              aria-label={`Delete ${project.title}`}
                              onClick={() => requestDelete({ kind: "project", id: project.id, label: project.title })}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className={panelBorder()}>
              <CardContent className="p-6 md:p-8">
                <SectionTitle
                  title="Reviews"
                  description="Publish client feedback and control how it appears on the site."
                  action={
                    <Dialog open={addReviewOpen} onOpenChange={setAddReviewOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" className="gap-2 rounded-full">
                          <Plus className="h-4 w-4" />
                          Add review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Add review</DialogTitle>
                          <DialogDescription>Publish a new piece of client feedback.</DialogDescription>
                        </DialogHeader>
                        <form
                          className="grid gap-4 md:grid-cols-2"
                          onSubmit={async (event) => {
                            event.preventDefault()
                            const form = event.currentTarget
                            const formData = new FormData(form)
                            const ok = await submitFormData({
                              endpoint: "/api/admin/reviews",
                              method: "POST",
                              formData,
                              mutation: "review",
                              successMessage: "Review added successfully.",
                            })
                            if (ok) {
                              form.reset()
                              setAddReviewOpen(false)
                            }
                          }}
                        >
                          <Field label="Reviewer name">
                            <Input name="name" placeholder="e.g. Sarah Johnson" required />
                          </Field>
                          <Field label="Role">
                            <Input name="role" placeholder="e.g. CEO, TechStart" required />
                          </Field>
                          <Field label="Content">
                            <Textarea name="content" className="md:col-span-2 min-h-[96px]" required />
                          </Field>
                          <Field label="Avatar URL">
                            <Input name="avatarUrl" placeholder="/placeholder-user.jpg" required />
                          </Field>
                          <Field label="Rating">
                            <Input name="rating" type="number" min={1} max={5} defaultValue={5} />
                          </Field>
                          <Field label="Order">
                            <Input name="orderIndex" type="number" defaultValue={0} />
                          </Field>
                          <DialogFooter className="md:col-span-2">
                            <Button type="submit" disabled={saving === "review"} className="rounded-full">
                              {saving === "review" ? "Adding..." : "Add review"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  }
                />

                {data.reviews.length === 0 ? (
                  <EmptyState message="No reviews yet. Add one to get started." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {data.reviews.map((review) => (
                      <div key={review.id} className={itemCard()}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="font-semibold">{review.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{review.role}</p>
                            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{review.content}</p>
                            <div className="mt-3 flex gap-1 text-yellow-500">
                              {Array.from({ length: review.rating }, (_, index) => (
                                <span key={index}>★</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              aria-label={`Edit ${review.name}`}
                              onClick={() => setEditingReview(review)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              aria-label={`Delete ${review.name}`}
                              onClick={() => requestDelete({ kind: "review", id: review.id, label: review.name })}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit skill dialog */}
      <Dialog open={editingSkill !== null} onOpenChange={(open) => !open && setEditingSkill(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit skill</DialogTitle>
            <DialogDescription>Update this skill&apos;s details.</DialogDescription>
          </DialogHeader>
          {editingSkill ? (
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                const ok = await submitFormData({
                  endpoint: `/api/admin/skills/${editingSkill.id}`,
                  method: "PATCH",
                  formData,
                  mutation: "skill",
                  successMessage: "Skill updated successfully.",
                })
                if (ok) setEditingSkill(null)
              }}
            >
              <Field label="Skill name">
                <Input name="name" defaultValue={editingSkill.name} required />
              </Field>
              <Field label="Category">
                <Input name="category" defaultValue={editingSkill.category} required />
              </Field>
              <Field label="Description">
                <Textarea
                  name="description"
                  defaultValue={editingSkill.description}
                  className="md:col-span-2 min-h-[96px]"
                  required
                />
              </Field>
              <Field label="Icon key">
                <Input name="iconKey" defaultValue={editingSkill.iconKey} required />
              </Field>
              <Field label="Accent">
                <Input name="accent" defaultValue={editingSkill.accent} required />
              </Field>
              <Field label="Order">
                <Input name="orderIndex" type="number" defaultValue={editingSkill.orderIndex} />
              </Field>
              <DialogFooter className="md:col-span-2">
                <Button type="submit" disabled={saving === "skill"} className="rounded-full">
                  {saving === "skill" ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Edit project dialog */}
      <Dialog open={editingProject !== null} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <DialogDescription>Update this project&apos;s details.</DialogDescription>
          </DialogHeader>
          {editingProject ? (
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                const ok = await submitFormData({
                  endpoint: `/api/admin/projects/${editingProject.id}`,
                  method: "PATCH",
                  formData,
                  mutation: "project",
                  successMessage: "Project updated successfully.",
                })
                if (ok) setEditingProject(null)
              }}
            >
              <Field label="Project title">
                <Input name="title" defaultValue={editingProject.title} required />
              </Field>
              <Field label="Project link">
                <Input name="linkUrl" defaultValue={editingProject.linkUrl} />
              </Field>
              <Field label="Description">
                <Textarea
                  name="description"
                  defaultValue={editingProject.description}
                  className="md:col-span-2 min-h-[96px]"
                  required
                />
              </Field>
              <Field label="Tags">
                <Input name="tags" defaultValue={editingProject.tags} required />
              </Field>
              <Field label="Image URL (optional)">
                <Input name="imageUrl" defaultValue={editingProject.imageUrl ?? ""} />
              </Field>
              <Field label="Order">
                <Input name="orderIndex" type="number" defaultValue={editingProject.orderIndex} />
              </Field>
              <DialogFooter className="md:col-span-2">
                <Button type="submit" disabled={saving === "project"} className="rounded-full">
                  {saving === "project" ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Edit review dialog */}
      <Dialog open={editingReview !== null} onOpenChange={(open) => !open && setEditingReview(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit review</DialogTitle>
            <DialogDescription>Update this review&apos;s details.</DialogDescription>
          </DialogHeader>
          {editingReview ? (
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                const ok = await submitFormData({
                  endpoint: `/api/admin/reviews/${editingReview.id}`,
                  method: "PATCH",
                  formData,
                  mutation: "review",
                  successMessage: "Review updated successfully.",
                })
                if (ok) setEditingReview(null)
              }}
            >
              <Field label="Reviewer name">
                <Input name="name" defaultValue={editingReview.name} required />
              </Field>
              <Field label="Role">
                <Input name="role" defaultValue={editingReview.role} required />
              </Field>
              <Field label="Content">
                <Textarea
                  name="content"
                  defaultValue={editingReview.content}
                  className="md:col-span-2 min-h-[96px]"
                  required
                />
              </Field>
              <Field label="Avatar URL">
                <Input name="avatarUrl" defaultValue={editingReview.avatarUrl} required />
              </Field>
              <Field label="Rating">
                <Input name="rating" type="number" min={1} max={5} defaultValue={editingReview.rating} />
              </Field>
              <Field label="Order">
                <Input name="orderIndex" type="number" defaultValue={editingReview.orderIndex} />
              </Field>
              <DialogFooter className="md:col-span-2">
                <Button type="submit" disabled={saving === "review"} className="rounded-full">
                  {saving === "review" ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && !deleting && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.kind}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &quot;{deleteTarget?.label}&quot; from your portfolio. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault()
                void confirmDelete()
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
