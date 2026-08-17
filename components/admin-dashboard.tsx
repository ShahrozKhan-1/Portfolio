"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { SiteData } from "@/lib/site-types"
import { cn } from "@/lib/utils"

type Status = {
  type: "success" | "error"
  message: string
} | null

type StatusType = "success" | "error"

type MutationName = "profile" | "skill" | "project" | "review" | "delete"

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
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

function splitTags(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function panelBorder() {
  return "border border-slate-200/70 bg-white/90 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/80"
}

export default function AdminDashboard({ data }: { data: SiteData }) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>(null)
  const [saving, setSaving] = useState<MutationName | null>(null)

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
    method: "POST" | "PUT" | "DELETE"
    payload?: Record<string, string | number>
    mutation: MutationName
    successMessage: string
  }) => {
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
    } catch (error) {
      handleStatus("error", error instanceof Error ? error.message : "Something went wrong")
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
    method: "POST" | "PUT"
    formData: FormData
    mutation: MutationName
    successMessage: string
  }) => {
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
    } catch (error) {
      handleStatus("error", error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setSaving(null)
    }
  }

  const deleteItem = async (endpoint: string, mutation: MutationName, successMessage: string) => {
    await submitJson({
      endpoint,
      method: "DELETE",
      mutation,
      successMessage,
    })
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
                Update the profile content, add skills, manage projects, and publish reviews from the local JSON data file.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" className="bg-transparent">
                <Link href="/">View site</Link>
              </Button>
              <form action="/api/admin/logout" method="post">
                <Button type="submit" variant="destructive">
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
                <Textarea name="about" defaultValue={data.profile.about} className="md:col-span-2 min-h-[120px]" required />
              </Field>
              <Field label="Summary">
                <Textarea name="summary" defaultValue={data.profile.summary} className="md:col-span-2 min-h-[120px]" required />
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

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className={panelBorder()}>
            <CardContent className="p-6 md:p-8">
              <SectionTitle
                title="Skills"
                description="Add the skills you want to show on the homepage."
              />

              <div className="space-y-4">
                {data.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{skill.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {skill.category} · {skill.iconKey}
                        </p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{skill.description}</p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={saving === "delete"}
                        onClick={() =>
                          deleteItem(`/api/admin/skills/${skill.id}`, "delete", "Skill deleted successfully.")
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <form
                className="mt-6 grid gap-4 md:grid-cols-2"
                onSubmit={async (event) => {
                  event.preventDefault()
                  const formData = new FormData(event.currentTarget)
                  await submitFormData({
                    endpoint: "/api/admin/skills",
                    method: "POST",
                    formData,
                    mutation: "skill",
                    successMessage: "Skill added successfully.",
                  })
                  event.currentTarget.reset()
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
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" disabled={saving === "skill"} className="rounded-full">
                    {saving === "skill" ? "Adding..." : "Add skill"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className={panelBorder()}>
            <CardContent className="p-6 md:p-8">
              <SectionTitle
                title="Projects"
                description="Manage the portfolio project cards that appear on the homepage."
              />

              <div className="space-y-4">
                {data.projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{project.linkUrl || "No link"}</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{project.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {splitTags(project.tags).map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={saving === "delete"}
                        onClick={() =>
                          deleteItem(`/api/admin/projects/${project.id}`, "delete", "Project deleted successfully.")
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <form
                className="mt-6 grid gap-4 md:grid-cols-2"
                onSubmit={async (event) => {
                  event.preventDefault()
                  const formData = new FormData(event.currentTarget)
                  await submitFormData({
                    endpoint: "/api/admin/projects",
                    method: "POST",
                    formData,
                    mutation: "project",
                    successMessage: "Project added successfully.",
                  })
                  event.currentTarget.reset()
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
                <Field label="Image URL">
                  <Input name="imageUrl" placeholder="/placeholder.svg?height=300&width=500" required />
                </Field>
                <Field label="Order">
                  <Input name="orderIndex" type="number" defaultValue={0} />
                </Field>
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" disabled={saving === "project"} className="rounded-full">
                    {saving === "project" ? "Adding..." : "Add project"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className={panelBorder()}>
          <CardContent className="p-6 md:p-8">
            <SectionTitle
              title="Reviews"
              description="Publish client feedback and control how it appears on the site."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{review.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{review.role}</p>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{review.content}</p>
                      <div className="mt-3 flex gap-1 text-yellow-500">
                        {Array.from({ length: review.rating }, (_, index) => (
                          <span key={index}>★</span>
                        ))}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={saving === "delete"}
                      onClick={() =>
                        deleteItem(`/api/admin/reviews/${review.id}`, "delete", "Review deleted successfully.")
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <form
              className="mt-6 grid gap-4 md:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                await submitFormData({
                  endpoint: "/api/admin/reviews",
                  method: "POST",
                  formData,
                  mutation: "review",
                  successMessage: "Review added successfully.",
                })
                event.currentTarget.reset()
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
                <Input name="avatarUrl" placeholder="/images/rupesh-profile.jpeg" required />
              </Field>
              <Field label="Rating">
                <Input name="rating" type="number" min={1} max={5} defaultValue={5} />
              </Field>
              <Field label="Order">
                <Input name="orderIndex" type="number" defaultValue={0} />
              </Field>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={saving === "review"} className="rounded-full">
                  {saving === "review" ? "Adding..." : "Add review"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
