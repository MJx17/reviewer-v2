import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotesSubjectTable from "../components/notes/NotesSubjectTable";
import AppModal from "../components/ui/modal";
import GeneralNoteForm from "../components/notes/generalNoteform";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/notes.css";

// Services
import { getSubjects } from "../services/subjectService";
import { createNote } from "../services/noteService";

export default function NotesPage() {
  const [subjects, setSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const subjectData = await getSubjects();
      setSubjects(subjectData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subjects");
    }
  };

  /* =========================
     Handlers
  ========================= */
  const handleSelectSubject = (subject) => {
    navigate(`/notes/${subject._id}`);
  };

  const handleAddNote = () => {
    if (!subjects.length) return;
    setSelectedSubject(subjects[0]); // default to first subject
    setModalOpen(true);
  };

  const handleSaveNote = async (note) => {
    try {
      await createNote(note);
      setModalOpen(false);
      fetchSubjects(); // refresh counts
      toast.success("Note added!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save note");
    }
  };

  /* =========================
     Render
  ========================= */
  return (
    <div className="notes-page">
      <div className="notes-page-header">
        <h1>Notes</h1>
        <button className="add-note-btn" onClick={handleAddNote}>
          <FaPlus /> Add Note
        </button>
      </div>

      <NotesSubjectTable
        subjects={subjects}
        onSelect={handleSelectSubject}
      />

      <AppModal
        isOpen={modalOpen && subjects.length > 0}
        onClose={() => setModalOpen(false)}
        title="Add Note"
      >
        <GeneralNoteForm
          subjects={subjects}
          note={null}
          onSubmit={handleSaveNote}
          onCancel={() => setModalOpen(false)}
        />
      </AppModal>
    </div>
  );
}
