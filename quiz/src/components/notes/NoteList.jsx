import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import Pagination from "../ui/pagination";
import Loading from "../ui/loading";

export default function NotesList({
  subject,
  notes,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onAddNote,
  onEditNote,
  onDeleteNote
}) {
  if (!subject) return <Loading />;

  return (
    <div className="notes-list-container">
      {/* Header */}
      <div className="notes-list-header">
        <h3 className="notes-list-title">{subject.name}</h3>
        <button className="notes-add-note-btn" onClick={onAddNote}>
          <FaPlus /> Add Note
        </button>
      </div>

      {/* Notes */}
      {loading ? (
        <Loading />
      ) : notes.length === 0 ? (
        <p className="empty-message">No notes for this subject yet.</p>
      ) : (
        <>
          <div className="notes-cards-wrapper">
            {notes.map((note) => (
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
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          )}
        </>
      )}
    </div>
  );
}

NotesList.propTypes = {
  subject: PropTypes.object.isRequired,
  notes: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onAddNote: PropTypes.func.isRequired,
  onEditNote: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func.isRequired
};
