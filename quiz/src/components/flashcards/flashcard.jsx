import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlashcardSubjectsTable from "../components/flashcards/FlashcardSubjectsTable";
import { toast } from "react-toastify";
import "../styles/notes.css";

// ✅ import API helpers
import { getFlashcards } from "../services/flashcardService";
import { getSubjects } from "../services/subjectService";

export default function FlashcardsPage() {
  const [subjects, setSubjects] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
    fetchFlashcards();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      toast.error("Failed to load subjects");
    }
  };

  const fetchFlashcards = async () => {
    try {
      const data = await getFlashcards();
      setFlashcards(data);
    } catch (err) {
      toast.error("Failed to load flashcards");
    }
  };

  const handleSelectSubject = (subject) => {
    navigate(`/flashcards/${subject._id}`);
  };

  return (
    <div className="flashcards-page">
      <FlashcardSubjectsTable
        subjects={subjects}
        flashcards={flashcards}
        onSelect={handleSelectSubject}
      />
    </div>
  );
}

