import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const THEMES = {
  "ats-simple": { accent: "#172033", header: "#ffffff", page: "#ffffff", rule: "#64748b", headerStyle: "plain" },
  "modern-professional": { accent: "#1d4ed8", header: "#eff6ff", page: "#ffffff", rule: "#93c5fd", headerStyle: "modern" },
  "entry-level-tech": { accent: "#0f3d70", header: "#eaf4ff", page: "#ffffff", rule: "#38bdf8", headerStyle: "tech" },
};

function dateRange(start, end) { return [start, end].filter(Boolean).join(" – "); }
function text(value) { return value == null ? "" : String(value); }

export default function FresherVariantPdf({ resume, variant = "ats-simple" }) {
  const theme = THEMES[variant] || THEMES["ats-simple"];
  const styles = StyleSheet.create({
    page: { padding: 38, fontSize: 9.5, fontFamily: "Helvetica", color: "#1f2937", backgroundColor: theme.page },
    header: { marginBottom: 11, padding: theme.headerStyle === "plain" ? 0 : 12, backgroundColor: theme.header, borderBottomWidth: theme.headerStyle === "plain" ? 1 : 0, borderBottomColor: theme.rule, borderLeftWidth: theme.headerStyle === "tech" ? 4 : 0, borderLeftColor: theme.accent },
    name: { color: theme.accent, fontSize: theme.headerStyle === "modern" ? 21 : 19, fontFamily: "Helvetica-Bold", textAlign: theme.headerStyle === "plain" ? "left" : "center" },
    title: { marginTop: 3, color: "#475569", fontSize: 10, textAlign: theme.headerStyle === "plain" ? "left" : "center" },
    contact: { marginTop: 5, color: "#475569", fontSize: 8.5, textAlign: theme.headerStyle === "plain" ? "left" : "center" },
    section: { marginTop: 8 },
    heading: { marginBottom: 4, paddingBottom: 2, borderBottomWidth: 0.8, borderBottomColor: theme.rule, color: theme.accent, fontSize: 10, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.45 },
    row: { marginBottom: 5 },
    itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
    meta: { marginTop: 1, marginBottom: 2, color: "#64748b", fontSize: 8.5 },
    body: { marginBottom: 2, fontSize: 9.2, lineHeight: 1.3 },
    bullet: { marginLeft: 8, marginBottom: 2, fontSize: 9, lineHeight: 1.25 },
    skills: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
    skill: { padding: 3, borderRadius: 2, backgroundColor: theme.header, color: theme.accent, fontSize: 8.4 },
  });
  const { personal = {}, education = {}, skills = {}, projects = [], hasInternship, internship = {}, certifications = [], summary = "" } = resume || {};
  const allSkills = Object.values(skills).flat().filter(Boolean);
  const contact = [personal.city, personal.email, personal.phone, personal.linkedin, personal.github, personal.portfolio].filter(Boolean).join("  ·  ");
  return <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{personal.fullName || "Full Name"}</Text>
        {personal.targetTitle ? <Text style={styles.title}>{personal.targetTitle}</Text> : null}
        {contact ? <Text style={styles.contact}>{contact}</Text> : null}
      </View>
      {summary ? <View style={styles.section}><Text style={styles.heading}>Professional Summary</Text><Text style={styles.body}>{summary}</Text></View> : null}
      {allSkills.length ? <View style={styles.section}><Text style={styles.heading}>{variant === "entry-level-tech" ? "Technical Skills" : "Skills"}</Text><View style={styles.skills}>{allSkills.map((item, index) => <Text key={`${item}-${index}`} style={styles.skill}>{item}</Text>)}</View></View> : null}
      {projects.length ? <View style={styles.section}><Text style={styles.heading}>{variant === "entry-level-tech" ? "Selected Projects" : "Projects"}</Text>{projects.map((item, index) => <View key={item.id || index} style={styles.row}><Text style={styles.itemTitle}>{text(item.name)}{item.tech ? ` · ${item.tech}` : ""}</Text>{item.description ? <Text style={styles.bullet}>• {item.description}</Text> : null}{item.contribution ? <Text style={styles.bullet}>• {item.contribution}</Text> : null}</View>)}</View> : null}
      {hasInternship && (internship.company || internship.role) ? <View style={styles.section}><Text style={styles.heading}>Experience</Text><View style={styles.row}><Text style={styles.itemTitle}>{text(internship.role)}{internship.company ? ` · ${internship.company}` : ""}</Text><Text style={styles.meta}>{dateRange(internship.startDate, internship.endDate)}</Text>{(internship.bullets || []).filter(Boolean).map((item, index) => <Text key={index} style={styles.bullet}>• {item}</Text>)}</View></View> : null}
      {(education.degree || education.college) ? <View style={styles.section}><Text style={styles.heading}>Education</Text><View style={styles.row}><Text style={styles.itemTitle}>{text(education.degree)}{education.fieldOfStudy ? `, ${education.fieldOfStudy}` : ""}</Text><Text style={styles.body}>{text(education.college)}</Text><Text style={styles.meta}>{dateRange(education.startYear, education.gradYear)}{education.cgpa ? ` · GPA: ${education.cgpa}` : ""}</Text></View></View> : null}
      {certifications.length ? <View style={styles.section}><Text style={styles.heading}>Certifications</Text>{certifications.filter(Boolean).map((item, index) => <Text key={item.id || index} style={styles.body}>• {item.name}{item.org ? ` · ${item.org}` : ""}{item.year ? ` · ${item.year}` : ""}</Text>)}</View> : null}
    </Page>
  </Document>;
}
