import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/passwordService";
import { checkPasswordRules } from "../utils/passwordValidation";
import Loading from "../components/ui/loading"; // ✅ your loading component
import "../styles/auth.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordStatus = checkPasswordRules(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    if (!passwordStatus.every((r) => r.valid)) {
      return setError("Please follow all password requirements");
    }

    setLoading(true);

    try {
      const res = await resetPassword(token, password);
      setSuccess(res.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Reset failed"); // generic message
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />; // ✅ just render the loading component

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <p className="auth-subtitle">Create a new secure password.</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="password-rules">
          {passwordStatus.map((r) => (
            <p
              key={r.message}
              style={{ color: r.valid ? "green" : "red", margin: 0, fontSize: "0.9rem" }}
            >
              {r.valid ? "✔" : "✖"} {r.message}
            </p>
          ))}
        </div>

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
