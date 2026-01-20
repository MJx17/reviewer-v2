import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import FlashcardList from "../components/flashcards/flashcardlist";
import AppModal from "../components/ui/modal";
import AddFlashcardForm from "../components/flashcards/AddFlashcardForm";
import { toast } from "react-toastify";
import '../styles/flashcard.css';
import FlashcardDeck from "../components/flashcards/flashcarddeck";

const SUBJECTS_API = "http://localhost:3001/subjects";

export default function SubjectFlashcardsPage() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // to refresh FlashcardList

  useEffect(() => {
    if (!subjectId) return;
    fetchSubject();
  }, [subjectId]);

  const fetchSubject = async () => {
    try {
      const res = await fetch(`${SUBJECTS_API}/${subjectId}`);
      const data = await res.json();
      setSubject(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subject");
    }
  };

  // === Open modal for editing an existing card ===
  const handleEdit = (card) => {
    setSelectedFlashcard(card);
    setModalOpen(true);
  };

  // === Open modal for creating a new card ===
  const handleAddFlashcard = () => {
    setSelectedFlashcard(null); // no card selected
    setModalOpen(true);
  };

  // === After save (add or edit) ===
  const handleSaveFlashcard = () => {
    setModalOpen(false);
    setSelectedFlashcard(null);
    setRefreshKey(prev => prev + 1); // refresh the FlashcardList
  };

  const handleCancelEdit = () => {
    setModalOpen(false);
    setSelectedFlashcard(null);
  };

  if (!subjectId) return <p>No subject selected.</p>;
  if (!subject) return <p>Loading subject...</p>;

  return (
    <div className="subject-flashcards-page">

      <div className="subject-flashcard-headers">
        <div className="flashcards-subject-back">
          <Link to="/flashcards" className="back-link">
            ← Back to Subjects
          </Link>
        </div>
        <div className="flashcards-subject-page-header">
          <h2>{subject.name}</h2>
          <button className="add-note-btn" onClick={handleAddFlashcard}>
            + Add Flashcard
          </button>
        </div>
      </div>



      <FlashcardDeck
        subjectId={subjectId}
        refreshKey={refreshKey}
        onEdit={handleEdit}
        onDeleted={(deletedId) =>
          setFlashcards((prev) => prev.filter((f) => f._id !== deletedId))
        }
      />

      {/* <FlashcardList
        subjectId={subjectId}
        refreshKey={refreshKey}
        onEdit={handleEdit}
        onDeleted={(deletedId) =>
          setFlashcards((prev) => prev.filter((f) => f._id !== deletedId))
        }
      /> */}



      <AppModal
        isOpen={modalOpen}
        onClose={handleCancelEdit}
        title={selectedFlashcard ? "Edit Flashcard" : "Add Flashcard"}
        maxWidth="600px"
      >
        <AddFlashcardForm
          flashcard={selectedFlashcard}
          subjectId={subjectId}
          onSuccess={handleSaveFlashcard}
          onCancel={handleCancelEdit}
        />
      </AppModal>

    </div>
  );
}
