import { useState, useEffect, useMemo } from "react";
import SubjectForm from "./SubjectForm";
import SubjectItem from "./SubjectItem";
import AppModal from "../ui/modal";
import ConfirmModal from "../ui/confirmModal";
import Pagination from "../ui/pagination";
import { toast } from "react-toastify";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "../../services/subjectService";

const ITEMS_PER_PAGE = 8;

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  /* =========================
     Fetch subjects
  ========================= */
  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch subjects");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  /* =========================
     Pagination logic
  ========================= */
  const totalPages = Math.ceil(subjects.length / ITEMS_PER_PAGE);

  const paginatedSubjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return subjects.slice(start, start + ITEMS_PER_PAGE);
  }, [subjects, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [subjects, totalPages, currentPage]);

  /* =========================
     Handlers
  ========================= */
  const handleCreate = () => {
    setEditingSubject(null);
    setShowModal(true);
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setShowModal(true);
  };

  const handleSubmit = async (subject) => {
    try {
      if (editingSubject) {
        await updateSubject(editingSubject._id, subject);
        toast.success("Subject updated successfully");
      } else {
        await createSubject(subject);
        toast.success("Subject created successfully");
      }
      setShowModal(false);
      fetchSubjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save subject");
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingDelete(true);
      await deleteSubject(id);
      toast.success("Subject deleted successfully");
      fetchSubjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete subject");
    } finally {
      setLoadingDelete(false);
      setDeleteModalOpen(false);
      setSubjectToDelete(null);
    }
  };

  /* =========================
     Render
  ========================= */
  return (
    <div className="subject-list">
      {/* Header */}
      <div className="subject-button-container">
        <h2>Subjects</h2>
        <button className="subject-list-button" onClick={handleCreate}>
          + Add Subject
        </button>
      </div>

      {/* Modal for Add/Edit */}
      <AppModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSubject ? "Edit Subject" : "Add Subject"}
        maxWidth="600px"
      >
        <SubjectForm
          subject={editingSubject}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </AppModal>

      {/* Confirm Modal for Delete */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Subject"
        message="Are you sure you want to delete this subject?"
        onConfirm={() => subjectToDelete && handleDelete(subjectToDelete._id)}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSubjectToDelete(null);
        }}
        loading={loadingDelete}
      />

      {/* List */}
      {subjects.length === 0 ? (
        <p className="empty-message">No subjects yet.</p>
      ) : (
        <>
          <ul>
            {paginatedSubjects.map((subject) => (
              <SubjectItem
                key={subject._id}
                subject={subject}
                onEdit={handleEdit}
                onDelete={(id) => {
                  const s = subjects.find((sub) => sub._id === id);
                  setSubjectToDelete(s);
                  setDeleteModalOpen(true);
                }}
              />
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}
