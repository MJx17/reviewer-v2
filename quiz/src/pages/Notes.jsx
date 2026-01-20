// src/pages/NotesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubjectsTable from "../components/notes/NotesSubjectTable";
import AppModal from "../components/ui/modal";
import GeneralNoteForm from "../components/notes/generalNoteform";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/notes.css";

// Services
import { getSubjects } from "../services/subjectService";
import { getNotes, createNote } from "../services/noteService";

export default function NotesPage() {
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();

  /* =========================
     Fetch data
  ========================= */
  useEffect(() => {
    fetchSubjectsAndNotes();
  }, []);

  const fetchSubjectsAndNotes = async () => {
    try {
      const [subjectData, noteData] = await Promise.all([
        getSubjects(),
        getNotes()
      ]);
      setSubjects(subjectData);
      setNotes(noteData);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  /* =========================
     Handlers
  ========================= */
  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    navigate(`/notes/${subject._id}`);
  };

  const handleAddNote = () => {
    if (!subjects.length) return;
    setSelectedSubject(subjects[0]); // default to first subject
    setModalOpen(true);
  };

  const handleSaveNote = async (note) => {
    try {
      await createNote(note); // ✅ use notesService
      setModalOpen(false);
      fetchSubjectsAndNotes(); // reload data
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
      {/* Header */}
      <div className="notes-page-header">
        <h1>Notes</h1>
        <button className="add-note-btn" onClick={handleAddNote}>
          <FaPlus /> Add Note
        </button>
      </div>

      <SubjectsTable
        subjects={subjects}
        notes={notes}
        onSelect={handleSelectSubject}
      />

      {/* Add Note Modal */}
      <AppModal
        isOpen={modalOpen && subjects.length > 0}
        onClose={() => setModalOpen(false)}
        title="Add Note"
      >
        <GeneralNoteForm
          subjects={subjects} // all subjects for dropdown
          note={null}
          onSubmit={handleSaveNote}
          onCancel={() => setModalOpen(false)}
        />
      </AppModal>
    </div>
  );
}
