import React, { useState, useEffect, useRef } from 'react';
import '../../styles/flashcard.css';
import {IoMdCloseCircle} from 'react-icons/io';
import {BiEdit} from 'react-icons/bi';
import {BiTrash} from 'react-icons/bi';
import {GiSpeaker} from 'react-icons/gi';
import {BiSkipPreviousCircle} from 'react-icons/bi';
import {BiSkipNextCircle} from 'react-icons/bi';

const FlashcardApp = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [cards, setCards] = useState([]);
  const [isAddCardVisible, setIsAddCardVisible] = useState(false);
  const [isEditCardVisible, setIsEditCardVisible] = useState(false);
  const [editCardIndex, setEditCardIndex] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Track the currently displayed card
  const [flippedCards, setFlippedCards] = useState([]);

  const updateLocalStorage = (updatedCards) => {
    localStorage.setItem('flashcards', JSON.stringify(updatedCards));
  };

  useEffect(() => {
    const storedData = localStorage.getItem('flashcards');
    if (storedData) {
      setCards(JSON.parse(storedData));
    }
  }, []);

  const addCard = () => {
    if (question.trim() === '' || answer.trim() === '') {
      return; // Prevent adding empty cards
    }

    const newCard = {
      question,
      answer,
      showAnswer: false,
    };

    // Update the state with the new card
    setCards([...cards, newCard]);

    // Update local storage with the updated cards
    const updatedCards = [...cards, newCard];
    updateLocalStorage(updatedCards);

    // Clear the input fields and hide the add card form
    setQuestion('');
    setAnswer('');
    setIsAddCardVisible(false);
  };

  const editCard = (index) => {
    const cardToEdit = cards[index];
    setQuestion(cardToEdit.question);
    setAnswer(cardToEdit.answer);
    setEditCardIndex(index);
    setIsEditCardVisible(true);
  };

  const saveEditedCard = () => {
    if (question.trim() === '' || answer.trim() === '') {
      return; // Prevent saving empty cards
    }

    const updatedCards = [...cards];
    updatedCards[editCardIndex] = { question, answer, showAnswer: false };
    setCards(updatedCards);

    // Update local storage with the edited cards
    updateLocalStorage(updatedCards);

    setQuestion('');
    setAnswer('');
    setIsEditCardVisible(false);
    setEditCardIndex(null);
  };

  const deleteCard = (index) => {
    const updatedCards = [...cards];
    updatedCards.splice(index, 1);
    setCards(updatedCards);

    // Update local storage with the updated cards
    updateLocalStorage(updatedCards);
  };

  const toggleCardFlip = (index) => {
    const newFlippedCards = [...flippedCards];
    if (newFlippedCards.includes(index)) {
      const cardIndex = newFlippedCards.indexOf(index);
      newFlippedCards.splice(cardIndex, 1);
    } else {
      newFlippedCards.push(index);
    }
    setFlippedCards(newFlippedCards);
  };

    // Function to show the next card
    const showNextCard = () => {
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      }
    };
  
    // Function to show the previous card
    const showPreviousCard = () => {
      if (currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1);
      }
    };
    

    const containerRef = useRef(null);

    const scrollLeft = () => {
      const container = containerRef.current;
      if (container) {
        const containerStyles = window.getComputedStyle(container);
        const scrollAmount = parseInt(containerStyles.getPropertyValue('--scroll-amount'), 10) || 1000;
        container.scrollLeft -= scrollAmount;
      }
    };
    
    const scrollRight = () => {
      const container = containerRef.current;
      if (container) {
        const containerStyles = window.getComputedStyle(container);
        const scrollAmount = parseInt(containerStyles.getPropertyValue('--scroll-amount'), 10) || 1000;
        container.scrollLeft += scrollAmount;
      }
    };
   
    const speakText = (card, index) => {
      const utterance = new SpeechSynthesisUtterance();
    
      if (flippedCards.includes(index)) {
        utterance.text = card.answer;
      } else {
        utterance.text = card.question;
      }
    
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      } else {
        window.speechSynthesis.speak(utterance);
      }
    };
    
    
  return (
    <div className="body-container">
    <div className="add-flashcard-con">
      <button onClick={() => setIsAddCardVisible(true)}>Add Flashcard</button>
    </div>
    <div id="card-con">
  <div className="card-list-container" ref={containerRef}>
    {cards.map((card, index) => (
      <div key={index} className={`card ${flippedCards.includes(index) ? 'flipped' : ''}`}>
        <div className="card-inner" onClick={() => toggleCardFlip(index)}>
          <div className="front">
            <p className="question-div">{card.question}</p>
          </div>
          <div className={`back ${flippedCards.includes(index) ? 'visible' : ''}`}>
            <p className="answer-div">{card.answer}</p>
          </div>
        </div>
        <div className="buttons-con">
        <GiSpeaker onClick={() => speakText(card, index)}/>
    
          
            <BiEdit onClick={() => editCard(index)}/>
          
          <BiTrash onClick={() => deleteCard(index)}/>
           
        </div>
      </div>
    ))}

      
      </div>
      <div className="slider-button">
            <BiSkipPreviousCircle className="prev-btn" onClick={scrollLeft}/>
            <BiSkipNextCircle className="next-btn" onClick={scrollRight}/> 
          </div>
    </div>



      {isAddCardVisible && (
        <div className="question-container">
          <h2>Add Flashcard</h2>
          <div className="wrapper">
            <div className="error-con">
              <span className="hide" id="error">
                Input fields cannot be empty!
              </span>
            </div>
            <IoMdCloseCircle  id="close-btn" onClick={() => setIsAddCardVisible(false)}/>
          </div>
          <label htmlFor="question">Question:</label>
          <textarea
            className="input"
            id="question"
            placeholder="Type the question here..."
            rows="2"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></textarea>
          <label htmlFor="answer">Answer:</label>
          <textarea
            className="input"
            id="answer"
            rows="4"
            placeholder="Type the answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          ></textarea>
          <button id="save-btn" onClick={addCard}>
            Save
          </button>
        </div>
      )}

      {isEditCardVisible && (
        <div className="question-container">
          <h2>Edit Flashcard</h2>
          <div className="wrapper">
          <IoMdCloseCircle id="close-btn" onClick={() => setIsEditCardVisible(false)}/>
          </div>
          <label htmlFor="question">Question:</label>
          <textarea
            className="input"
            id="question"
            rows="2"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></textarea>
          <label htmlFor="answer">Answer:</label>
          <textarea
            className="input"
            id="answer"
            rows="4"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          ></textarea>
          <button id="save-btn" onClick={saveEditedCard}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashcardApp;