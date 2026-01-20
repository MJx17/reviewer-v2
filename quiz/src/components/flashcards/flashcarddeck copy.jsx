import { useState, useEffect } from "react";
import ConfirmModal from "../ui/confirmModal";
import { toast } from "react-toastify";
import { BiEdit, BiTrash } from "react-icons/bi";
import { GiSpeaker } from "react-icons/gi";
import { getFlashcards, reviewFlashcard, deleteFlashcard } from "../../services/flashcardService";

export default function FlashcardDeck({ subjectId, onEdit, refreshKey, onDeleted }) {
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const card = flashcards[currentIndex];

    // Fetch flashcards on mount or when subject changes
    useEffect(() => {
        loadFlashcards();
    }, [subjectId, refreshKey]);


    const isDue = (card) =>
        card.dueDate && new Date(card.dueDate) <= new Date();

    const getCardState = (card) => {
        if (!card.repetitions || card.repetitions === 0) return "new"; // never reviewed
        if (card.state === "relearning") return "relearning"; // failed last review
        if (card.state === "mastered") return "mastered"; // reached max interval
        if (isDue(card)) return "review"; // due for review
        return "review"; // in future review, still review
    };



    const toggleFlip = () => setFlipped((prev) => !prev);

    // Handle review
    const handleReview = async (flashcardId, rating) => {
        try {
            await reviewFlashcard(flashcardId, rating);
            toast.success("Flashcard reviewed");
            await loadFlashcards();
        } catch (err) {
            console.error(err);
            toast.error("Failed to review flashcard");
        }
    };


    const loadFlashcards = async () => {
        try {
            const data = await getFlashcards(subjectId);
            setFlashcards(data);
            setCurrentIndex((prev) => Math.min(prev, data.length - 1));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load flashcards");
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!card) return;
        try {
            setLoading(true);
            await deleteFlashcard(card._id);
            toast.success("Flashcard deleted");

            // Refetch flashcards
            const updatedCards = await loadFlashcards();

            // Call parent callback to update any other lists
            onDeleted?.(card._id);

            setCurrentIndex((prev) => Math.min(prev, updatedCards?.length - 1 || 0));
            setModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete flashcard");
        } finally {
            setLoading(false);
        }
    };


    // Navigation
    const nextCard = () => {
        setFlipped(false);
        setCurrentIndex((prev) => Math.min(prev + 1, flashcards.length - 1));
    };

    const prevCard = () => {
        setFlipped(false);
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    if (!card) return <p>No flashcards to show.</p>;

    return (
        <div className="flashcard-deck-container">
            {/* Card Counter */}
            <div className="deck-counter">
                {currentIndex + 1} / {flashcards.length}
            </div>

            {/* Card */}
            <div className={`card ${flipped ? "flipped" : ""} ${getCardState(card)}`}>
                <div className="card-inner" onClick={toggleFlip}>
                    <div className="front">
                        <p className="question-div">{card.question}</p>
                    </div>
                    <div className="back">
                        <p className="answer-div">{card.answer}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="card-footer">
                    <div className="card-actions">
                        <GiSpeaker className="icon-speak" onClick={() => speakText(card, currentIndex)} title="Read question" />
                        <BiEdit className="icon-edit" onClick={() => onEdit?.(card)} title="Edit card" />
                        <BiTrash className="icon-delete" onClick={() => setModalOpen(true)} title="Delete card" />
                    </div>

                    <div className="review-actions">
                        <button className="btn-hard" onClick={() => handleReview(card._id, 1)}>Hard</button>
                        <button className="btn-good" onClick={() => handleReview(card._id, 3)}>Good</button>
                        <button className="btn-easy" onClick={() => handleReview(card._id, 5)}>Easy</button>
                    </div>

                    {card.explanation && (
                        <div className="flashcard-explanation">
                            <span className="explanation-label">Explanation</span>
                            <span className="explanation-text">{card.explanation}</span>
                            <GiSpeaker className="explanation-speaker" onClick={() => speakExplanation(card.explanation, currentIndex)} title="Read explanation" />
                        </div>
                    )}

                    {card.dueDate && (
                        <div className={`flashcard-due ${isDue(card) ? "overdue" : ""}`}>
                            Next review: {new Date(card.dueDate).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="deck-navigation">
                <button onClick={prevCard} disabled={currentIndex === 0}>Prev</button>
                <button onClick={nextCard} disabled={currentIndex === flashcards.length - 1}>Next</button>
            </div>

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={modalOpen}
                title="Delete Flashcard"
                message="Are you sure you want to delete this flashcard?"
                onConfirm={handleDelete}
                onCancel={() => setModalOpen(false)}
                loading={loading}
            />
        </div>
    );
}
