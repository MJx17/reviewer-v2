import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlashcardSubjectsTable from "../components/flashcards/FlashcardSubjectsTable";
import { toast } from "react-toastify";
import "../styles/notes.css"; // you can reuse styles

const SUBJECTS_API = "http://localhost:3001/subjects";
const FLASHCARDS_API = "http://localhost:3001/flashcards";

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
      const res = await fetch(SUBJECTS_API);
      setSubjects(await res.json());
    } catch {
      toast.error("Failed to load subjects");
    }
  };

  const fetchFlashcards = async () => {
    try {
      const res = await fetch(FLASHCARDS_API);
      setFlashcards(await res.json());
    } catch {
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
