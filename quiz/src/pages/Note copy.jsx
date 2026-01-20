import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import DOMPurify from "dompurify";
import NotePDF from "../components/pdf/NotePdf";
import "../styles/note.css";

const NOTES_API = "http://localhost:3001/notes";
const SUBJECTS_API = "http://localhost:3001/subjects";

export default function NoteView() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const res = await fetch(`${NOTES_API}/${id}`);
      const data = await res.json();
      setNote(data);

      if (data.subjectId) {
        const subjectRes = await fetch(`${SUBJECTS_API}/${data.subjectId}`);
        const subjectData = await subjectRes.json();
        setSubject(subjectData);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load note");
    }
  };

  const openPdfInNewTab = async () => {
    if (!note) return;
    try {
      const blob = await pdf(<NotePDF note={note} subject={subject} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      toast.error("Failed to open PDF");
    }
  };

  if (!note) return <p>Loading note...</p>;

  return (
    <div className="note-view-page">
      <header className="note-header">
        <h2>{note.title}</h2>
        {subject && <p>Subject: {subject.name}</p>}
        <p>Status: {note.status}</p>
        <p>Last Modified: {new Date(note.lastModified).toLocaleString()}</p>
        <Link to={`/notes/${note.subjectId}`} className="back-link">
          ← Back to {subject ? subject.name : "Notes"}
        </Link>

        <div className="note-actions">
          <button className="btn btn-preview" onClick={openPdfInNewTab}>
            👁 Open PDF
          </button>

          <PDFDownloadLink
            document={<NotePDF note={note} subject={subject} />}
            fileName={`${note.title}.pdf`}
            className="btn btn-download"
          >
            {({ loading }) => (loading ? "Generating PDF..." : "⬇ Download PDF")}
          </PDFDownloadLink>
        </div>
      </header>

      <section className="note-body">
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(note.body || "<p>No content available.</p>"),
          }}
        />
      </section>
    </div>
  );
}
