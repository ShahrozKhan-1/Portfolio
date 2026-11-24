"use client"

import { sendContactEmail } from "./actions/contact"
import { SiteNav } from "@/components/site/site-nav"
import { Hero } from "@/components/site/hero"
import { About } from "@/components/site/about"
import { Skills } from "@/components/site/skills"
import { Statement } from "@/components/site/statement"
import { Projects } from "@/components/site/projects"
import { Testimonials } from "@/components/site/testimonials"
import { Contact } from "@/components/site/contact"
import { SiteFooter } from "@/components/site/footer"
import { useContactForm } from "@/hooks/use-contact-form"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import { profilePageSchema } from "@/lib/seo"

const profileStructuredData = {
  "@context": "https://schema.org",
  "@graph": [profilePageSchema()],
}

export default function Home() {
  const { visibility, profile, skills, projects, reviews, navigationSections } = usePortfolioData()
  const { contactState, isSubmitting, handleContactSubmit } = useContactForm(sendContactEmail)

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profileStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <SiteNav sections={navigationSections} projects={projects} profile={profile} />

      <main id="content">
        <Hero profile={profile} skills={skills} projects={projects} />

        {visibility.profile ? <About profile={profile} projects={projects} skills={skills} /> : null}
        {visibility.skills && skills.length ? <Skills skills={skills} /> : null}

        <Statement />

        {visibility.projects && projects.length ? <Projects projects={projects} /> : null}
        {visibility.reviews && reviews.length ? <Testimonials reviews={reviews} /> : null}

        <Contact
          profile={profile}
          contactState={contactState}
          isSubmitting={isSubmitting}
          handleContactSubmit={handleContactSubmit}
        />
      </main>

      <SiteFooter profile={profile} />
    </div>
  )
}
