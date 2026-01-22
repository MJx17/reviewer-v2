import { useState } from "react";
import { sendSupportMessage } from "../../services/supportService";
import { toast } from "react-toastify";
import "../../styles/home.css";

export default function SupportSection({ userName }) {
  const [name, setName] = useState(userName || "");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendSupportMessage({ name, email, message });
      toast.success("Message sent successfully!");
      setEmail("");
      setMessage("");
    } catch (err) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="support-section section-theme-3">
      <div className="support-container">
        {/* Left: Image */}
        <div className="support-image">
          <img src="/help.jpg" alt="Support" />
        </div>

        {/* Right: Form */}
        <div className="support-card">
          <h2 className="support-title">Need Help? Contact Support</h2>
          {/* <p className="support-subtitle">
            We’re here to help. Fill out the form and we’ll get back to you shortly.
          </p> */}
          <form className="support-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
