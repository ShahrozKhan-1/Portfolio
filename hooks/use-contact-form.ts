"use client"

import { useState } from "react"
import type { FormEvent } from "react"

export type ContactFormState = {
  success: boolean
  message: string
}

export type ContactSubmissionHandler = (formData: FormData) => Promise<ContactFormState>

export function useContactForm(submitContact: ContactSubmissionHandler) {
  const [contactState, setContactState] = useState<ContactFormState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setContactState(null)

    const form = event.currentTarget

    try {
      const result = await submitContact(new FormData(form))
      setContactState(result)

      if (result.success) {
        form.reset()
      }
    } catch (error) {
      console.error("Contact form submission failed.", error)
      setContactState({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return { contactState, isSubmitting, handleContactSubmit }
}
