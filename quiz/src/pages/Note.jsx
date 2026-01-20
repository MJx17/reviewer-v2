// src/pages/NoteView.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import DOMPurify from "dompurify";
import NotePDF from "../components/pdf/NotePdf";
import "../styles/note.css";

// Services
import { getNotes } from "../services/noteService";
import { getSubjects } from "../services/subjectService";

export default function NoteView() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [subject, setSubject] = useState(null);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    fetchNote();
  }, [id]);

  /* =========================
     Fetch Note and Subject
  ========================= */
  const fetchNote = async () => {
    try {
      const noteData = await getNotes(id); // ✅ use notesService
      setNote(noteData);

      if (noteData.subjectId) {
        const subjects = await getSubjects(); // fetch all subjects
        const subjectData = subjects.find(s => s._id === noteData.subjectId);
        setSubject(subjectData || null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load note");
    }
  };

  /* =========================
     Text-to-Speech
  ========================= */
  const speakNote = (html) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // stop any existing speech

    const temp = document.createElement("div");
    temp.innerHTML = html;
    const text = temp.innerText.replace(/\s+/g, " ").trim();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => setIsReading(false);

    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  const stopRead = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  /* =========================
     Open PDF in new tab
  ========================= */
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

        <div className="note-header-actions">
          <button
            onClick={isReading ? stopRead : () => speakNote(note.body)}
            title={isReading ? "Stop reading" : "Read note"}
            aria-label={isReading ? "Stop reading note" : "Read note aloud"}
            className={`reader-btn ${isReading ? "reading" : ""}`}
          >
            {isReading ? "⏹ Stop Reading" : "🔊 Read Note"}
          </button>

          {/* <button className="btn btn-preview" onClick={openPdfInNewTab}>
            👁 Open PDF
          </button>

          <PDFDownloadLink
            document={<NotePDF note={note} subject={subject} />}
            fileName={`${note.title}.pdf`}
            className="btn btn-download"
          >
            {({ loading }) => (loading ? "Generating PDF..." : "⬇ Download PDF")}
          </PDFDownloadLink> */}
        </div>

        <Link to={`/notes/${note.subjectId}`} className="back-link">
          ← Back to {subject ? subject.name : "Notes"}
        </Link>
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
