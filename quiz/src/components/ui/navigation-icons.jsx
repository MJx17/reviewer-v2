import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import "../../styles/icon.css";

export const SimpleArrowNav = ({ onPrev, onNext, isBeginning, isEnd }) => {
  return (
    <div className="arrow-nav-container">
      <button
        onClick={onPrev}
        disabled={isBeginning}
        className={`arrow-button ${isBeginning ? "disabled" : "active"}`}
      >
        <FaArrowAltCircleLeft size={30} />
      </button>

      <button
        onClick={onNext}
        disabled={isEnd}
        className={`arrow-button ${isEnd ? "disabled" : "active"}`}
      >
        <FaArrowAltCircleRight size={30} />
      </button>
    </div>
  );
};



// import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
// import "../../styles/icon.css";

// // Full Version with beginning/end logic
// export const ArrowNav = ({ onPrev, onNext, isBeginning, isEnd }) => {
//   return (
//     <>
//       <button
//         className={`custom-prev-button ${isBeginning ? "hidden" : ""}`}
//         onClick={onPrev}
//       >
//         <FaArrowAltCircleLeft size={30} />
//       </button>
//       <button
//         className={`custom-next-button ${isEnd ? "hidden" : ""}`}
//         onClick={onNext}
//       >
//         <FaArrowAltCircleRight size={30} />
//       </button>
//     </>
//   );
// };

// // Simplified Version (no beginning/end logic)
// export const SimpleArrowNav = ({ onPrev, onNext }) => {
//   return (
//     <>
//       <button className="custom-prev-button-home" onClick={onPrev}>
//         <FaArrowAltCircleLeft size={30} />
//       </button>
//       <button className="custom-next-button-home" onClick={onNext}>
//         <FaArrowAltCircleRight size={30} />
//       </button>
//     </>
//   );
// };
