import { useEffect, useState } from "react";
import { createFlashcard, updateFlashcard } from "../../services/flashcardService";
import { toast } from "react-toastify";

export default function GeneralFlashcardForm({ flashcard, onSuccess, onCancel }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(flashcard?.subjectId || "");
  const [question, setQuestion] = useState(flashcard?.question || "");
  const [answer, setAnswer] = useState(flashcard?.answer || "");
  const [explanation, setExplanation] = useState(flashcard?.explanation || "");
  const [loading, setLoading] = useState(false);

  // Load all subjects for the dropdown
  useEffect(() => {
    fetch("http://localhost:3001/subjects")
      .then((res) => res.json())
      .then(setSubjects)
      .catch(() => toast.error("Failed to load subjects"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }

    if (!question.trim() || !answer.trim()) {
      toast.error("Question and Answer are required");
      return;
    }

    const payload = {
      question: question.trim(),
      answer: answer.trim(),
      explanation: explanation.trim(),
      subjectId: selectedSubject,
    };

    try {
      setLoading(true);

      const result = flashcard
        ? await updateFlashcard(flashcard._id, payload)
        : await createFlashcard(payload);

      toast.success(flashcard ? "Flashcard updated" : "Flashcard created");
      onSuccess?.(result);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save flashcard");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form className="flashcard-form" onSubmit={handleSubmit}>
      {/* Always show the subject dropdown */}
      <div className="form-group">
        <label>Subject</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Select subject</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Question</label>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Answer</label>
        <input value={answer} onChange={(e) => setAnswer(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Explanation</label>
        <textarea
          rows="3"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
      </div>

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : flashcard ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
