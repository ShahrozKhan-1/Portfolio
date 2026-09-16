"use client"

import { useRef, useState } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const accept = "image/jpeg,image/png,image/webp,image/gif"

export function ImageUpload({ name, multiple = false, initialValue = "" }: { name: string; multiple?: boolean; initialValue?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [paths, setPaths] = useState(initialValue ? initialValue.split("\n").filter(Boolean) : [])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    setError("")
    setUploading(true)
    const body = new FormData()
    Array.from(files).forEach((file) => body.append("files", file))
    try {
      const response = await fetch("/api/admin/images", { method: "POST", body })
      const result = (await response.json()) as { paths?: string[]; error?: string }
      if (!response.ok) throw new Error(result.error || "Image upload failed.")
      setPaths((current) => (multiple ? [...current, ...(result.paths || [])] : result.paths?.slice(0, 1) || []))
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const remove = (path: string) => setPaths((current) => current.filter((item) => item !== path))

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={paths.join("\n")} />
      <div className="flex flex-wrap items-center gap-3">
        <Input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={(event) => upload(event.target.files)} className="max-w-md" aria-describedby={`${name}-help`} />
        {uploading ? <span className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Uploading...</span> : null}
      </div>
      <p id={`${name}-help`} className="text-xs text-muted-foreground">JPG, PNG, WebP, or GIF. Maximum 5 MB per image.</p>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
      {paths.length ? <div className="flex flex-wrap gap-2">
        {paths.map((imagePath) => <div key={imagePath} className="group relative overflow-hidden rounded-lg border bg-muted">
          <img src={imagePath} alt="Uploaded preview" className="size-20 object-cover" />
          <Button type="button" size="icon" variant="destructive" className="absolute right-1 top-1 size-6 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100" onClick={() => remove(imagePath)} aria-label="Remove uploaded image"><X className="size-3" /></Button>
        </div>)}
      </div> : <p className="flex items-center gap-2 text-sm text-muted-foreground"><ImagePlus className="size-4" />No image uploaded yet.</p>}
    </div>
  )
}
