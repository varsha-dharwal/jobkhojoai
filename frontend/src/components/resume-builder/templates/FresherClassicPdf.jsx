import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#1a1a1a" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold" },
  links: { fontSize: 9, color: "#0057D9", marginTop: 2 },
  headerRight: { alignItems: "flex-end" },
  contact: { fontSize: 9, color: "#333" },
  title: { fontSize: 10.5, marginTop: 4, color: "#333" },
  rule: { borderBottomWidth: 1, borderBottomColor: "#999", marginVertical: 8 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 4, textTransform: "uppercase" },
  section: { marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  itemTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  itemMeta: { fontSize: 9, color: "#333" },
  rowRight: { fontSize: 9, color: "#333" },
  bullet: { fontSize: 9.5, marginBottom: 2, lineHeight: 1.35 },
  item: { marginBottom: 6 },
});

function Bullet({ children }) {
  if (!children) return null;
  return <Text style={styles.bullet}>• {children}</Text>;
}

function dateRange(start, end) {
  return [start, end].filter(Boolean).join(" – ");
}

export default function FresherClassicPdf({ resume }) {
  const { personal, education, skills, projects, hasInternship, internship, certifications, summary } = resume;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.name}>{personal.fullName || "Full Name"}</Text>
            <Text style={styles.links}>{[personal.linkedin, personal.github, personal.portfolio].filter(Boolean).join(" | ")}</Text>
          </View>
          <View style={styles.headerRight}>
            {personal.email ? <Text style={styles.contact}>Email: {personal.email}</Text> : null}
            {personal.phone ? <Text style={styles.contact}>Mobile: {personal.phone}</Text> : null}
          </View>
        </View>
        {personal.targetTitle ? <Text style={styles.title}>{personal.targetTitle}</Text> : null}
        <View style={styles.rule} />

        {(education.degree || education.college) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.row}>
              <View>
                <Text style={styles.itemTitle}>{education.college}</Text>
                <Text style={styles.itemMeta}>{education.degree}{education.fieldOfStudy ? `, ${education.fieldOfStudy}` : ""}{education.cgpa ? ` — GPA: ${education.cgpa}` : ""}</Text>
              </View>
              <View style={styles.headerRight}>
                {personal.city ? <Text style={styles.rowRight}>{personal.city}</Text> : null}
                <Text style={styles.rowRight}>{dateRange(education.startYear, education.gradYear)}</Text>
              </View>
            </View>
          </View>
        ) : null}

        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.bullet}>{summary}</Text>
          </View>
        ) : null}

        {Object.values(skills || {}).some((l) => l?.length) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills Summary</Text>
            {skills.languages?.length ? <Bullet>Languages: {skills.languages.join(", ")}</Bullet> : null}
            {skills.frameworks?.length ? <Bullet>Frameworks: {skills.frameworks.join(", ")}</Bullet> : null}
            {skills.tools?.length ? <Bullet>Tools: {skills.tools.join(", ")}</Bullet> : null}
            {skills.platforms?.length ? <Bullet>Platforms: {skills.platforms.join(", ")}</Bullet> : null}
            {skills.softSkills?.length ? <Bullet>Soft Skills: {skills.softSkills.join(", ")}</Bullet> : null}
          </View>
        ) : null}

        {hasInternship && (internship.company || internship.role) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <View style={styles.row}>
              <Text style={styles.itemTitle}>{internship.role}{internship.company ? ` | ${internship.company}` : ""}</Text>
              <Text style={styles.rowRight}>{dateRange(internship.startDate, internship.endDate)}</Text>
            </View>
            {(internship.bullets || []).filter(Boolean).map((b, i) => <Bullet key={i}>{b}</Bullet>)}
          </View>
        ) : null}

        {(projects || []).length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((p) => (
              <View key={p.id} style={styles.item}>
                <View style={styles.row}>
                  <Text style={styles.itemTitle}>{p.name}{p.tech ? ` | ${p.tech}` : ""}</Text>
                  <Text style={styles.rowRight}>{dateRange(p.startDate, p.endDate)}</Text>
                </View>
                <Bullet>{p.description}</Bullet>
                <Bullet>{p.contribution}</Bullet>
              </View>
            ))}
          </View>
        ) : null}

        {(certifications || []).length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certificates</Text>
            {certifications.map((c) => (
              <View key={c.id} style={styles.row}>
                <Text style={styles.itemTitle}>{c.name}{c.org ? ` | ${c.org}` : ""}</Text>
                <Text style={styles.rowRight}>{c.year}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
