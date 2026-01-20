import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  meta: {
    fontSize: 10,
    color: "#555",
    marginBottom: 20,
  },
  body: {
    lineHeight: 1.6,
  },
});

export default function NotePDF({ note, subject }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{note.title}</Text>
        {subject && <Text style={styles.meta}>Subject: {subject.name}</Text>}
        <Text style={styles.meta}>
          Last Modified: {new Date(note.lastModified).toLocaleString()}
        </Text>
        <Text style={styles.body}>{note.body}</Text>
      </Page>
    </Document>
  );
}
