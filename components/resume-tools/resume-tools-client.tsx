"use client"

import { useState, type FormEvent } from "react"
import { AlertCircle, Check, Clipboard, Download, FileText, Loader2, LogOut, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/sonner"

const MAX_RESUME_LENGTH = 15_000
const MAX_JOB_DESCRIPTION_LENGTH = 8_000

function getErrorMessage(payload: unknown) {
  return typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string"
    ? payload.error
    : "Something went wrong. Please try again."
}

export default function ResumeToolsClient({ isAuthenticated: initialAuthenticated }: { isAuthenticated: boolean }) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated)
  const [password, setPassword] = useState("")
  const [resume, setResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [pageSize, setPageSize] = useState<"LETTER" | "A4">("LETTER")
  const [loginError, setLoginError] = useState("")

  const isResumeOverLimit = resume.length > MAX_RESUME_LENGTH
  const isJobDescriptionOverLimit = jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH
  const canEnhance = resume.trim().length > 0 && !isResumeOverLimit && !isJobDescriptionOverLimit && !isEnhancing

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoggingIn(true)
    setLoginError("")

    try {
      const response = await fetch("/api/admin/resume-tools/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
        cache: "no-store",
      })
      const payload: unknown = await response.json()
      if (!response.ok) throw new Error(getErrorMessage(payload))
      setIsAuthenticated(true)
      setPassword("")
      toast.success("You are signed in.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in."
      setLoginError(message)
    } finally {
      setIsLoggingIn(false)
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch("/api/admin/resume-tools/logout", {
        method: "POST",
        cache: "no-store",
      })
      if (!response.ok) throw new Error("Unable to sign out. Please try again.")

      setIsAuthenticated(false)
      setPassword("")
      setResume("")
      setJobDescription("")
      setResult("")
      setSuggestions([])
      setWarnings([])
      toast.success("You are signed out.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign out. Please try again.")
    }
  }

  async function handleEnhance() {
    if (!canEnhance) return
    setIsEnhancing(true)
    setWarnings([])

    try {
      const response = await fetch("/api/enhance-resume", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
        cache: "no-store",
      })
      const payload: unknown = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false)
          setResume("")
          setJobDescription("")
          setResult("")
          setSuggestions([])
          setWarnings([])
        }
        throw new Error(getErrorMessage(payload))
      }

      if (typeof payload !== "object" || payload === null || !("resume" in payload) || typeof payload.resume !== "string") {
        throw new Error("The AI response was not in the expected format. Please try again.")
      }
      setResult(payload.resume)
      setSuggestions("suggestions" in payload && Array.isArray(payload.suggestions) ? payload.suggestions.filter((item): item is string => typeof item === "string") : [])
      setWarnings("warnings" in payload && Array.isArray(payload.warnings) ? payload.warnings.filter((item): item is string => typeof item === "string") : [])
      toast.success("Resume enhancement is ready.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to enhance the resume.")
    } finally {
      setIsEnhancing(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result)
      toast.success("Enhanced resume copied to clipboard.")
    } catch {
      toast.error("Clipboard access is unavailable in this browser.")
    }
  }

  async function handleDownloadPdf() {
    if (!result.trim()) return
    setIsDownloading(true)

    try {
      const [{ pdf }, { ResumeDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/resume-tools/resume-document"),
      ])
      const blob = await pdf(<ResumeDocument resume={result} pageSize={pageSize} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "Shahroz-Khan-Enhanced-Resume.pdf"
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
      toast.success("Your resume PDF has been downloaded.")
    } catch {
      toast.error("Unable to generate the PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:py-12">
      <Toaster position="top-right" />
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <a href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Shahroz Khan / Portfolio</a>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Private workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Resume tools</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Refine plain-text resume content for applicant tracking systems, then review every suggested change before exporting.</p>
          </div>
          {isAuthenticated && (
            <Button type="button" variant="outline" onClick={handleLogout} className="w-fit">
              <LogOut data-icon="inline-start" aria-hidden="true" />
              Sign out
            </Button>
          )}
        </header>

        {!isAuthenticated ? (
          <Card className="mx-auto w-full max-w-md border-border/80 bg-card/90 shadow-xl shadow-black/5">
            <CardHeader>
              <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                <FileText className="size-5" />
              </div>
              <CardTitle>Owner sign in</CardTitle>
              <CardDescription>This private workspace is only available to the site owner.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="flex flex-col gap-3">
                <label htmlFor="owner-password" className="text-sm font-medium">Admin password</label>
                <Input
                  id="owner-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={isLoggingIn}
                />
                {loginError && (
                  <Alert variant="destructive" role="alert">
                    <AlertCircle aria-hidden="true" />
                    <AlertTitle>Sign-in failed</AlertTitle>
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={!password || isLoggingIn}>
                  {isLoggingIn ? <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> : null}
                  {isLoggingIn ? "Signing in…" : "Sign in"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">

            <Card className="border-border/80 bg-card/90 shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle>Resume source</CardTitle>
                <CardDescription>Paste plain text only. Avoid personal data you do not want sent to the AI service.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="resume-source" className="text-sm font-medium">Resume text</label>
                  <Textarea
                    id="resume-source"
                    value={resume}
                    onChange={(event) => setResume(event.target.value)}
                    maxLength={MAX_RESUME_LENGTH}
                    rows={14}
                    placeholder={'Shahroz Khan\nEmail · Location · LinkedIn\n\nSUMMARY\n- Your professional summary'}
                    aria-describedby="resume-count"
                    aria-invalid={isResumeOverLimit}
                    className="min-h-72 resize-y font-mono text-sm leading-6"
                  />
                  <p id="resume-count" className={`text-right text-xs ${isResumeOverLimit ? "text-destructive" : "text-muted-foreground"}`} aria-live="polite">
                    {resume.length.toLocaleString()} / {MAX_RESUME_LENGTH.toLocaleString()} characters
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="job-description" className="text-sm font-medium">Target job description <span className="font-normal text-muted-foreground">(optional)</span></label>
                  <Textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={(event) => setJobDescription(event.target.value)}
                    maxLength={MAX_JOB_DESCRIPTION_LENGTH}
                    rows={6}
                    placeholder="Paste the role requirements to identify supported keywords."
                    aria-describedby="job-description-count"
                    aria-invalid={isJobDescriptionOverLimit}
                    className="resize-y font-mono text-sm leading-6"
                  />
                  <p id="job-description-count" className={`text-right text-xs ${isJobDescriptionOverLimit ? "text-destructive" : "text-muted-foreground"}`} aria-live="polite">
                    {jobDescription.length.toLocaleString()} / {MAX_JOB_DESCRIPTION_LENGTH.toLocaleString()} characters
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-3">
                <Button type="button" onClick={handleEnhance} disabled={!canEnhance} className="w-full">
                  {isEnhancing ? <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="mr-2 size-4" aria-hidden="true" />}
                  {isEnhancing ? "Enhancing resume…" : "Enhance with Gemini"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">AI suggestions are a draft. Review all details for accuracy before use.</p>
              </CardFooter>
            </Card>

            <div className="flex flex-col gap-6">
              <Card className="border-border/80 bg-card/90 shadow-lg shadow-black/5">
                <CardHeader>
                  <CardTitle>Enhanced resume</CardTitle>
                  <CardDescription>Edit the result before copying or downloading it.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    aria-label="Enhanced resume text"
                    value={result}
                    onChange={(event) => setResult(event.target.value)}
                    rows={20}
                    placeholder="Your improved resume will appear here."
                    className="min-h-[26rem] resize-y font-mono text-sm leading-6"
                  />
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
                  <Button type="button" variant="outline" onClick={handleCopy} disabled={!result.trim()}>
                    <Clipboard data-icon="inline-start" aria-hidden="true" />
                    Copy to Clipboard
                  </Button>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    Page size
                    <select
                      value={pageSize}
                      onChange={(event) => setPageSize(event.target.value as "LETTER" | "A4")}
                      className="h-9 rounded-md border border-input bg-background px-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="PDF page size"
                    >
                      <option value="LETTER">Letter</option>
                      <option value="A4">A4</option>
                    </select>
                  </label>
                  <Button type="button" onClick={handleDownloadPdf} disabled={!result.trim() || isDownloading}>
                    {isDownloading ? <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> : <Download className="mr-2 size-4" aria-hidden="true" />}
                    {isDownloading ? "Preparing PDF…" : "Download as PDF"}
                  </Button>
                </CardFooter>
              </Card>

              {(suggestions.length > 0 || warnings.length > 0) && (
                <Card className="border-border/80 bg-card/90 shadow-lg shadow-black/5">
                  <CardHeader>
                    <CardTitle>Review notes</CardTitle>
                    <CardDescription>Verify these suggestions and warnings before sharing your resume.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    {suggestions.length > 0 && (
                      <section aria-labelledby="suggestions-title">
                        <h3 id="suggestions-title" className="mb-3 flex items-center gap-2 text-sm font-semibold">
                          <Check className="size-4 text-primary" aria-hidden="true" /> Suggestions
                        </h3>
                        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-6 text-muted-foreground">
                          {suggestions.map((suggestion, index) => <li key={`${suggestion}-${index}`}>{suggestion}</li>)}
                        </ul>
                      </section>
                    )}
                    {warnings.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle aria-hidden="true" />
                        <AlertTitle>Check generated numbers</AlertTitle>
                        <AlertDescription>
                          <ul className="mt-2 flex list-disc flex-col gap-1 pl-4">
                            {warnings.map((warning, index) => <li key={`${warning}-${index}`}>{warning}</li>)}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
        <footer className="text-center text-xs text-muted-foreground">Private resume workspace · No resume text is stored by this tool.</footer>
      </div>
    </main>
  )
}
