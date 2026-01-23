'use client';

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import FlashcardDeck from "../components/flashcards/flashcarddeck";
import AppModal from "../components/ui/modal";
import AddFlashcardForm from "../components/flashcards/AddFlashcardForm";
import { toast } from "react-toastify";
import "../styles/flashcard.css";
import Loading from "../components/ui/loading";

// ✅ Service import
import { getSubjectById } from "../services/subjectService";

export default function SubjectFlashcardsPage() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch subject whenever subjectId changes
  useEffect(() => {
    if (!subjectId) return;
    fetchSubject();
  }, [subjectId]);

  const fetchSubject = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSubjectById(subjectId);
      if (!data) throw new Error("Subject not found");
      setSubject(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load subject");
      toast.error("Failed to load subject");
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleEdit = (card) => {
    setSelectedFlashcard(card);
    setModalOpen(true);
  };

  const handleAddFlashcard = () => {
    setSelectedFlashcard(null);
    setModalOpen(true);
  };

  const handleSaveFlashcard = () => {
    setModalOpen(false);
    setSelectedFlashcard(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancelEdit = () => {
    setModalOpen(false);
    setSelectedFlashcard(null);
  };

  // Early returns for safety
  if (!subjectId) return <p>No subject selected.</p>;
  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;
  if (!subject) return <p>Subject not found.</p>;

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
      />

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
