import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlashcardSubjectsTable from "../components/flashcards/FlashcardSubjectsTable";
import AppModal from "../components/ui/modal";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/flashcard.css";
import GeneralFlashcardForm from "../components/flashcards/GeneralFlashcardform";

// Import services
import * as subjectService from "../services/subjectService";
import * as flashcardService from "../services/flashcardService";

export default function FlashcardsPage() {
  const [subjects, setSubjects] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
    fetchFlashcards();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await subjectService.getSubjects();
      setSubjects(data);
    } catch (err) {
      toast.error("Failed to load subjects");
    }
  };

  const fetchFlashcards = async () => {
    try {
      const data = await flashcardService.getFlashcards(); // optionally pass subjectId
      setFlashcards(data);
    } catch (err) {
      toast.error("Failed to load flashcards");
    }
  };

  const handleSelectSubject = (subject) => {
    navigate(`/flashcards/${subject._id}`);
  };

  const handleAddFlashcard = (subject = null) => {
    const sub = subject || selectedSubject || subjects[0];
    if (!sub) return;
    setSelectedSubject(sub);
    setModalOpen(true);
  };

  const handleSaveFlashcard = async (newFlashcard) => {
    try {
      if (newFlashcard._id) {
        // existing flashcard, update
        await flashcardService.updateFlashcard(newFlashcard._id, newFlashcard);
      } else {
        // create new
        await flashcardService.createFlashcard({ ...newFlashcard, subjectId: selectedSubject._id });
      }

      await fetchFlashcards(); // reload flashcards
      toast.success("Flashcard saved successfully");
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to save flashcard");
    }
  };

  return (
    <div className="flashcards-page">
      {/* Header with H1 and Add button */}
      <div className="flashcards-page-header">
        <h1>Flashcards</h1>
        <button className="add-note-btn" onClick={() => handleAddFlashcard()}>
          <FaPlus /> Add Flashcard
        </button>
      </div>


      <FlashcardSubjectsTable
        subjects={subjects}
        flashcards={flashcards}
        onSelect={handleSelectSubject}
      />
      <AppModal
        isOpen={modalOpen}                 // modal visibility
        onClose={() => setModalOpen(false)} // close handler
        title="Add Flashcard"
        maxWidth="600px"
      >
        <GeneralFlashcardForm
          subjectId={selectedSubject?._id}  // optional chaining in case not set yet
          onSuccess={(newFlashcard) => {
            handleSaveFlashcard(newFlashcard); // update flashcards state
            setModalOpen(false);               // close modal after success
          }}
          onCancel={() => setModalOpen(false)}
        />
      </AppModal>

    </div>
  );
}
