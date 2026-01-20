import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Pagination from "../ui/pagination";
import { getNotes } from "../../services/noteService";

const ITEMS_PER_PAGE = 9;

export default function NotesSubjectTable({ subjects, onSelect }) {
  const [page, setPage] = useState(1);
  const [notesBySubject, setNotesBySubject] = useState({});
  const [loadingSubjects, setLoadingSubjects] = useState({}); // tracks loading per subject
  const [pagination, setPagination] = useState({}); // optional if needed

  const totalPages = Math.ceil(subjects.length / ITEMS_PER_PAGE);

  const paginatedSubjects = subjects.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // fetch notes for a subject
  const fetchNotesForSubject = async (subjectId) => {
    if (loadingSubjects[subjectId] || notesBySubject[subjectId]) return;

    setLoadingSubjects((prev) => ({ ...prev, [subjectId]: true }));

    try {
      const response = await getNotes({ subjectId, page: 1, limit: 1000 }); 
      // optionally fetch all notes for counting
      const notes = Array.isArray(response.notes) ? response.notes : [];
      setNotesBySubject((prev) => ({ ...prev, [subjectId]: notes }));
      setPagination((prev) => ({ ...prev, [subjectId]: response.pagination }));
    } catch (err) {
      console.error(`Failed to fetch notes for ${subjectId}`, err);
      setNotesBySubject((prev) => ({ ...prev, [subjectId]: [] }));
    } finally {
      setLoadingSubjects((prev) => ({ ...prev, [subjectId]: false }));
    }
  };

  useEffect(() => {
    paginatedSubjects.forEach((subject) => fetchNotesForSubject(subject._id));
  }, [paginatedSubjects]);

  const getNoteCount = (subjectId) => {
    const notes = notesBySubject[subjectId];
    if (!notes) return 0;
    return notes.length;
  };

  if (!subjects || subjects.length === 0) {
    return <p className="empty-message">No subjects available. Please add a subject first.</p>;
  }

  return (
    <>
      <div className="notes-subject-cards-wrapper">
        {paginatedSubjects.map((subject) => {
          const count = getNoteCount(subject._id);
          const isLoading = loadingSubjects[subject._id];

          return (
            <div key={subject._id} className="notes-subject-card">
              <div className="notes-subject-card-header">
                <span className="notes-subject-name">{subject.name}</span>
                <span className="notes-subject-count">
                  {isLoading ? "Loading..." : `${count} ${count === 1 ? "Note" : "Notes"}`}
                </span>
              </div>

              <div className="notes-subject-card-actions">
                {count > 0 ? (
                  <button className="notes-subject-btn" onClick={() => onSelect(subject)}>
                    View
                  </button>
                ) : (
                  <span className="no-notes-text">{isLoading ? "Fetching notes..." : "No notes yet"}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}

NotesSubjectTable.propTypes = {
  subjects: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};
