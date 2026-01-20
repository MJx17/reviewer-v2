import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/login.css";
import { login, getProfile } from "../services/authService";
import { useAuth } from "../context/authContext";
import Loading from "../components/ui/loading"; // optional spinner

const LoginModal = () => {

  const bodyRef = useRef(document.body);
  const modalRef = useRef(null);
  const modalButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const scrollDownRef = useRef(null);

  const [isOpened, setIsOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ===== Modal control =====
  const openModal = () => {
    if (modalRef.current) modalRef.current.classList.add("login-is-open");
    if (bodyRef.current) bodyRef.current.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (modalRef.current) modalRef.current.classList.remove("login-is-open");
    if (bodyRef.current) bodyRef.current.style.overflow = "auto";
  };

  // ===== Auto open on scroll =====
  const handleScroll = () => {
    if (window.scrollY > 500 && !isOpened) {
      setIsOpened(true);
      if (scrollDownRef.current) scrollDownRef.current.style.display = "none";
      openModal();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpened]);

  // ===== Button bindings & ESC key =====
  useEffect(() => {
    if (modalButtonRef.current) modalButtonRef.current.addEventListener("click", openModal);
    if (closeButtonRef.current) closeButtonRef.current.addEventListener("click", closeModal);

    document.onkeydown = (evt) => {
      if (evt.key === "Escape" || evt.keyCode === 27) closeModal();
    };

    return () => {
      if (modalButtonRef.current) modalButtonRef.current.removeEventListener("click", openModal);
      if (closeButtonRef.current) closeButtonRef.current.removeEventListener("click", closeModal);
    };
  }, []);

  // ===== Handle login submission =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);

      // ✅ use API service (correct base URL + refresh handling)
      const profile = await getProfile();
      setUser(profile.user);

      const from = location.state?.from?.pathname || "/todos";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="login-container" style={{ height: "200vh" }}>
      {loading && (
        <div className="loading-overlay">
          <Loading />
        </div>
      )}
      {/* Scroll down indicator */}
      <div className="login-scroll-down" ref={scrollDownRef}>
        SCROLL DOWN
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path d="M16 3C8.832031 3 3 8.832031 3 16s5.832031 13 13 13 13-5.832031 13-13S23.167969 3 16 3zm0 2c6.085938 0 11 4.914063 11 11 0 6.085938-4.914062 11-11 11-6.085937 0-11-4.914062-11-11C5 9.914063 9.914063 5 16 5zm-1 4v10.28125l-4-4-1.40625 1.4375L16 23.125l6.40625-6.40625L21 15.28125l-4 4V9z" />
        </svg>
      </div>

      {/* Modal Layout */}
      <div className={`login-modal ${isOpened ? "login-is-open" : ""}`} ref={modalRef}>
        <div className="login-modal-container">
          <div className="login-modal-left">
            <h1 className="login-modal-title">Welcome!</h1>
            <p className="login-modal-desc">Please login to continue.</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-input-block">
                <label htmlFor="login-email" className="login-input-label">Email</label>
                <input
                  type="email"
                  name="email"
                  id="login-email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="login-input"
                />
              </div>

              <div className="login-input-block">
                <label htmlFor="login-password" className="login-input-label">Password</label>
                <input
                  type="password"
                  name="password"
                  id="login-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                />
              </div>

              {error && <p className="login-error">{error}</p>}

              <div className="login-modal-buttons">
                <a href="forgot-password" className="login-forgot-password">Forgot your password?</a>
                <button className="login-input-button" type="submit">
                  login
                </button>
              </div>
            </form>

            {/* <p className="login-sign-up">
              Don't have an account? <a href="#">Sign up now</a>
            </p> */}
          </div>

          <div className="login-modal-right">
            <img
              src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=1000&q=80"
              alt="modal"
              className="login-modal-image"
            />
          </div>

          <button className="login-icon-button login-close-button" ref={closeButtonRef}>
            ✖
          </button>
        </div>

        <button className="login-modal-button" ref={modalButtonRef}>
          Click here to login
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
