import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

Font.registerHyphenationCallback((word) => [word])

const styles = StyleSheet.create({
  page: {
    paddingTop: 54,
    paddingRight: 54,
    paddingBottom: 54,
    paddingLeft: 54,
    fontFamily: "Helvetica",
    fontSize: 10.75,
    lineHeight: 1.42,
    color: "#202027",
  },
  sectionHeading: {
    marginTop: 13,
    marginBottom: 5,
    fontFamily: "Helvetica-Bold",
    fontSize: 11.5,
    letterSpacing: 0.45,
    color: "#302b37",
  },
  bullet: {
    paddingLeft: 12,
    textIndent: -9,
    marginBottom: 2,
  },
  paragraph: {
    marginBottom: 3,
  },
})

const headings = new Set(["SUMMARY", "EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS"])

function pdfSafeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\xFF]/g, "")
}

export function ResumeDocument({ resume, pageSize }: { resume: string; pageSize: "A4" | "LETTER" }) {
  const lines = pdfSafeText(resume).split(/\r?\n/)

  return (
    <Document
      title="Shahroz Khan Resume"
      author="Shahroz Khan"
      subject="Professional resume"
      creator="Shahroz Khan Resume Tools"
    >
      <Page size={pageSize} style={styles.page}>
        {lines.map((line, index) => {
          const text = line.trim()
          if (!text) return <View key={`space-${index}`} style={{ height: 4 }} />

          const heading = text.replace(/:$/, "").toUpperCase()
          if (headings.has(heading)) {
            return <Text key={`heading-${index}`} style={styles.sectionHeading}>{heading}</Text>
          }
          if (text.startsWith("- ")) {
            return <Text key={`bullet-${index}`} style={styles.bullet}>{`•  ${text.slice(2)}`}</Text>
          }
          return <Text key={`paragraph-${index}`} style={styles.paragraph}>{text}</Text>
        })}
      </Page>
    </Document>
  )
}
