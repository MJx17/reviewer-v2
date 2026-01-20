// src/components/flashcards/FlashcardSubjectsCards.jsx
import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import Pagination from "../ui/pagination";
import "../../styles/flashcardlist.css";

const ITEMS_PER_PAGE = 9;

export default function FlashcardSubjectsCards({
  subjects,
  flashcards,
  onSelect,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const getFlashcardCount = (subjectId) =>
    flashcards.filter((f) => f.subjectId === subjectId).length;

  /* =========================
     Pagination logic
  ========================= */
  const totalPages = Math.ceil(subjects.length / ITEMS_PER_PAGE);

  const paginatedSubjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return subjects.slice(start, start + ITEMS_PER_PAGE);
  }, [subjects, currentPage]);

  // Fix page when data shrinks
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [subjects, totalPages, currentPage]);

  if (!subjects || subjects.length === 0) {
    return (
      <p className="empty-message">
        No flashcard subjects available.
      </p>
    );
  }

  return (
    <>
      <div className="flashcard-subject-cards-wrapper">
        {paginatedSubjects.map((subject) => {
          const count = getFlashcardCount(subject._id);

          return (
            <div key={subject._id} className="flashcard-subject-card">
              <div className="flashcard-subject-card-header">
                <span className="flashcard-subject-name">
                  {subject.name}
                </span>
                <span className="flashcard-subject-count">
                  {count} {count === 1 ? "Flashcard" : "Flashcards"}
                </span>
              </div>

              <div className="flashcard-subject-card-actions">
                {count > 0 ? (
                  <button
                    className="flashcard-subject-btn"
                    onClick={() => onSelect(subject)}
                  >
                    View
                  </button>
                ) : (
                  <span className="flashcard-no-items-text">
                    No flashcards yet
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}

FlashcardSubjectsCards.propTypes = {
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  flashcards: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      subjectId: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
};
