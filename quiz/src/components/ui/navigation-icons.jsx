import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa"
import "../../styles/icon.css";

// Full Version with beginning/end logic
export const ArrowNav = ({ prevRef, nextRef, isBeginning, isEnd }) => {
  return (
    <>
      <button
        className={`custom-prev-button ${isBeginning ? "hidden" : ""}`}
        ref={prevRef}
      >
        <FaArrowAltCircleLeft size={30} />
      </button>
      <button
        className={`custom-next-button ${isEnd ? "hidden" : ""}`}
        ref={nextRef}
      >
        <FaArrowAltCircleRight size={30} />
      </button>
    </>
  );
};

// Simplified Version (no beginning/end logic)
export const SimpleArrowNav = ({ prevRef, nextRef }) => {
  return (
    <>
      <button className="custom-prev-button-home" ref={prevRef}>
        <FaArrowAltCircleLeft size={30} />
      </button>
      <button className="custom-next-button-home" ref={nextRef}>
        <FaArrowAltCircleRight size={30} />
      </button>
    </>
  );
};
