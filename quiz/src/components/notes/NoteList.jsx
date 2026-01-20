import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import Pagination from "../ui/pagination";
import Loading from "../ui/loading"; // ✅ import loading

const ITEMS_PER_PAGE = 9;

export default function NotesList({ subject, onAddNote, onEditNote, onDeleteNote, fetchNotes }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadNotes = async (page = 1) => {
    if (!subject?._id) return;
    setLoading(true);

    try {
      const res = await fetchNotes({ subjectId: subject._id, page, limit: ITEMS_PER_PAGE });
      setNotes(res.notes || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset page when subject changes
  useEffect(() => {
    setCurrentPage(1);
  }, [subject?._id]);

  // Fetch notes when subject or page changes
  useEffect(() => {
    loadNotes(currentPage);
  }, [subject?._id, currentPage]);

  if (!subject) return <Loading />; // ✅ show loading while subject loads

  return (
    <div className="notes-list-container">
      {/* Back link */}
      <div className="back-link-container">
        <Link to="/notes" className="back-link">
          ← Back to All Notes
        </Link>
      </div>

      {/* Header */}
      <div className="notes-list-header">
        <h3 className="notes-list-title">{subject.name}</h3>
        <button className="notes-add-note-btn" onClick={() => onAddNote(subject)}>
          <FaPlus /> Add Note
        </button>
      </div>

      {/* Notes */}
      {loading ? (
        <Loading /> // ✅ show loading while notes fetch
      ) : notes.length === 0 ? (
        <p className="empty-message">No notes for this subject yet.</p>
      ) : (
        <>
          <div className="notes-cards-wrapper">
            {notes.map(note => (
              <div key={note._id} className="notes-card">
                <div className="notes-card-header">
                  <div className="notes-card-title">{note.title}</div>
                  <div className={`notes-card-status ${note.status || "active"}`}>
                    {(note.status || "active").toUpperCase()}
                  </div>
                </div>

                <div
                  className="notes-card-body"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(note.body || "No content available."),
                  }}
                />

                <div className="notes-card-actions">
                  <Link to={`/note/${note._id}`} className="note-action-btn view">
                    <FaEye />
                  </Link>
                  <button className="note-action-btn edit" onClick={() => onEditNote(note)}>
                    <FaEdit />
                  </button>
                  <button className="note-action-btn delete" onClick={() => onDeleteNote(note)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

NotesList.propTypes = {
  subject: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onAddNote: PropTypes.func.isRequired,
  onEditNote: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
  fetchNotes: PropTypes.func.isRequired, // paginated fetch function
};
