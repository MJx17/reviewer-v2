import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import * as PropTypes from "prop-types";
import DOMPurify from "dompurify";


export default function NotesList({ subject, notes, onAddNote, onEditNote, onDeleteNote }) {

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

      {notes.length === 0 ? (
        <p className="empty-message">No notes for this subject yet.</p>
      ) : (
        <div className="notes-cards-wrapper">
          {notes.map(note => {
            const status = note.status || "active"; // default to active

            return (
              <div key={note._id} className="notes-card">
                <div className="notes-card-header">
                  <div className="notes-card-title">{note.title}</div>
                  <div className={`notes-card-status ${status}`}>
                    {status.toUpperCase()}
                  </div>
                </div>

                <div
                  className="notes-card-body"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(note.body || "No content available.")
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
            );
          })}
        </div>
      )}
    </div>
  );
}

NotesList.propTypes = {
  subject: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string,
      lastModified: PropTypes.string,
      status: PropTypes.oneOf(["active", "archived", "learning", "completed", "review"]),
    })
  ).isRequired,
  onAddNote: PropTypes.func.isRequired,
  onEditNote: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired,
};
