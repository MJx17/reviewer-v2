import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NotesList from "../components/notes/NoteList";
import NoteForm from "../components/notes/noteform";
import AppModal from "../components/ui/modal";
import ConfirmModal from "../components/ui/confirmModal";
import { toast } from "react-toastify";

import { getNotes, createNote, updateNote, deleteNote } from "../services/noteService";
import { getSubjects } from "../services/subjectService";
import "../styles/subject-notes.css";

export default function SubjectNotesPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);

  /* =========================
     Fetch Subject & Notes
  ========================= */
  useEffect(() => {
    fetchSubject();
  }, [subjectId]);

  useEffect(() => {
    if (subject) fetchNotes(currentPage);
  }, [subject, currentPage]);

  const fetchSubject = async () => {
    try {
      const data = await getSubjects(subjectId);
      if (!data) throw new Error("Subject not found");
      setSubject(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subject");
      navigate("/notes");
    }
  };

  const fetchNotes = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getNotes({ subjectId, page, limit: 9 });
      setNotes(res.notes || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CRUD Handlers
  ========================= */
  const handleAddNote = () => {
    setEditingNote({ subjectId });
    setModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleSaveNote = async (note) => {
    try {
      if (note._id) {
        await updateNote(note._id, note);
        toast.success("Note updated");
      } else {
        await createNote(note);
        toast.success("Note created");
      }
      setModalOpen(false);
      setEditingNote(null);
      fetchNotes(currentPage);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save note");
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      setLoadingDelete(true);
      await deleteNote(id);
      toast.success("Note deleted");
      fetchNotes(currentPage);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete note");
    } finally {
      setLoadingDelete(false);
      setDeleteModalOpen(false);
      setNoteToDelete(null);
    }
  };

  if (!subject) return null;

  return (
    <div className="subject-notes-wrapper">
      <div className="subject-notes-page">

        <NotesList
          subject={subject}
          notes={notes}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onAddNote={handleAddNote}
          onEditNote={handleEditNote}
          onDeleteNote={(note) => {
            setNoteToDelete(note);
            setDeleteModalOpen(true);
          }}
        />

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Note"
          message="Are you sure you want to delete this note?"
          onConfirm={() => noteToDelete && handleDeleteNote(noteToDelete._id)}
          onCancel={() => setDeleteModalOpen(false)}
          loading={loadingDelete}
        />

        {/* Add/Edit Note Modal */}
        <AppModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingNote(null);
          }}
          title={editingNote?._id ? "Edit Note" : "Add Note"}
        >
          {editingNote && (
            <NoteForm
              key={editingNote._id || "new"}
              note={editingNote}
              subjects={[subject]}
              onSubmit={handleSaveNote}
              onCancel={() => setModalOpen(false)}
            />
          )}
        </AppModal>

      </div>
    </div>
  );
}
