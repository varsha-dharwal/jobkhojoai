import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 9.5, fontFamily: "Helvetica", color: "#1a1a1a" },
  header: { marginBottom: 10, borderBottomWidth: 1.5, borderBottomColor: "#1a1a1a", paddingBottom: 8 },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold" },
  title: { fontSize: 11, marginTop: 2 },
  contact: { fontSize: 8.5, marginTop: 4, color: "#444" },
  sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 },
  section: { marginBottom: 7 },
  itemTitle: { fontSize: 9.5, fontFamily: "Helvetica-Bold" },
  itemMeta: { fontSize: 8.5, color: "#444", marginBottom: 2 },
  bullet: { fontSize: 9, marginBottom: 2, lineHeight: 1.3 },
  item: { marginBottom: 5 },
});

function Line({ children }) {
  if (!children) return null;
  return <Text style={styles.bullet}>{children}</Text>;
}

export default function FresherMinimalPdf({ resume }) {
  const { personal, education, skills, projects, hasInternship, internship, certifications, summary } = resume;
  const contactBits = [personal.city, personal.phone, personal.email, personal.linkedin, personal.github].filter(Boolean);
  const allSkills = Object.values(skills || {}).flat().filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
          <Text style={styles.title}>{personal.targetTitle || ""}</Text>
          {contactBits.length ? <Text style={styles.contact}>{contactBits.join("  ·  ")}</Text> : null}
        </View>

        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Line>{summary}</Line>
          </View>
        ) : null}

        {allSkills.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Line>{allSkills.join("  •  ")}</Line>
          </View>
        ) : null}

        {(projects || []).length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((p) => (
              <View key={p.id} style={styles.item}>
                <Text style={styles.itemTitle}>{p.name}{p.tech ? ` — ${p.tech}` : ""}</Text>
                <Line>{p.description}</Line>
                <Line>{p.contribution}</Line>
              </View>
            ))}
          </View>
        ) : null}

        {hasInternship && (internship.company || internship.role) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <Text style={styles.itemTitle}>{internship.role} · {internship.company}</Text>
            <Text style={styles.itemMeta}>{internship.startDate} – {internship.endDate}</Text>
            {(internship.bullets || []).filter(Boolean).map((b, i) => <Line key={i}>{b}</Line>)}
          </View>
        ) : null}

        {(education.degree || education.college) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <Text style={styles.itemTitle}>{education.degree}{education.fieldOfStudy ? `, ${education.fieldOfStudy}` : ""} · {education.college}</Text>
            <Text style={styles.itemMeta}>
              {education.startYear}{education.startYear ? " – " : ""}{education.gradYear}{education.cgpa ? `  ·  ${education.cgpa}` : ""}
            </Text>
          </View>
        ) : null}

        {(certifications || []).length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <Line>{certifications.map((c) => `${c.name}${c.org ? ` — ${c.org}` : ""}`).join("  ·  ")}</Line>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
