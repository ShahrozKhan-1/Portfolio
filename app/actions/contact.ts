"use server"

import { Resend } from "resend"

export async function sendContactEmail(formData: FormData) {
  // ── 1. Read & clean the key ──────────────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? ""

  // Resend keys MUST start with "re_" followed by 36 alphanumerics.
  const isLikelyValid = /^re_[A-Za-z0-9]{36}$/.test(apiKey)

  if (!isLikelyValid) {
    console.warn(`[contact-form] Missing or malformed RESEND_API_KEY: “${apiKey.slice(0, 8)}…”`)
    return {
      success: false,
      message:
        "Email service isn’t configured yet. Please add a valid RESEND_API_KEY in your Vercel dashboard (Project → Settings → Environment Variables) and redeploy.",
    }
  }

  const resend = new Resend(apiKey)

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  if (!name || !email || !subject || !message) {
    return {
      success: false,
      message: "Please fill in all fields.",
    }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    }
  }

  try {
    console.log("Attempting to send email with API key:", apiKey.substring(0, 10) + "...")

    const { data, error } = await resend.emails.send({
      from: "Shahroz Khan Portfolio <onboarding@resend.dev>",
      to: ["shahrozkha83@gmail.com"],
      reply_to: email, // This allows Shahroz to reply directly to the sender
      subject: `Portfolio Contact: ${subject}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0 0 8px 0; font-size: 16px;">From:</h3>
            <p style="color: #6b7280; margin: 0; font-size: 18px; font-weight: 600;">${name}</p>
            <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 14px;">${email}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0 0 8px 0; font-size: 16px;">Subject:</h3>
            <p style="color: #6b7280; margin: 0; font-size: 16px; font-weight: 500;">${subject}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0 0 8px 0; font-size: 16px;">Message:</h3>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 6px; border-left: 4px solid #9333ea;">
              <p style="color: #374151; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px; text-align: center;">
              This email was sent from your portfolio contact form.<br>
              Reply directly to this email to respond to ${name}.
            </p>
          </div>
        </div>
      </div>
    `,
      text: `
New Contact Form Submission

From: ${name} (${email})
Subject: ${subject}

Message:
${message}

---
Reply directly to this email to respond to ${name}.
    `,
    })

    console.log("Resend response:", { data, error })

    if (error) {
      console.error("Resend API error:", error)
      return {
        success: false,
        message: `Failed to send email: ${error.message || "Unknown error"}`,
      }
    }

    console.log("Email sent successfully:", data)
    return {
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
    }
  } catch (error: any) {
    console.error("Email sending error:", error)
    // Graceful fallback – return a “mailto:” link users can click
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const body = formData.get("message") as string

    return {
      success: true,
      message: "The automated email service is temporarily unavailable. Click below to open your email client instead.",
      mailtoLink: `mailto:shahrozkha83@gmail.com?subject=${encodeURIComponent(
        `Portfolio Contact: ${subject}`,
      )}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${body}`)}`,
    }
  }
}
