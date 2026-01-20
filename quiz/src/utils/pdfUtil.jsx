import { Text, View, Image, Link } from "@react-pdf/renderer";
import { parseDocument } from "htmlparser2";

/* ================= STYLES ================= */

const styles = {
  p: { fontSize: 12, marginBottom: 6, lineHeight: 1.6 },
  h1: { fontSize: 24, marginBottom: 10, fontWeight: "bold" },
  h2: { fontSize: 18, marginBottom: 8, fontWeight: "bold" },

  strong: { fontWeight: "bold" },
  em: { fontStyle: "italic" },
  link: { color: "blue", textDecoration: "underline" },

  ul: { marginBottom: 6 },
  li: { flexDirection: "row", marginBottom: 2 },
  bullet: { width: 12 },

  imgWrap: { marginVertical: 10, alignItems: "center" },
  img: { maxWidth: "100%", objectFit: "contain" },

  table: { marginVertical: 10, borderWidth: 1 },
  row: { flexDirection: "row" },
  cell: { flex: 1, borderWidth: 1, padding: 4, fontSize: 11 },
};

/* ================= URL DETECTION ================= */

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

/* ================= INLINE ================= */

function renderInline(nodes = []) {
  return nodes.flatMap((n, i) => {
    // TEXT NODE
    if (n.type === "text") {
      const text = n.data.replace(/\s+/g, " ").trim();
      if (!text) return [];

      return text.split(URL_REGEX).map((part, idx) => {
        if (URL_REGEX.test(part)) {
          return (
            <Link key={`${i}-${idx}`} src={part} style={styles.link}>
              {part}
            </Link>
          );
        }
        return <Text key={`${i}-${idx}`}>{part}</Text>;
      });
    }

    // TAG NODE
    if (n.type === "tag") {
      const children = renderInline(n.children || []);

      switch (n.name) {
        case "strong":
          return <Text key={i} style={styles.strong}>{children}</Text>;

        case "em":
          return <Text key={i} style={styles.em}>{children}</Text>;

        case "a":
          return (
            <Link key={i} src={n.attribs?.href} style={styles.link}>
              {children}
            </Link>
          );

        default:
          return children;
      }
    }

    return [];
  });
}

/* ================= TABLE ================= */

function extractRows(node) {
  if (!node.children) return [];
  return node.children.flatMap(child => {
    if (child.name === "tr") return [child];
    if (["thead", "tbody"].includes(child.name)) return extractRows(child);
    return [];
  });
}

function renderTable(node, key) {
  const rows = extractRows(node);

  return (
    <View key={key} style={styles.table}>
      {rows.map((tr, i) => (
        <View key={i} style={styles.row}>
          {tr.children
            .filter(c => c.type === "tag")
            .map((cell, j) => (
              <Text key={j} style={styles.cell}>
                {renderInline(cell.children)}
              </Text>
            ))}
        </View>
      ))}
    </View>
  );
}

/* ================= BLOCK ================= */

function renderNode(node, key) {
  if (node.type === "text") return null;
  if (node.type !== "tag") return null;

  switch (node.name) {
    case "h1":
      return <Text key={key} style={styles.h1}>{renderInline(node.children)}</Text>;

    case "h2":
      return <Text key={key} style={styles.h2}>{renderInline(node.children)}</Text>;

    case "p": {
      const content = renderInline(node.children);
      if (!content.length) return null;
      return <Text key={key} style={styles.p}>{content}</Text>;
    }

    case "ul":
      return (
        <View key={key} style={styles.ul}>
          {node.children
            .filter(c => c.name === "li")
            .map((li, i) => (
              <View key={i} style={styles.li}>
                <Text style={styles.bullet}>•</Text>
                <Text>{renderInline(li.children)}</Text>
              </View>
            ))}
        </View>
      );

    case "img":
      if (!node.attribs?.src) return null;
      return (
        <View key={key} style={styles.imgWrap}>
          <Image src={node.attribs.src} style={styles.img} />
        </View>
      );

    case "table":
      return renderTable(node, key);

    default:
      return null;
  }
}

/* ================= ENTRY ================= */

export function parseHtmlToPdfNodes(html = "") {
  const dom = parseDocument(html);

  return dom.children
    .map((node, i) => renderNode(node, i))
    .filter(Boolean);
}
