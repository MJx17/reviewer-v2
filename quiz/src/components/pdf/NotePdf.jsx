import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { parseHtmlToPdfNodes } from "../../utils/pdfUtil";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },

});

export default function NotePDF({ note }) {
  const nodes = parseHtmlToPdfNodes(note.body || "<p>No content</p>");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {nodes
          .filter(
            (n) =>
              n &&
              typeof n === "object" &&
              !Array.isArray(n)
          )
          .map((node, i) => (
            <View key={i}>{node}</View>
          ))}
      </Page>
    </Document>
  );
}
