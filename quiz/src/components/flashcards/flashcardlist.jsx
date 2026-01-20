import { useEffect, useState, useRef, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { toast } from "react-toastify";
import { BiEdit, BiTrash } from "react-icons/bi";
import { GiSpeaker } from "react-icons/gi";
import ConfirmModal from "../ui/confirmModal";
import {
  getFlashcards,
  reviewFlashcard,
  deleteFlashcard,
} from "../../services/flashcardService";

import { SimpleArrowNav } from "../ui/navigation-icons";

export default function FlashcardSwiper({ subjectId, refreshKey, onEdit }) {
  /* ======================
     State
  ====================== */
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const [isReading, setIsReading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(null);

  /* ======================
     Helpers
  ====================== */
  const isDue = (card) =>
    card.dueDate && new Date(card.dueDate) <= new Date();

  const getCardState = (card) => {
    if (!card.repetitions || card.repetitions === 0) return "new"; // never reviewed
    if (card.state === "relearning") return "relearning"; // failed last review
    if (card.state === "mastered") return "mastered"; // reached max interval
    if (isDue(card)) return "review"; // due for review
    return "review"; // in future review, still review
  };

  const filteredFlashcards = useMemo(() => {
    if (filter === "all") return flashcards;
    if (filter === "due") return flashcards.filter(isDue);
    return flashcards.filter((c) => getCardState(c) === filter);
  }, [flashcards, filter]);

  /* ======================
     Data loading
  ====================== */
  const loadFlashcards = async () => {
    if (!subjectId) return;
    try {
      setLoading(true);

      // Use backend filtering if filter !== 'all'
      const stateParam = filter === "all" ? "" : `&state=${filter}`;
      const cards = await getFlashcards(subjectId, stateParam);

      setFlashcards(Array.isArray(cards) ? cards : []);
      setFlippedCards([]);
    } catch (err) {
      console.error("Failed to load flashcards:", err);
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!subjectId) return;
    loadFlashcards();
  }, [subjectId, refreshKey]);

  useEffect(() => {
    if (!swiperRef.current) return;
    const swiper = swiperRef.current;
    if (!swiper.navigation || !prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.init();
    swiper.navigation.update();
  }, []);

  /* ======================
     Actions
  ====================== */
  const toggleCardFlip = (index) => {
    setFlippedCards((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const speakText = (card, index) => {
    stopSpeaking(); // stop any existing speech

    const text = flippedCards.includes(index) ? card.answer : card.question;
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

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setCurrentCardIndex(null);
  };

  // Cleanup on unmount so speech doesn't persist
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleReview = async (id, grade) => {
    await reviewFlashcard(id, grade);
    loadFlashcards();
  };

  /* ======================
     Guards
  ====================== */
  if (!subjectId)
    return <p className="empty-state">No subject selected.</p>;
  if (loading)
    return <p className="empty-state">Loading flashcards...</p>;
  if (!flashcards.length)
    return <p className="empty-state">No flashcards yet.</p>;

  /* ======================
     Render
  ====================== */
  return (
    <div className="flashcard-swiper-container" style={{ position: "relative" }}>
      {/* Filters */}
      <div className="flashcard-filters">
        {["all", "new", "review", "relearning", "mastered", "due"].map((state) => (
          <button
            key={state}
            className={`${state} ${filter === state ? "active" : ""}`}
            onClick={() => setFilter(state)}
          >
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </button>
        ))}
      </div>



      {/* Arrow navigation */}
      <SimpleArrowNav prevRef={prevRef} nextRef={nextRef} />

      <Swiper
        modules={[Pagination, Navigation]}
        slidesPerView={1}
        spaceBetween={20}
        centeredSlides
        pagination={{ clickable: true }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="mySwiper"
      >
        {filteredFlashcards.map((card, index) => {
          const state = getCardState(card);

          return (
            <SwiperSlide key={card._id}>
              <div className={`card ${flippedCards.includes(index) ? "flipped" : ""} ${card.state}`}>

                {/* Status badge */}

                {/* Card face */}
                <div
                  className="card-inner"
                  onClick={() => toggleCardFlip(index)}
                >
                  <div className="front">
                    <p className="question-div">{card.question}</p>
                  </div>
                  <div className="back">
                    <p className="answer-div">{card.answer}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="card-footer">
                  {/* Utilities */}
                  <div className="card-actions">
                    <GiSpeaker
                      className={`icon-speak ${isReading && currentCardIndex === index ? "reading" : ""}`}
                      onClick={() => {
                        if (isReading && currentCardIndex === index) {
                          stopSpeaking();
                        } else {
                          speakText(card, index);
                        }
                      }}
                      title={isReading && currentCardIndex === index ? "Stop reading" : "Read question"}
                    />
                    <BiEdit
                      className="icon-edit"
                      onClick={() => onEdit?.(card)}
                      title="Edit card"
                    />
                    <BiTrash
                      className="icon-delete"
                      onClick={() => {
                        setSelectedCard(card);
                        setModalOpen(true);
                      }}
                      title="Delete card"
                    />

                    <ConfirmModal
                      isOpen={modalOpen}
                      title="Delete Flashcard"
                      message="Are you sure you want to delete this flashcard?"
                      onConfirm={async () => {
                        if (!selectedCard) return;
                        try {
                          setLoading(true);
                          await deleteFlashcard(selectedCard._id);
                          toast.success("Flashcard deleted");
                          loadFlashcards(); // reload list
                          setModalOpen(false);
                        } catch (err) {
                          console.error(err);
                          toast.error("Failed to delete flashcard");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      onCancel={() => setModalOpen(false)}
                      loading={loading}
                    />



                  </div>

                  {/* Review */}
                  <div className="review-actions">
                    <button className="btn-hard" onClick={() => handleReview(card._id, 1)}>
                      Hard
                    </button>
                    <button className="btn-good" onClick={() => handleReview(card._id, 3)}>
                      Good
                    </button>
                    <button className="btn-easy" onClick={() => handleReview(card._id, 5)}>
                      Easy
                    </button>
                  </div>

                  {/* Explanation */}
                  {card.explanation && (
                    <div className="flashcard-explanation">
                      <span className="explanation-label">Explanation</span>
                      <span className="explanation-text">{card.explanation}</span>
                      <GiSpeaker
                        className={`explanation-speaker ${isReading && currentCardIndex === index ? "reading" : ""}`}
                        onClick={() => {
                          if (isReading && currentCardIndex === index) {
                            stopSpeaking();
                          } else {
                            speakExplanation(card.explanation, index);
                          }
                        }}
                        title={isReading && currentCardIndex === index ? "Stop reading" : "Read explanation"}
                      />
                    </div>
                  )}

                  {/* Due date */}
                  {card.dueDate && (
                    <div className={`flashcard-due ${isDue(card) ? "overdue" : ""}`}>
                      Next review: {new Date(card.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
