import { useState, useEffect } from "react";
import ConfirmModal from "../ui/confirmModal";
import { toast } from "react-toastify";
import { BiEdit, BiTrash } from "react-icons/bi";
import { GiSpeaker } from "react-icons/gi";
import { getFlashcards, reviewFlashcard, deleteFlashcard } from "../../services/flashcardService";
import SwipeContainer from "../ui/SwiperContainer";
import { SimpleArrowNav } from "../ui/navigation-icons";


export default function FlashcardDeck({ subjectId, onEdit, refreshKey, onDeleted }) {
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [isReading, setIsReading] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(null);

    const card = flashcards[currentIndex];

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    useEffect(() => {
        loadFlashcards();
    }, [subjectId, refreshKey]);

    const isDue = (card) => card.dueDate && new Date(card.dueDate) <= new Date();

    const getCardState = (card) => {
        if (!card.repetitions || card.repetitions === 0) return "new";
        if (card.state === "relearning") return "relearning";
        if (card.state === "mastered") return "mastered";
        if (isDue(card)) return "review";
        return "review";
    };

    const toggleFlip = () => setFlipped((prev) => !prev);

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
        if (!subjectId) return;

        try {
            setLoading(true);

            // Pass subjectId explicitly
            const cards = await getFlashcards({ subjectId });

            setFlashcards(Array.isArray(cards) ? cards : []);
            setCurrentIndex(0);  // reset to first card
            setFlipped(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load flashcards");
            setFlashcards([]);
        } finally {
            setLoading(false);
        }
    };



    const handleDelete = async () => {
        if (!card) return;
        try {
            setLoading(true);
            await deleteFlashcard(card._id);
            toast.success("Flashcard deleted");

            await loadFlashcards();
            onDeleted?.(card._id);
            setCurrentIndex((prev) => Math.min(prev, flashcards.length - 1));
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



    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsReading(false);
        setCurrentCardIndex(null);
    };

    const speakText = (card, index) => {
        stopSpeaking(); // stop any existing speech

        const text = flipped ? card.answer : card.question;
        if (!text) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onend = () => {
            setIsReading(false);
            setCurrentCardIndex(null);
        };

        setCurrentCardIndex(index);
        setIsReading(true);
        window.speechSynthesis.speak(utterance);
    };

    const speakExplanation = (text, index) => {
        stopSpeaking();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onend = () => {
            setIsReading(false);
            setCurrentCardIndex(null);
        };

        setCurrentCardIndex(index);
        setIsReading(true);
        window.speechSynthesis.speak(utterance);
    };





    return (
        <SwipeContainer onNext={nextCard} onPrev={prevCard}>
            <div className="flashcard-deck-container">
                {/* Card Counter */}


                {/* Card */}
                <div className="card-swiper-container">

                    <SimpleArrowNav
                        onPrev={prevCard}
                        onNext={nextCard}
                        isBeginning={currentIndex === 0}
                        isEnd={currentIndex === flashcards.length - 1}
                    />



                    <div className={`card ${flipped ? "flipped" : ""} ${getCardState(card)}`}>
                        {/* Only tap triggers flip now */}
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

                            <div className="card-actions-row">
                                {/* Left side: Counter */}


                                <div className="deck-counter">
                                    {currentIndex + 1} / {flashcards.length}
                                </div>


                                {/* Right side: Action icons */}
                                <div className="card-actions">
                                    <GiSpeaker
                                        className={`icon-speak ${isReading && currentCardIndex === currentIndex ? "reading" : ""}`}
                                        onClick={() => {
                                            if (isReading && currentCardIndex === currentIndex) {
                                                stopSpeaking();
                                            } else {
                                                speakText(card, currentIndex);
                                            }
                                        }}
                                        title={isReading && currentCardIndex === currentIndex ? "Stop reading" : "Read question"}
                                    />
                                    <BiEdit
                                        className="icon-edit"
                                        onClick={() => onEdit?.(card)}
                                        title="Edit card"
                                    />
                                    <BiTrash
                                        className="icon-delete"
                                        onClick={() => setModalOpen(true)}
                                        title="Delete card"
                                    />
                                </div>
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
                                    <GiSpeaker
                                        className={`explanation-speaker ${isReading && currentCardIndex === currentIndex ? "reading" : ""}`}
                                        onClick={() => {
                                            if (isReading && currentCardIndex === currentIndex) {
                                                stopSpeaking();
                                            } else {
                                                speakExplanation(card.explanation, currentIndex);
                                            }
                                        }}
                                        title={isReading && currentCardIndex === currentIndex ? "Stop reading" : "Read explanation"}
                                    />
                                </div>
                            )}

                            {card.dueDate && (
                                <div className={`flashcard-due ${isDue(card) ? "overdue" : ""}`}>
                                    Next review: {new Date(card.dueDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
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
        </SwipeContainer >
    );
}
