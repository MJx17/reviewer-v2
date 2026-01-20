import { Link } from "react-router-dom";
import "../styles/unauthorized.css";

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1 className="unauthorized-title">401</h1>
      <p className="unauthorized-message">
        You don’t have permission to view this page.
      </p>
      <Link to="/login" className="unauthorized-button">
        Go to Login
      </Link>
    </div>
  );
};

export default Unauthorized;
