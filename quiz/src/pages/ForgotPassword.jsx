import { useState } from "react";
import { forgotPassword } from "../services/passwordService";
import { Link } from "react-router-dom";
import Loading from "../components/ui/loading"; // ✅ use your loading component
import "../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setSuccess(res.message || "Reset link sent. Check your email.");
      setEmail("");
    } catch (err) {
      setError("Something went wrong"); // generic message
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />; // ✅ show loading screen

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <p className="auth-subtitle">
          Enter your email and we’ll send you a reset link.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send Reset Link</button>

        <div className="auth-footer">
          <Link to="/login">Back to login</Link>
        </div>
      </form>
    </div>
  );
}
