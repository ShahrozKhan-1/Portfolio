"use server"

import { Resend } from "resend"

function getRecipientEmail(formData: FormData) {
  const fromForm = String(formData.get("recipientEmail") ?? "").trim()
  return fromForm || process.env.CONTACT_TO_EMAIL?.trim() || "shahrozkha83@gmail.com"
}

export async function sendContactEmail(formData: FormData) {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? ""

  if (!apiKey) {
    return {
      success: false,
      message:
        "Email service is not configured yet. Add a valid RESEND_API_KEY to your environment and redeploy.",
    }
  }

  const resend = new Resend(apiKey)
  const recipientEmail = getRecipientEmail(formData)

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const subject = String(formData.get("subject") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()

  if (!name || !email || !subject || !message) {
    return {
      success: false,
      message: "Please fill in all fields.",
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [recipientEmail],
      reply_to: email,
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
                This email was sent from your portfolio contact form.<br />
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

    if (error) {
      return {
        success: false,
        message: `Failed to send email: ${error.message || "Unknown error"}`,
      }
    }

    return {
      success: true,
      message: "Thank you for your message. I will get back to you soon.",
      data,
    }
  } catch (error) {
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const subject = String(formData.get("subject") ?? "").trim()
    const body = String(formData.get("message") ?? "").trim()

    return {
      success: true,
      message: "The automated email service is temporarily unavailable. Open your email client instead.",
      mailtoLink: `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(
        `Portfolio Contact: ${subject}`,
      )}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${body}`)}`,
    }
  }
}

