// src/pages/NoteView.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import "../styles/note.css";
import Loading from "../components/ui/loading"
// Services
import { getNoteById } from "../services/noteService";

// Utility for sanitizing HTML
const sanitizeHtml = (html, fallback = "<p>No content available.</p>") =>
  html && html.trim() ? DOMPurify.sanitize(html) : fallback;

export default function NoteView() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReading, setIsReading] = useState(false);

  // Fetch note on mount or when id changes
  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        const noteData = await getNoteById(id); // ✅ Fetch single note
        setNote(noteData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);


  const noteBodyRef = useRef(null);


  useEffect(() => {
    if (!noteBodyRef.current || !note || !note.body) return; // Add note and note.body check

    // Wait for content to be fully rendered
    const timeoutId = setTimeout(() => {
      const tables = noteBodyRef.current.querySelectorAll('table');
      console.log('Found tables:', tables.length); // Debug log

      tables.forEach((table) => {
        // Check if already wrapped
        if (table.parentElement.classList.contains('table-wrapper')) {
          console.log('Table already wrapped');
          return;
        }

        console.log('Wrapping table'); // Debug log
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      });
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timeoutId);
  }, [note]); // Change back to just note, or keep note?.body
  /* =========================
     Text-to-Speech
  ========================= */
  const speakNote = (html) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

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

  if (loading) return <Loading />;
  if (!note) return <p>Note not found.</p>;

  return (
    <div className="note-view-page">
      <header className="note-header">
        <h2>{note.title}</h2>
        {note.subjectId && <p>Subject: {note.subjectId.name}</p>}
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
        </div>

        <Link
          to={`/notes/${note.subjectId?._id}`}
          className="back-link"
        >
          ← Back to {note.subjectId?.name || "Notes"}
        </Link>
      </header>

      <section className="note-body" ref={noteBodyRef}>
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(note.body),
          }}
        />
      </section>

    </div>
  );
}
