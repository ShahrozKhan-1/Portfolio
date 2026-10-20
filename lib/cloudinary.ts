import "server-only"

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"])

function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.")
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true })
  return cloudinary
}

function hasValidSignature(buffer: Buffer, mimeType: string) {
  if (mimeType === "image/jpeg") return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  if (mimeType === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  if (mimeType === "image/webp") return buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP"
  if (mimeType === "image/avif") return buffer.subarray(4, 8).toString() === "ftyp" && ["avif", "avis"].includes(buffer.subarray(8, 12).toString())
  return false
}

export function validateImage(buffer: Buffer, mimeType: string) {
  if (!allowedMimeTypes.has(mimeType) || !hasValidSignature(buffer, mimeType)) {
    throw new Error("Only valid JPG, PNG, WebP, or AVIF images are supported.")
  }
  if (buffer.length === 0 || buffer.length > MAX_FILE_SIZE) {
    throw new Error("Each image must be smaller than 5 MB.")
  }
}

export async function uploadPortfolioImage(file: File, folder: "projects" | "profile" | "testimonials"): Promise<Pick<UploadApiResponse, "secure_url" | "public_id" | "resource_type" | "format">> {
  const buffer = Buffer.from(await file.arrayBuffer())
  validateImage(buffer, file.type)
  const configuredCloudinary = getCloudinary()

  return new Promise((resolve, reject) => {
    const upload = configuredCloudinary.uploader.upload_stream(
      { folder: `portfolio/${folder}`, resource_type: "image", overwrite: false },
      (error, result) => {
        if (error || !result?.secure_url || !result.public_id) {
          reject(new Error("Cloudinary could not store this image."))
          return
        }
        resolve({ secure_url: result.secure_url, public_id: result.public_id, resource_type: result.resource_type, format: result.format })
      },
    )
    upload.end(buffer)
  })
}
